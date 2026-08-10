-- Normalizer helper
CREATE OR REPLACE FUNCTION public.norm_country(c text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN c IS NULL OR btrim(c) = '' THEN NULL
    WHEN lower(btrim(c)) IN ('the netherlands','netherlands') THEN 'Netherlands'
    WHEN lower(btrim(c)) IN ('united states','usa','united states of america') THEN 'United States'
    WHEN lower(btrim(c)) IN ('united kingdom','uk','great britain') THEN 'United Kingdom'
    ELSE btrim(c)
  END
$$;

CREATE TABLE IF NOT EXISTS public.visitor_stats (
  visitor_id text PRIMARY KEY,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  country text,
  country_code text,
  device_type text,
  first_source text,
  total_events bigint NOT NULL DEFAULT 0
);

GRANT SELECT ON public.visitor_stats TO authenticated;
GRANT ALL ON public.visitor_stats TO service_role;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view visitor stats" ON public.visitor_stats;
CREATE POLICY "Admins can view visitor stats" ON public.visitor_stats
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.visitor_days (
  visitor_id text NOT NULL,
  day date NOT NULL,
  events bigint NOT NULL DEFAULT 0,
  pageviews bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (visitor_id, day)
);

GRANT SELECT ON public.visitor_days TO authenticated;
GRANT ALL ON public.visitor_days TO service_role;
ALTER TABLE public.visitor_days ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view visitor days" ON public.visitor_days;
CREATE POLICY "Admins can view visitor days" ON public.visitor_days
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_visitor_days_day ON public.visitor_days (day);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_first_seen ON public.visitor_stats (first_seen);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_last_seen ON public.visitor_stats (last_seen);

-- Backfill
INSERT INTO public.visitor_stats (visitor_id, first_seen, last_seen, country, country_code, device_type, first_source, total_events)
SELECT ae.visitor_id,
       MIN(ae.created_at),
       MAX(ae.created_at),
       public.norm_country((ARRAY_AGG(ae.country ORDER BY ae.created_at DESC) FILTER (WHERE ae.country IS NOT NULL))[1]),
       (ARRAY_AGG(ae.country_code ORDER BY ae.created_at DESC) FILTER (WHERE ae.country_code IS NOT NULL))[1],
       (ARRAY_AGG(ae.device_type ORDER BY ae.created_at DESC) FILTER (WHERE ae.device_type IS NOT NULL))[1],
       COALESCE(
         (ARRAY_AGG(NULLIF(ae.utm_source,'') ORDER BY ae.created_at ASC) FILTER (WHERE NULLIF(ae.utm_source,'') IS NOT NULL))[1],
         CASE WHEN (ARRAY_AGG(NULLIF(ae.referrer,'') ORDER BY ae.created_at ASC) FILTER (WHERE NULLIF(ae.referrer,'') IS NOT NULL))[1] IS NULL
              THEN 'Direct'
              ELSE regexp_replace(regexp_replace((ARRAY_AGG(NULLIF(ae.referrer,'') ORDER BY ae.created_at ASC) FILTER (WHERE NULLIF(ae.referrer,'') IS NOT NULL))[1], '^https?://(www\.)?', ''), '/.*$', '')
         END,
         'Direct'),
       COUNT(*)
FROM public.analytics_events ae
WHERE ae.visitor_id IS NOT NULL
GROUP BY ae.visitor_id
ON CONFLICT (visitor_id) DO NOTHING;

INSERT INTO public.visitor_days (visitor_id, day, events, pageviews)
SELECT ae.visitor_id, DATE(ae.created_at), COUNT(*), COUNT(*) FILTER (WHERE ae.event_type = 'pageview')
FROM public.analytics_events ae
WHERE ae.visitor_id IS NOT NULL
GROUP BY ae.visitor_id, DATE(ae.created_at)
ON CONFLICT (visitor_id, day) DO NOTHING;

-- Keep rollups current
CREATE OR REPLACE FUNCTION public.sync_visitor_rollups()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  src text;
BEGIN
  IF NEW.visitor_id IS NULL THEN RETURN NEW; END IF;

  src := COALESCE(NULLIF(NEW.utm_source, ''),
    CASE WHEN NULLIF(NEW.referrer, '') IS NULL THEN 'Direct'
         ELSE regexp_replace(regexp_replace(NEW.referrer, '^https?://(www\.)?', ''), '/.*$', '') END,
    'Direct');

  INSERT INTO public.visitor_stats AS vs (visitor_id, first_seen, last_seen, country, country_code, device_type, first_source, total_events)
  VALUES (NEW.visitor_id, COALESCE(NEW.created_at, now()), COALESCE(NEW.created_at, now()),
          public.norm_country(NEW.country), NEW.country_code, NEW.device_type, src, 1)
  ON CONFLICT (visitor_id) DO UPDATE SET
    first_seen = LEAST(vs.first_seen, COALESCE(NEW.created_at, now())),
    last_seen = GREATEST(vs.last_seen, COALESCE(NEW.created_at, now())),
    country = COALESCE(public.norm_country(NEW.country), vs.country),
    country_code = COALESCE(NEW.country_code, vs.country_code),
    device_type = COALESCE(NEW.device_type, vs.device_type),
    first_source = COALESCE(vs.first_source, src),
    total_events = vs.total_events + 1;

  INSERT INTO public.visitor_days AS vd (visitor_id, day, events, pageviews)
  VALUES (NEW.visitor_id, DATE(COALESCE(NEW.created_at, now())), 1,
          CASE WHEN NEW.event_type = 'pageview' THEN 1 ELSE 0 END)
  ON CONFLICT (visitor_id, day) DO UPDATE SET
    events = vd.events + 1,
    pageviews = vd.pageviews + CASE WHEN NEW.event_type = 'pageview' THEN 1 ELSE 0 END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_visitor_rollups ON public.analytics_events;
CREATE TRIGGER trg_sync_visitor_rollups
AFTER INSERT ON public.analytics_events
FOR EACH ROW EXECUTE FUNCTION public.sync_visitor_rollups();

-- Fast, consistent summary
CREATE OR REPLACE FUNCTION public.get_admin_analytics_summary(start_date timestamp with time zone, end_date timestamp with time zone, live_since timestamp with time zone)
RETURNS TABLE(live_visitors bigint, total_visitors bigint, total_hits bigint, new_visitors bigint, returning_visitors bigint, total_revisits bigint, total_pageviews bigint, total_subscribers bigint, sms_subscribers bigint, emails_sent bigint, emails_opened bigint, emails_clicked bigint, report_views bigint, report_shares bigint, tearsheet_views bigint, tearsheet_shares bigint, podcast_plays bigint, podcast_completes bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH in_range AS (
    SELECT vd.visitor_id, SUM(vd.events) AS events, SUM(vd.pageviews) AS pageviews, COUNT(*) AS visit_days
    FROM public.visitor_days vd
    WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
    GROUP BY vd.visitor_id
  ),
  classified AS (
    SELECT ir.visitor_id, ir.events, ir.pageviews, ir.visit_days,
      CASE WHEN vs.first_seen >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM in_range ir JOIN public.visitor_stats vs ON vs.visitor_id = ir.visitor_id
  )
  SELECT
    (SELECT COUNT(*) FROM public.live_visitors WHERE last_seen >= live_since)::bigint,
    (SELECT COUNT(*) FROM classified)::bigint,
    COALESCE((SELECT SUM(events) FROM classified), 0)::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'new')::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'returning')::bigint,
    COALESCE((SELECT SUM(visit_days) FROM classified WHERE bucket = 'returning'), 0)::bigint,
    COALESCE((SELECT SUM(pageviews) FROM classified), 0)::bigint,
    (SELECT COUNT(*) FROM public.subscribers WHERE created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.subscribers WHERE sms_opted_in = true AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'sent' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'opened' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.email_events WHERE event_type = 'clicked' AND timestamp >= start_date AND timestamp <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'report' AND action = 'view' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'report' AND action = 'share' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'tearsheet' AND action = 'view' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.document_engagement WHERE document_type = 'tearsheet' AND action = 'share' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.analytics_events WHERE event_type = 'podcast_play' AND created_at >= start_date AND created_at <= end_date)::bigint,
    (SELECT COUNT(*) FROM public.analytics_events WHERE event_type = 'podcast_complete' AND created_at >= start_date AND created_at <= end_date)::bigint;
