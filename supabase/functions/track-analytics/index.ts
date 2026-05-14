import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsPayload {
  event_type: string;
  session_id: string;
  visitor_id: string;
  page_url: string;
  referrer?: string;
  user_agent?: string;
  device_type?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  event_data?: Record<string, unknown>;
}

interface GeoResponse {
  status: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  query?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract IP from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const cfConnectingIP = req.headers.get('cf-connecting-ip');
    const realIP = req.headers.get('x-real-ip');
    
    let ip = forwardedFor?.split(',')[0]?.trim() || cfConnectingIP || realIP || 'unknown';
    
    // Filter out private/local IPs for geolocation
    const isPrivateIP = ip === 'unknown' || 
                        ip.startsWith('10.') || 
                        ip.startsWith('172.') || 
                        ip.startsWith('192.168.') ||
                        ip === '127.0.0.1' ||
                        ip === '::1';

    console.log(`[track-analytics] IP detected: ${ip}, isPrivate: ${isPrivateIP}`);

    // Get geolocation data
    let geoData: GeoResponse = { status: 'fail' };
    
    if (!isPrivateIP) {
      try {
        // Using ip-api.com (free, 45 req/min, no API key needed)
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,query`);
        geoData = await geoResponse.json();
        console.log(`[track-analytics] Geolocation result:`, geoData);
      } catch (geoError) {
        console.error(`[track-analytics] Geolocation lookup failed:`, geoError);
      }
    }

    const payload: AnalyticsPayload = await req.json();
    console.log(`[track-analytics] Received event: ${payload.event_type} for session ${payload.session_id}`);

    // Insert into analytics_events with location data
    const { error: analyticsError } = await supabase.from('analytics_events').insert({
      event_type: payload.event_type,
      session_id: payload.session_id,
      visitor_id: payload.visitor_id,
      page_url: payload.page_url,
      referrer: payload.referrer || null,
      user_agent: payload.user_agent || null,
      device_type: payload.device_type || null,
      utm_source: payload.utm_source || null,
      utm_medium: payload.utm_medium || null,
      utm_campaign: payload.utm_campaign || null,
      event_data: payload.event_data || null,
      ip_address: ip !== 'unknown' ? ip : null,
      country: geoData.status === 'success' ? geoData.country : null,
      country_code: geoData.status === 'success' ? geoData.countryCode : null,
      city: geoData.status === 'success' ? geoData.city : null,
      region: geoData.status === 'success' ? geoData.regionName : null,
    });

    if (analyticsError) {
      console.error(`[track-analytics] Analytics insert error:`, analyticsError);
    } else {
      console.log(`[track-analytics] Analytics event recorded successfully`);
    }

    // Update live_visitors with location data
    const { error: liveError } = await supabase.from('live_visitors').upsert({
      session_id: payload.session_id,
      visitor_id: payload.visitor_id,
      page_url: payload.page_url,
      referrer: payload.referrer || null,
      device_type: payload.device_type || null,
      utm_source: payload.utm_source || null,
      last_seen: new Date().toISOString(),
      ip_address: ip !== 'unknown' ? ip : null,
      country: geoData.status === 'success' ? geoData.country : null,
      country_code: geoData.status === 'success' ? geoData.countryCode : null,
      city: geoData.status === 'success' ? geoData.city : null,
      region: geoData.status === 'success' ? geoData.regionName : null,
    }, { onConflict: 'session_id' });

    if (liveError) {
      console.error(`[track-analytics] Live visitor upsert error:`, liveError);
    } else {
      console.log(`[track-analytics] Live visitor updated successfully`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[track-analytics] Error:`, error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
