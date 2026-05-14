import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 60 minutes
const MAX_ATTEMPTS = 3; // Max 3 signups per IP per hour

interface SignupRequest {
  firstName: string;
  email: string;
  phone?: string | null;
  smsOptedIn?: boolean;
  source?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract IP address from headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("cf-connecting-ip") ||
               req.headers.get("x-real-ip") ||
               "unknown";

    console.log(`[newsletter-signup] Request from IP: ${ip}`);

    // Create Supabase client with service role for rate limiting
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check rate limit
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    
    const { count, error: countError } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("action", "signup")
      .gte("created_at", windowStart);

    if (countError) {
      console.error("[newsletter-signup] Rate limit check error:", countError);
      // Continue anyway - don't block signups if rate limit check fails
    }

    console.log(`[newsletter-signup] IP ${ip} has ${count || 0} attempts in last hour`);

    if (count && count >= MAX_ATTEMPTS) {
      console.log(`[newsletter-signup] Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message: "Too many signup attempts. Please try again in an hour.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body: SignupRequest = await req.json();
    const { firstName, email, phone, smsOptedIn, source, utmSource, utmMedium, utmCampaign } = body;

    if (!firstName?.trim() || !email?.trim()) {
      return new Response(
        JSON.stringify({ error: "validation", message: "Name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscriberId = crypto.randomUUID();

    // Record rate limit attempt
    await supabaseAdmin.from("rate_limits").insert({
      ip_address: ip,
      action: "signup",
    });

    // Insert into subscribers table
    const { error: subscriberError } = await supabaseAdmin
      .from("subscribers")
      .insert({
        id: subscriberId,
        first_name: firstName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        sms_opted_in: smsOptedIn && !!phone,
        source: source || "landing_page",
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

    if (subscriberError) {
      if (subscriberError.code === "23505") {
        console.log(`[newsletter-signup] Duplicate email: ${email}`);
        return new Response(
          JSON.stringify({ error: "duplicate", message: "This email is already subscribed" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw subscriberError;
    }

    console.log(`[newsletter-signup] New subscriber: ${email}`);

    // Also insert into legacy newsletter_signups
    try {
      await supabaseAdmin.from("newsletter_signups").insert({
        first_name: firstName.trim(),
        email: email.trim().toLowerCase(),
        source: source || "landing_page",
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });
    } catch {
      // Ignore errors for legacy table
    }

    // Track signup analytics event
    await supabaseAdmin.from("analytics_events").insert({
      event_type: "signup",
      event_data: {
        email: email.trim().toLowerCase(),
        has_phone: !!phone,
        sms_opted_in: smsOptedIn && !!phone,
      },
      ip_address: ip,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    });

    // Trigger welcome email via existing function
    try {
      const { error: welcomeError } = await supabaseAdmin.functions.invoke("send-welcome-email", {
        body: {
          subscriberId,
          firstName: firstName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone || null,
          smsOptedIn: smsOptedIn && !!phone,
        },
      });
      if (welcomeError) {
        console.error("[newsletter-signup] Welcome email error:", welcomeError);
      }
    } catch (emailError) {
      console.error("[newsletter-signup] Welcome email invocation error:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscriberId,
        message: "Successfully subscribed" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[newsletter-signup] Error:", error);
    return new Response(
      JSON.stringify({ error: "server_error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
