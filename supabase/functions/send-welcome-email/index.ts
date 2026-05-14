import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  subscriberId: string;
  firstName: string;
  email: string;
  phone?: string;
  smsOptedIn?: boolean;
}

const LANDING_PAGE_URL = "https://biotechpick.com";

function generateUnsubscribeUrl(subscriberId: string): string {
  return `${LANDING_PAGE_URL}/unsubscribe?id=${subscriberId}`;
}

function generateWelcomeEmailHTML(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_welcome";
  const unsubscribeUrl = generateUnsubscribeUrl(subscriberId);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BioVaxys Research Coverage</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1B3A6D; padding: 32px 40px; border-radius: 8px 8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">INSTITUTIONAL EQUITY RESEARCH</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 32px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Welcome to our research distribution. Your access to institutional-quality coverage of <strong>BioVaxys Corp</strong> is now active.
              </p>
              
              <!-- Ticker Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #1B3A6D; border-radius: 4px; padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 8px 0; color: #1B3A6D; font-size: 14px; font-weight: 600;">BVAXF | OTCQB</p>
                          <p style="margin: 0 0 4px 0; color: #666666; font-size: 14px;">Current: ~$0.16 &nbsp;|&nbsp; Target: $0.48 - $0.60</p>
                          <p style="margin: 0; color: #2E7D32; font-size: 13px; font-weight: 500;">Rating: SPECULATIVE BUY</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Research Materials -->
              <p style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Your Research Materials
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding-right: 8px;" width="50%">
                    <a href="${LANDING_PAGE_URL}?${utm}&doc=report" style="display: block; background-color: #1B3A6D; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 4px; font-size: 14px; font-weight: 500; text-align: center;">View Full Report</a>
                  </td>
                  <td style="padding-left: 8px;" width="50%">
                    <a href="${LANDING_PAGE_URL}?${utm}&doc=tearsheet" style="display: block; background-color: #ffffff; color: #1B3A6D; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-size: 14px; font-weight: 500; text-align: center; border: 2px solid #1B3A6D;">View Tear Sheet</a>
                  </td>
                </tr>
              </table>
              
              <!-- What's Next -->
              <p style="margin: 0 0 16px 0; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                What You'll Receive
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 4px 0; color: #555555; font-size: 14px; line-height: 1.5;">• Clinical trial updates and milestone readouts</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #555555; font-size: 14px; line-height: 1.5;">• Regulatory filings and FDA interactions</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #555555; font-size: 14px; line-height: 1.5;">• Price target revisions and coverage updates</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #555555; font-size: 14px; line-height: 1.5;">• Material company announcements</td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Disclosures -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 8px 0; color: #666666; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Important Disclosures
              </p>
              <p style="margin: 0 0 12px 0; color: #888888; font-size: 11px; line-height: 1.5;">
                This communication is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Past performance is not indicative of future results. Investing in securities involves risk, including the possible loss of principal.
              </p>
              <p style="margin: 0; color: #888888; font-size: 11px; line-height: 1.5;">
                The research contained herein has been prepared by Institutional Equity Research and is not associated with, endorsed by, or guaranteed by BioVaxys Corp or its affiliates. Investors should conduct their own due diligence and consult with qualified financial advisors before making investment decisions.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; color: #333333; font-size: 13px; font-weight: 500;">Institutional Equity Research</p>
                    <p style="margin: 0; color: #888888; font-size: 12px;">
                      <a href="${LANDING_PAGE_URL}" style="color: #1B3A6D; text-decoration: none;">biotechpick.com</a>
                    </p>
                  </td>
                  <td align="right">
                    <a href="${unsubscribeUrl}" style="color: #888888; font-size: 11px; text-decoration: underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateWelcomeEmailText(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_welcome";
  return `Hi ${firstName},

Welcome to our research distribution. Your access to institutional-quality coverage of BioVaxys Corp (OTCQB: BVAXF) is now active.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BVAXF | OTCQB
Current: ~$0.16 | Target: $0.48 - $0.60
Rating: SPECULATIVE BUY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR RESEARCH MATERIALS:

→ Full Coverage Report (20+ pages): ${LANDING_PAGE_URL}?${utm}&doc=report
→ One-Page Tear Sheet: ${LANDING_PAGE_URL}?${utm}&doc=tearsheet

WHAT YOU'LL RECEIVE:

• Clinical trial updates and milestone readouts
• Regulatory filings and FDA interactions
• Price target revisions and coverage updates
• Material company announcements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT DISCLOSURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This communication is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Past performance is not indicative of future results. Investing in securities involves risk, including the possible loss of principal.

The research contained herein has been prepared by Institutional Equity Research and is not associated with, endorsed by, or guaranteed by BioVaxys Corp or its affiliates. Investors should conduct their own due diligence and consult with qualified financial advisors before making investment decisions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Institutional Equity Research | biotechpick.com

Unsubscribe: ${generateUnsubscribeUrl(subscriberId)}`;
}

async function sendWelcomeSMS(phone: string, firstName: string): Promise<void> {
  const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.log("Twilio credentials not configured, skipping SMS");
    return;
  }

  // Format phone to E.164
  let formattedPhone = phone.replace(/\D/g, "");
  if (!formattedPhone.startsWith("1") && formattedPhone.length === 10) {
    formattedPhone = "1" + formattedPhone;
  }
  formattedPhone = "+" + formattedPhone;

  const message = `Welcome to BioVaxys (BVAXF) alerts, ${firstName}! You'll receive SMS for material news & clinical milestones. Reply STOP to opt out. — Institutional Equity Research`;

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

  const response = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: formattedPhone,
      From: twilioPhoneNumber,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twilio SMS error:", error);
  } else {
    console.log(`Welcome SMS sent to ${formattedPhone}`);
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subscriberId, firstName, email, phone, smsOptedIn }: WelcomeEmailRequest = await req.json();
    console.log(`Sending welcome email to ${email} (${firstName})`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send welcome email via Resend (using biotechpick.com domain)
    const emailResponse = await resend.emails.send({
      from: "Institutional Equity Research <research@biotechpick.com>",
      to: [email],
      subject: "Welcome — Your BioVaxys Research Access",
      html: generateWelcomeEmailHTML(firstName, subscriberId),
      text: generateWelcomeEmailText(firstName, subscriberId),
    });

    console.log("Welcome email sent:", emailResponse);

    // Send welcome SMS if opted in
    if (smsOptedIn && phone) {
      try {
        await sendWelcomeSMS(phone, firstName);
      } catch (smsError) {
        console.error("Error sending welcome SMS:", smsError);
        // Don't fail the request if SMS fails
      }
    }

    // Create drip campaign status record
    const { error: insertError } = await supabase
      .from("drip_campaign_status")
      .insert({
        signup_id: subscriberId,
        email_1_sent_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Error creating drip status:", insertError);
      // Don't fail the request if drip tracking fails
    } else {
      console.log("Drip campaign status created for subscriber:", subscriberId);
    }

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
