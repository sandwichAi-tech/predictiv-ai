
-- 1. live_visitors: remove permissive public UPDATE/DELETE/INSERT (service role bypasses RLS)
DROP POLICY IF EXISTS "Anyone can update their presence" ON public.live_visitors;
DROP POLICY IF EXISTS "Authenticated can update presence" ON public.live_visitors;
DROP POLICY IF EXISTS "Authenticated can delete presence" ON public.live_visitors;
DROP POLICY IF EXISTS "Anyone can register presence" ON public.live_visitors;
DROP POLICY IF EXISTS "Authenticated can register presence" ON public.live_visitors;

-- 2. user_roles: explicit deny for INSERT/UPDATE/DELETE from anon/authenticated
CREATE POLICY "Deny role inserts from clients" ON public.user_roles
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny role updates from clients" ON public.user_roles
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny role deletes from clients" ON public.user_roles
  FOR DELETE TO anon, authenticated USING (false);

-- 3. email_events: explicit deny for direct writes from clients (webhook uses service role)
CREATE POLICY "Deny email_events inserts from clients" ON public.email_events
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "Deny email_events updates from clients" ON public.email_events
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Deny email_events deletes from clients" ON public.email_events
  FOR DELETE TO anon, authenticated USING (false);

-- 4. Realtime authorization: restrict admin_messages topic to admins
CREATE POLICY "Admins only on admin_messages realtime topic"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'admin_messages'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- 5. Add admin guards inside admin analytics functions + revoke anon execute
CREATE OR REPLACE FUNCTION public.get_daily_analytics(start_date timestamp with time zone, end_date timestamp with time zone)
 RETURNS TABLE(day date, pageviews bigint, unique_visitors bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT DATE(created_at) AS day,
    COUNT(*) FILTER (WHERE event_type = 'pageview') AS pageviews,
    COUNT(DISTINCT visitor_id) FILTER (WHERE visitor_id IS NOT NULL) AS unique_visitors
  FROM public.analytics_events
  WHERE created_at >= start_date AND created_at <= end_date
    AND public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY DATE(created_at) ORDER BY day ASC;
$function$;

CREATE OR REPLACE FUNCTION public.get_hot_leads()
 RETURNS TABLE(email text, first_name text, open_count bigint, click_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT e.email, s.first_name,
    COUNT(*) FILTER (WHERE e.event_type = 'opened') as open_count,
    COUNT(*) FILTER (WHERE e.event_type = 'clicked') as click_count
  FROM public.email_events e
  LEFT JOIN public.subscribers s ON s.email = e.email
  GROUP BY e.email, s.first_name
  HAVING COUNT(*) FILTER (WHERE e.event_type = 'opened') >= 2
  ORDER BY open_count DESC, click_count DESC
  LIMIT 50;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_visitor_breakdown(start_date timestamp with time zone, end_date timestamp with time zone)
 RETURNS TABLE(new_visitors bigint, returning_visitors bigint, total_visitors bigint, total_revisits bigint)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH first_seen AS (
    SELECT visitor_id, MIN(created_at) AS first_at FROM public.analytics_events
    WHERE visitor_id IS NOT NULL GROUP BY visitor_id
  ),
  in_range AS (
    SELECT DISTINCT visitor_id FROM public.analytics_events
    WHERE visitor_id IS NOT NULL AND created_at >= start_date AND created_at <= end_date
  ),
  classified AS (
    SELECT ir.visitor_id,
      CASE WHEN fs.first_at >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM in_range ir JOIN first_seen fs USING (visitor_id)
  ),
  returning_visit_counts AS (
    SELECT ae.visitor_id, COUNT(DISTINCT DATE(ae.created_at)) AS visit_days
    FROM public.analytics_events ae
    WHERE ae.visitor_id IN (SELECT visitor_id FROM classified WHERE bucket = 'returning')
    GROUP BY ae.visitor_id
  )
  SELECT
    (SELECT COUNT(*) FROM classified WHERE bucket = 'new')::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'returning')::bigint,
    (SELECT COUNT(*) FROM classified)::bigint,
    COALESCE((SELECT SUM(visit_days) FROM returning_visit_counts), 0)::bigint;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_country_breakdown(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 25)
 RETURNS TABLE(country text, country_code text, visitors bigint, total_visitors bigint)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH per_country AS (
    SELECT COALESCE(ae.country, 'Unknown') AS country,
      (ARRAY_AGG(ae.country_code) FILTER (WHERE ae.country_code IS NOT NULL))[1] AS country_code,
      COUNT(DISTINCT ae.visitor_id) AS visitors
    FROM public.analytics_events ae
    WHERE ae.created_at >= start_date AND ae.created_at <= end_date
      AND ae.country IS NOT NULL AND ae.visitor_id IS NOT NULL
    GROUP BY COALESCE(ae.country, 'Unknown')
  ),
  totals AS (
    SELECT COUNT(DISTINCT ae.visitor_id) AS total_visitors FROM public.analytics_events ae
    WHERE ae.created_at >= start_date AND ae.created_at <= end_date AND ae.visitor_id IS NOT NULL
  )
  SELECT pc.country, pc.country_code, pc.visitors, t.total_visitors
  FROM per_country pc CROSS JOIN totals t
  ORDER BY pc.visitors DESC LIMIT max_rows;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_top_returning_visitors(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 25)
 RETURNS TABLE(visitor_id text, first_seen timestamp with time zone, last_seen timestamp with time zone, visit_days bigint, total_events bigint, country text, device_type text)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH first_seen AS (
    SELECT ae.visitor_id, MIN(ae.created_at) AS first_at FROM public.analytics_events ae
    WHERE ae.visitor_id IS NOT NULL GROUP BY ae.visitor_id
  ),
  in_range_returning AS (
    SELECT DISTINCT ae.visitor_id FROM public.analytics_events ae
    JOIN first_seen fs USING (visitor_id)
    WHERE ae.created_at >= start_date AND ae.created_at <= end_date AND fs.first_at < start_date
  )
  SELECT ae.visitor_id,
    MIN(ae.created_at), MAX(ae.created_at),
    COUNT(DISTINCT DATE(ae.created_at))::bigint,
    COUNT(*)::bigint,
    (ARRAY_AGG(ae.country ORDER BY ae.created_at DESC) FILTER (WHERE ae.country IS NOT NULL))[1],
    (ARRAY_AGG(ae.device_type ORDER BY ae.created_at DESC) FILTER (WHERE ae.device_type IS NOT NULL))[1]
  FROM public.analytics_events ae
  WHERE ae.visitor_id IN (SELECT visitor_id FROM in_range_returning)
  GROUP BY ae.visitor_id
  ORDER BY visit_days DESC, total_events DESC LIMIT max_rows;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_traffic_breakdowns(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 8)
 RETURNS TABLE(dimension text, label text, visitors bigint)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH base AS (
    SELECT ae.visitor_id, ae.utm_source, ae.referrer, ae.device_type, ae.page_url
    FROM public.analytics_events ae
    WHERE ae.event_type = 'pageview'
      AND ae.created_at >= start_date AND ae.created_at <= end_date
      AND ae.visitor_id IS NOT NULL
  ),
  sources AS (
    SELECT 'source'::text AS dimension,
      COALESCE(NULLIF(b.utm_source, ''),
        CASE WHEN b.referrer IS NULL OR b.referrer = '' THEN 'Direct'
             ELSE regexp_replace(regexp_replace(b.referrer, '^https?://(www\.)?', ''), '/.*$', '') END,
        'Direct') AS label,
      COUNT(DISTINCT b.visitor_id) AS visitors
    FROM base b GROUP BY 2
  ),
  devices AS (
    SELECT 'device'::text, COALESCE(NULLIF(b.device_type, ''), 'unknown'), COUNT(DISTINCT b.visitor_id)
    FROM base b GROUP BY 2
  ),
  pages AS (
    SELECT 'page'::text,
      COALESCE(NULLIF(regexp_replace(COALESCE(b.page_url, '/'), '^https?://[^/]+', ''), ''), '/'),
      COUNT(DISTINCT b.visitor_id)
    FROM base b GROUP BY 2
  ),
  unioned AS (SELECT * FROM sources UNION ALL SELECT * FROM devices UNION ALL SELECT * FROM pages),
  ranked AS (
    SELECT u.dimension, u.label, u.visitors,
      ROW_NUMBER() OVER (PARTITION BY u.dimension ORDER BY u.visitors DESC) AS rn
    FROM unioned u
  )
  SELECT r.dimension, r.label, r.visitors FROM ranked r WHERE r.rn <= max_rows
  ORDER BY r.dimension, r.visitors DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_analytics_summary(start_date timestamp with time zone, end_date timestamp with time zone, live_since timestamp with time zone)
 RETURNS TABLE(live_visitors bigint, total_visitors bigint, total_hits bigint, new_visitors bigint, returning_visitors bigint, total_revisits bigint, total_pageviews bigint, total_subscribers bigint, sms_subscribers bigint, emails_sent bigint, emails_opened bigint, emails_clicked bigint, report_views bigint, report_shares bigint, tearsheet_views bigint, tearsheet_shares bigint, podcast_plays bigint, podcast_completes bigint)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH
  analytics_in_range AS (
    SELECT ae.event_type, ae.visitor_id, ae.created_at FROM public.analytics_events ae
    WHERE ae.created_at >= start_date AND ae.created_at <= end_date
  ),
  first_seen AS (
    SELECT ae.visitor_id, MIN(ae.created_at) AS first_at FROM public.analytics_events ae
    WHERE ae.visitor_id IS NOT NULL GROUP BY ae.visitor_id
  ),
  classified AS (
    SELECT DISTINCT air.visitor_id,
      CASE WHEN fs.first_at >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM analytics_in_range air JOIN first_seen fs ON fs.visitor_id = air.visitor_id
    WHERE air.visitor_id IS NOT NULL
  ),
  returning_visit_days AS (
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
END;
$function$;

-- Revoke EXECUTE from anon on all admin analytics functions
REVOKE EXECUTE ON FUNCTION public.get_daily_analytics(timestamp with time zone, timestamp with time zone) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_hot_leads() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_visitor_breakdown(timestamp with time zone, timestamp with time zone) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_country_breakdown(timestamp with time zone, timestamp with time zone, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_top_returning_visitors(timestamp with time zone, timestamp with time zone, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_traffic_breakdowns(timestamp with time zone, timestamp with time zone, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_admin_analytics_summary(timestamp with time zone, timestamp with time zone, timestamp with time zone) FROM anon, PUBLIC;

-- 6. Storage: prevent listing the research-files bucket. Allow read of specific objects only when name is supplied.
DROP POLICY IF EXISTS "Public read access for research files" ON storage.objects;
CREATE POLICY "Public read individual research files" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'research-files' AND name IS NOT NULL AND name <> '');
