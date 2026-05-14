import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Resend webhook received:", JSON.stringify(payload));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, data } = payload;

    // Map Resend event types (email.opened -> opened)
    const eventType = type?.replace("email.", "") || "unknown";
    const email = data?.to?.[0] || data?.email || "";

    if (!email) {
      console.log("No email found in webhook payload");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Find subscriber by email
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    // Store email event
    const { error: insertError } = await supabase.from("email_events").insert([{
      subscriber_id: subscriber?.id || null,
      email: email.toLowerCase(),
      event_type: eventType,
      campaign_id: data?.tags?.campaign_id || null,
      email_id: data?.email_id || null,
      link_url: data?.click?.link || null,
      user_agent: data?.click?.userAgent || null,
      ip_address: data?.click?.ipAddress || null,
      timestamp: data?.created_at || new Date().toISOString(),
    }]);

    if (insertError) {
      console.error("Error inserting email event:", insertError);
    } else {
      console.log(`Email event recorded: ${eventType} for ${email}`);
    }

    // Hot Lead Detection: Check if opened 2+ times
    if (eventType === "opened") {
      const { count } = await supabase
        .from("email_events")
        .select("*", { count: "exact", head: true })
        .eq("email", email.toLowerCase())
        .eq("event_type", "opened");

      if (count && count >= 2) {
        console.log(`Hot lead detected: ${email} with ${count} opens`);
        // Could trigger additional actions here (e.g., special drip sequence)
      }
    }

    // Handle unsubscribe events
    if (eventType === "unsubscribed" && subscriber?.id) {
      await supabase
        .from("subscribers")
        .update({ status: "unsubscribed" })
        .eq("id", subscriber.id);
      console.log(`Subscriber unsubscribed: ${email}`);
    }

    // Handle bounce events
    if (eventType === "bounced" && subscriber?.id) {
      await supabase
        .from("subscribers")
        .update({ status: "bounced" })
        .eq("id", subscriber.id);
      console.log(`Subscriber bounced: ${email}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
