import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('live_visitors')
      .select('country, country_code, visitor_id')
      .gte('last_seen', fiveMinutesAgo);

    if (error) {
      console.error('[live-visitors-public] query error:', error);
      return new Response(
        JSON.stringify({ error: error.message, countries: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Aggregate unique visitors by country
    const countryMap = new Map<string, { country: string; country_code: string | null; visitors: number }>();
    const seenVisitors = new Set<string>();

    for (const row of (data || [])) {
      const key = row.country || 'Unknown';
      if (!countryMap.has(key)) {
        countryMap.set(key, {
          country: row.country || 'Unknown',
          country_code: row.country_code || null,
          visitors: 0,
        });
      }
      // Deduplicate by visitor_id per country
      const dedupKey = `${key}::${row.visitor_id}`;
      if (!seenVisitors.has(dedupKey)) {
        seenVisitors.add(dedupKey);
        countryMap.get(key)!.visitors += 1;
      }
    }

    const countries = Array.from(countryMap.values())
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 12);

    const total = countries.reduce((sum, c) => sum + c.visitors, 0);

    return new Response(
      JSON.stringify({ countries, total }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[live-visitors-public] error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage, countries: [], total: 0 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
