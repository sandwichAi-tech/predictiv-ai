
-- Add subscriber_id link columns
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS subscriber_id uuid;
ALTER TABLE public.live_visitors ADD COLUMN IF NOT EXISTS subscriber_id uuid;

CREATE INDEX IF NOT EXISTS idx_analytics_events_subscriber_created
  ON public.analytics_events (subscriber_id, created_at)
  WHERE subscriber_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_live_visitors_subscriber_last_seen
  ON public.live_visitors (subscriber_id, last_seen)
  WHERE subscriber_id IS NOT NULL;

-- Country breakdown RPC
CREATE OR REPLACE FUNCTION public.get_country_breakdown(
  start_date timestamptz,
  end_date timestamptz,
  max_rows integer DEFAULT 25
)
RETURNS TABLE(country text, country_code text, visitors bigint, total_visitors bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH per_country AS (
    SELECT
      COALESCE(country, 'Unknown') AS country,
      (ARRAY_AGG(country_code) FILTER (WHERE country_code IS NOT NULL))[1] AS country_code,
      COUNT(DISTINCT visitor_id) AS visitors
    FROM public.analytics_events
    WHERE created_at >= start_date AND created_at <= end_date
      AND country IS NOT NULL AND visitor_id IS NOT NULL
    GROUP BY COALESCE(country, 'Unknown')
  ),
  totals AS (
    SELECT COUNT(DISTINCT visitor_id) AS total_visitors
    FROM public.analytics_events
    WHERE created_at >= start_date AND created_at <= end_date AND visitor_id IS NOT NULL
  )
  SELECT pc.country, pc.country_code, pc.visitors, t.total_visitors
  FROM per_country pc CROSS JOIN totals t
  ORDER BY pc.visitors DESC
  LIMIT max_rows;
$$;
GRANT EXECUTE ON FUNCTION public.get_country_breakdown(timestamptz, timestamptz, integer) TO authenticated;

-- Traffic breakdowns RPC
CREATE OR REPLACE FUNCTION public.get_traffic_breakdowns(
  start_date timestamptz,
  end_date timestamptz,
  max_rows integer DEFAULT 8
)
RETURNS TABLE(dimension text, label text, visitors bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH base AS (
    SELECT visitor_id, utm_source, referrer, device_type, page_url
    FROM public.analytics_events
    WHERE event_type = 'pageview'
      AND created_at >= start_date AND created_at <= end_date
      AND visitor_id IS NOT NULL
  ),
  sources AS (
    SELECT 'source'::text AS dimension,
      COALESCE(
        NULLIF(utm_source, ''),
        CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
             ELSE regexp_replace(regexp_replace(referrer, '^https?://(www\.)?', ''), '/.*$', '')
        END, 'Direct') AS label,
      COUNT(DISTINCT visitor_id) AS visitors
    FROM base GROUP BY 2
  ),
  devices AS (
    SELECT 'device'::text, COALESCE(NULLIF(device_type, ''), 'unknown'), COUNT(DISTINCT visitor_id)
    FROM base GROUP BY 2
  ),
  pages AS (
    SELECT 'page'::text,
      COALESCE(NULLIF(regexp_replace(COALESCE(page_url, '/'), '^https?://[^/]+', ''), ''), '/'),
      COUNT(DISTINCT visitor_id)
    FROM base GROUP BY 2
  ),
  unioned AS (
    SELECT * FROM sources UNION ALL SELECT * FROM devices UNION ALL SELECT * FROM pages
  ),
  ranked AS (
    SELECT dimension, label, visitors,
      ROW_NUMBER() OVER (PARTITION BY dimension ORDER BY visitors DESC) AS rn
    FROM unioned
  )
  SELECT dimension, label, visitors FROM ranked WHERE rn <= max_rows
  ORDER BY dimension, visitors DESC;
$$;
GRANT EXECUTE ON FUNCTION public.get_traffic_breakdowns(timestamptz, timestamptz, integer) TO authenticated;

-- Admin combined summary RPC
CREATE OR REPLACE FUNCTION public.get_admin_analytics_summary(
  start_date timestamptz, end_date timestamptz, live_since timestamptz
)
RETURNS TABLE(
  live_visitors bigint, total_visitors bigint, total_hits bigint,
  new_visitors bigint, returning_visitors bigint, total_revisits bigint,
  total_pageviews bigint, total_subscribers bigint, sms_subscribers bigint,
  emails_sent bigint, emails_opened bigint, emails_clicked bigint,
  report_views bigint, report_shares bigint, tearsheet_views bigint, tearsheet_shares bigint,
  podcast_plays bigint, podcast_completes bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH
  analytics_in_range AS MATERIALIZED (
    SELECT event_type, visitor_id, created_at FROM public.analytics_events
    WHERE created_at >= start_date AND created_at <= end_date
  ),
  first_seen AS MATERIALIZED (
    SELECT visitor_id, MIN(created_at) AS first_at FROM public.analytics_events
    WHERE visitor_id IS NOT NULL GROUP BY visitor_id
  ),
  classified AS MATERIALIZED (
    SELECT DISTINCT air.visitor_id,
      CASE WHEN fs.first_at >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM analytics_in_range air JOIN first_seen fs ON fs.visitor_id = air.visitor_id
    WHERE air.visitor_id IS NOT NULL
  ),
  returning_visit_days AS MATERIALIZED (
    SELECT air.visitor_id, COUNT(DISTINCT DATE(air.created_at)) AS visit_days
    FROM analytics_in_range air
    JOIN classified c ON c.visitor_id = air.visitor_id AND c.bucket = 'returning'
    WHERE air.visitor_id IS NOT NULL GROUP BY air.visitor_id
  )
  SELECT
    (SELECT COUNT(*) FROM public.live_visitors WHERE last_seen >= live_since)::bigint,
    (SELECT COUNT(*) FROM classified)::bigint,
    (SELECT COUNT(*) FROM analytics_in_range)::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'new')::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'returning')::bigint,
    COALESCE((SELECT SUM(visit_days) FROM returning_visit_days), 0)::bigint,
    (SELECT COUNT(*) FROM analytics_in_range WHERE event_type = 'pageview')::bigint,
    (SELECT COUNT(*) FROM public.subscribers WHERE created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.subscribers WHERE sms_opted_in = true AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'sent' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'opened' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'clicked' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'report' AND action = 'view' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'report' AND action = 'share' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'tearsheet' AND action = 'view' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'tearsheet' AND action = 'share' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM analytics_in_range WHERE event_type = 'podcast_play')::bigint,
    (SELECT COUNT(*) FROM analytics_in_range WHERE event_type = 'podcast_complete')::bigint;
$$;
GRANT EXECUTE ON FUNCTION public.get_admin_analytics_summary(timestamptz, timestamptz, timestamptz) TO authenticated;

-- Updated daily analytics (pageview-only count)
CREATE OR REPLACE FUNCTION public.get_daily_analytics(start_date timestamptz, end_date timestamptz)
RETURNS TABLE(day date, pageviews bigint, unique_visitors bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT DATE(created_at) AS day,
    COUNT(*) FILTER (WHERE event_type = 'pageview') AS pageviews,
    COUNT(DISTINCT visitor_id) FILTER (WHERE visitor_id IS NOT NULL) AS unique_visitors
  FROM public.analytics_events
  WHERE created_at >= start_date AND created_at <= end_date
  GROUP BY DATE(created_at) ORDER BY day ASC;
$$;
GRANT EXECUTE ON FUNCTION public.get_daily_analytics(timestamptz, timestamptz) TO authenticated;

-- Admin team chat
CREATE TABLE IF NOT EXISTS public.admin_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  user_email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_messages_created_at ON public.admin_messages (created_at DESC);

GRANT SELECT, INSERT ON public.admin_messages TO authenticated;
GRANT ALL ON public.admin_messages TO service_role;

ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin messages" ON public.admin_messages;
CREATE POLICY "Admins can view admin messages" ON public.admin_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can post admin messages" ON public.admin_messages;
CREATE POLICY "Admins can post admin messages" ON public.admin_messages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.prune_old_admin_messages()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_messages WHERE created_at < now() - interval '30 days';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prune_admin_messages ON public.admin_messages;
CREATE TRIGGER trg_prune_admin_messages
AFTER INSERT ON public.admin_messages
FOR EACH STATEMENT EXECUTE FUNCTION public.prune_old_admin_messages();

ALTER TABLE public.admin_messages REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Supporting indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_type_visitor
  ON public.analytics_events (created_at, event_type, visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_country_created_visitor
  ON public.analytics_events (country, created_at, visitor_id)
  WHERE visitor_id IS NOT NULL AND country IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_live_visitors_last_seen_session
  ON public.live_visitors (last_seen, session_id);
CREATE INDEX IF NOT EXISTS idx_email_events_timestamp_type
  ON public.email_events (timestamp, event_type);
CREATE INDEX IF NOT EXISTS idx_document_engagement_created_type_action
  ON public.document_engagement (created_at, document_type, action);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_sms
  ON public.subscribers (created_at, sms_opted_in);
