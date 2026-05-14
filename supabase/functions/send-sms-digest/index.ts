import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Twilio SMS sender
async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!accountSid || !authToken || !fromNumber) {
    console.error("Missing Twilio credentials");
    return { success: false, error: "Twilio not configured" };
  }

  // Format phone number
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.length === 10) {
    formattedTo = `+1${formattedTo}`;
  } else if (!formattedTo.startsWith('+')) {
    formattedTo = `+${formattedTo}`;
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authHeader = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: formattedTo,
        From: fromNumber,
        Body: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Twilio error for ${formattedTo}:`, result);
      return { success: false, error: result.message };
    }

    console.log(`SMS sent to ${formattedTo}: ${result.sid}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to send SMS to ${formattedTo}:`, error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse optional custom message from request body
    let customMessage: string | null = null;
    try {
      const body = await req.json();
      customMessage = body.message || null;
    } catch {
      // No body or invalid JSON - use default message
    }

    // Fetch all SMS-opted subscribers with phone numbers
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("id, first_name, phone")
      .eq("sms_opted_in", true)
      .eq("status", "active")
      .not("phone", "is", null);

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscribers" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No SMS-opted subscribers found");
      return new Response(
        JSON.stringify({ message: "No subscribers to notify", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${subscribers.length} SMS-opted subscribers`);

    // Use custom message or default digest
    let finalMessage: string;
    if (customMessage) {
      // Ensure compliance footer
      finalMessage = customMessage.includes("STOP") 
        ? customMessage 
        : `${customMessage} Reply STOP to unsubscribe.`;
    } else {
      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      finalMessage = `BioVaxys Update ${today}: Stay informed on BVAXF developments. Visit biotechpick.com for the latest research and analysis. Reply STOP to unsubscribe.`;
    }

    console.log(`Broadcasting message: ${finalMessage}`);

    // Send SMS to each subscriber
    let successCount = 0;
    let failCount = 0;

    for (const subscriber of subscribers) {
      if (!subscriber.phone) continue;
      
      const result = await sendSMS(subscriber.phone, finalMessage);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`SMS broadcast complete: ${successCount} sent, ${failCount} failed`);

    return new Response(
      JSON.stringify({ 
        message: "SMS broadcast sent", 
        sent: successCount, 
        failed: failCount,
        total: subscribers.length 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-sms-digest:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