END;
$$;

-- Country breakdown on the same visitor basis (includes Unknown)
CREATE OR REPLACE FUNCTION public.get_country_breakdown(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 25)
RETURNS TABLE(country text, country_code text, visitors bigint, total_visitors bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH in_range AS (
    SELECT DISTINCT vd.visitor_id FROM public.visitor_days vd
    WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
  ),
  joined AS (
    SELECT COALESCE(vs.country, 'Unknown') AS country, vs.country_code
    FROM in_range ir JOIN public.visitor_stats vs ON vs.visitor_id = ir.visitor_id
  ),
  per_country AS (
    SELECT j.country, (ARRAY_AGG(j.country_code) FILTER (WHERE j.country_code IS NOT NULL))[1] AS country_code,
           COUNT(*) AS visitors
    FROM joined j GROUP BY j.country
  ),
  totals AS (SELECT COUNT(*) AS total_visitors FROM in_range)
  SELECT pc.country, pc.country_code, pc.visitors, t.total_visitors
  FROM per_country pc CROSS JOIN totals t
  ORDER BY pc.visitors DESC LIMIT max_rows;
END;
$$;

-- Traffic breakdowns on the same visitor basis
CREATE OR REPLACE FUNCTION public.get_traffic_breakdowns(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 8)
RETURNS TABLE(dimension text, label text, visitors bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH in_range AS (
    SELECT DISTINCT vd.visitor_id FROM public.visitor_days vd
    WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
  ),
  base AS (
    SELECT vs.visitor_id, COALESCE(NULLIF(vs.first_source, ''), 'Direct') AS source,
           COALESCE(NULLIF(vs.device_type, ''), 'unknown') AS device
    FROM in_range ir JOIN public.visitor_stats vs ON vs.visitor_id = ir.visitor_id
  ),
  sources AS (SELECT 'source'::text AS dimension, b.source AS label, COUNT(*) AS visitors FROM base b GROUP BY 2),
  devices AS (SELECT 'device'::text, b.device, COUNT(*) FROM base b GROUP BY 2),
  pages AS (
    SELECT 'page'::text,
      COALESCE(NULLIF(regexp_replace(COALESCE(ae.page_url, '/'), '^https?://[^/]+', ''), ''), '/'),
      COUNT(DISTINCT ae.visitor_id)
    FROM public.analytics_events ae
    WHERE ae.event_type = 'pageview' AND ae.created_at >= start_date AND ae.created_at <= end_date
      AND ae.visitor_id IS NOT NULL
    GROUP BY 2
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
$$;

-- Visitor breakdown on rollups
CREATE OR REPLACE FUNCTION public.get_visitor_breakdown(start_date timestamp with time zone, end_date timestamp with time zone)
RETURNS TABLE(new_visitors bigint, returning_visitors bigint, total_visitors bigint, total_revisits bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH in_range AS (
    SELECT vd.visitor_id, COUNT(*) AS visit_days FROM public.visitor_days vd
    WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
    GROUP BY vd.visitor_id
  ),
  classified AS (
    SELECT ir.visitor_id, ir.visit_days,
      CASE WHEN vs.first_seen >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM in_range ir JOIN public.visitor_stats vs ON vs.visitor_id = ir.visitor_id
  )
  SELECT
    (SELECT COUNT(*) FROM classified WHERE bucket = 'new')::bigint,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'returning')::bigint,
    (SELECT COUNT(*) FROM classified)::bigint,
    COALESCE((SELECT SUM(visit_days) FROM classified WHERE bucket = 'returning'), 0)::bigint;
END;
$$;

-- Top returning visitors on rollups
CREATE OR REPLACE FUNCTION public.get_top_returning_visitors(start_date timestamp with time zone, end_date timestamp with time zone, max_rows integer DEFAULT 25)
RETURNS TABLE(visitor_id text, first_seen timestamp with time zone, last_seen timestamp with time zone, visit_days bigint, total_events bigint, country text, device_type text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH in_range AS (
    SELECT vd.visitor_id, COUNT(*) AS visit_days, SUM(vd.events) AS events
    FROM public.visitor_days vd
    WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
    GROUP BY vd.visitor_id
  )
  SELECT vs.visitor_id, vs.first_seen, vs.last_seen, ir.visit_days, ir.events::bigint, vs.country, vs.device_type
  FROM in_range ir JOIN public.visitor_stats vs ON vs.visitor_id = ir.visitor_id
  WHERE vs.first_seen < start_date
  ORDER BY ir.visit_days DESC, ir.events DESC
  LIMIT max_rows;
END;
$$;

-- Daily analytics from rollups (fast)
CREATE OR REPLACE FUNCTION public.get_daily_analytics(start_date timestamp with time zone, end_date timestamp with time zone)
RETURNS TABLE(day date, pageviews bigint, unique_visitors bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  SELECT vd.day, SUM(vd.pageviews)::bigint, COUNT(DISTINCT vd.visitor_id)::bigint
  FROM public.visitor_days vd
  WHERE vd.day >= DATE(start_date) AND vd.day <= DATE(end_date)
  GROUP BY vd.day ORDER BY vd.day ASC;
END;
$$;