CREATE OR REPLACE FUNCTION public.get_visitor_breakdown(start_date timestamptz, end_date timestamptz)
RETURNS TABLE(
  new_visitors bigint,
  returning_visitors bigint,
  total_visitors bigint,
  total_revisits bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH first_seen AS (
    SELECT visitor_id, MIN(created_at) AS first_at
    FROM public.analytics_events
    WHERE visitor_id IS NOT NULL
    GROUP BY visitor_id
  ),
  in_range AS (
    SELECT DISTINCT visitor_id
    FROM public.analytics_events
    WHERE visitor_id IS NOT NULL
      AND created_at >= start_date
      AND created_at <= end_date
  ),
  classified AS (
    SELECT
      ir.visitor_id,
      CASE WHEN fs.first_at >= start_date THEN 'new' ELSE 'returning' END AS bucket
    FROM in_range ir
    JOIN first_seen fs USING (visitor_id)
  ),
  returning_visit_counts AS (
    SELECT ae.visitor_id, COUNT(DISTINCT DATE(ae.created_at)) AS visit_days
    FROM public.analytics_events ae
    WHERE ae.visitor_id IN (SELECT visitor_id FROM classified WHERE bucket = 'returning')
    GROUP BY ae.visitor_id
  )
  SELECT
    (SELECT COUNT(*) FROM classified WHERE bucket = 'new')::bigint AS new_visitors,
    (SELECT COUNT(*) FROM classified WHERE bucket = 'returning')::bigint AS returning_visitors,
    (SELECT COUNT(*) FROM classified)::bigint AS total_visitors,
    COALESCE((SELECT SUM(visit_days) FROM returning_visit_counts), 0)::bigint AS total_revisits;
$$;

CREATE OR REPLACE FUNCTION public.get_top_returning_visitors(start_date timestamptz, end_date timestamptz, max_rows int DEFAULT 25)
RETURNS TABLE(
  visitor_id text,
  first_seen timestamptz,
  last_seen timestamptz,
  visit_days bigint,
  total_events bigint,
  country text,
  device_type text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH first_seen AS (
    SELECT visitor_id, MIN(created_at) AS first_at
    FROM public.analytics_events
    WHERE visitor_id IS NOT NULL
    GROUP BY visitor_id
  ),
  in_range_returning AS (
    SELECT DISTINCT ae.visitor_id
    FROM public.analytics_events ae
    JOIN first_seen fs USING (visitor_id)
    WHERE ae.created_at >= start_date
      AND ae.created_at <= end_date
      AND fs.first_at < start_date
  )
  SELECT
    ae.visitor_id,
    MIN(ae.created_at) AS first_seen,
    MAX(ae.created_at) AS last_seen,
    COUNT(DISTINCT DATE(ae.created_at))::bigint AS visit_days,
    COUNT(*)::bigint AS total_events,
    (ARRAY_AGG(ae.country ORDER BY ae.created_at DESC) FILTER (WHERE ae.country IS NOT NULL))[1] AS country,
    (ARRAY_AGG(ae.device_type ORDER BY ae.created_at DESC) FILTER (WHERE ae.device_type IS NOT NULL))[1] AS device_type
  FROM public.analytics_events ae
  WHERE ae.visitor_id IN (SELECT visitor_id FROM in_range_returning)
  GROUP BY ae.visitor_id
  ORDER BY visit_days DESC, total_events DESC
  LIMIT max_rows;
$$;