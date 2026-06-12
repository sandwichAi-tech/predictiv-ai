import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sender + brand config. Update FROM_ADDRESS to a verified Resend domain when ready.
// Falls back to Resend's shared sandbox sender so sends don't silently fail in dev.
const FROM_ADDRESS = Deno.env.get("WELCOME_FROM_ADDRESS")
  || "Predictiv AI Research <onboarding@resend.dev>";
const SITE_URL = "https://73-76.com";
const REPORT_URL = `${SITE_URL}/?doc=report&utm_source=welcome&utm_medium=email&utm_campaign=pai_welcome`;
const TEARSHEET_URL = `${SITE_URL}/?doc=tearsheet&utm_source=welcome&utm_medium=email&utm_campaign=pai_welcome`;

interface WelcomeEmailRequest {
  subscriberId: string;
  firstName: string;
  email: string;
  phone?: string;
  smsOptedIn?: boolean;
}

function unsubscribeUrl(subscriberId: string) {
  return `${SITE_URL}/unsubscribe?id=${subscriberId}`;
}

function welcomeHTML(firstName: string, subscriberId: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Predictiv AI — Institutional Coverage</title></head>
<body style="margin:0;padding:0;background-color:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#e5e7eb;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0f1e;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#0f172a;border:1px solid #1e293b;border-radius:8px;">
      <tr><td style="background:linear-gradient(135deg,#0c1a36 0%,#0a2a52 100%);padding:28px 36px;border-radius:8px 8px 0 0;border-bottom:1px solid #1e3a8a;">
        <p style="margin:0;color:#67e8f9;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Institutional Coverage</p>
        <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:0.3px;">Predictiv AI Inc. — CSE: PAI · FWB: 7IT</h1>
      </td></tr>
      <tr><td style="padding:36px 36px 12px 36px;">
        <p style="margin:0 0 20px 0;color:#e5e7eb;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
        <p style="margin:0 0 24px 0;color:#cbd5e1;font-size:15px;line-height:1.65;">
          You're confirmed on the Predictiv AI institutional coverage list. You'll now receive material news, CSE / FWB filings, and catalyst updates as the Arcasia JV and broader AI-infrastructure thesis develop.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px 0;">
          <tr><td style="background-color:#0b1530;border:1px solid #1e3a8a;border-left:3px solid #06b6d4;border-radius:4px;padding:18px 20px;">
            <p style="margin:0 0 6px 0;color:#67e8f9;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Your Research Materials</p>
            <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">Full research report PDF and a one-page tear sheet, both research &amp; analysis only.</p>
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 32px 0;">
          <tr>
            <td style="padding-right:6px;" width="50%">
              <a href="${REPORT_URL}" style="display:block;background-color:#06b6d4;color:#0a0f1e;text-decoration:none;padding:14px 20px;border-radius:4px;font-size:14px;font-weight:600;text-align:center;letter-spacing:0.3px;">View Full Report</a>
            </td>
            <td style="padding-left:6px;" width="50%">
              <a href="${TEARSHEET_URL}" style="display:block;background-color:transparent;color:#67e8f9;text-decoration:none;padding:12px 20px;border-radius:4px;font-size:14px;font-weight:600;text-align:center;border:1px solid #1e3a8a;letter-spacing:0.3px;">View Tear Sheet</a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 12px 0;color:#67e8f9;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">What You'll Receive</p>
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 8px 0;">
          <tr><td style="padding:5px 0;color:#cbd5e1;font-size:14px;line-height:1.5;">• Material CSE / FWB filings as they happen</td></tr>
          <tr><td style="padding:5px 0;color:#cbd5e1;font-size:14px;line-height:1.5;">• Arcasia JV milestone &amp; catalyst alerts</td></tr>
          <tr><td style="padding:5px 0;color:#cbd5e1;font-size:14px;line-height:1.5;">• Quarterly research updates and coverage notes</td></tr>
          <tr><td style="padding:5px 0;color:#cbd5e1;font-size:14px;line-height:1.5;">• Selected Omnia Capital Partners IR commentary</td></tr>
        </table>
      </td></tr>
      <tr><td style="background-color:#0b1530;padding:22px 36px;border-top:1px solid #1e293b;">
        <p style="margin:0 0 8px 0;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Important Disclosures</p>
        <p style="margin:0;color:#64748b;font-size:11px;line-height:1.55;">
          This communication is for informational purposes only and is research &amp; analysis only. It is not an offer to sell or a solicitation to buy any security, and contains no price targets, ratings, or recommendations. Investing in securities involves risk, including possible loss of principal. Conduct your own due diligence and consult a qualified advisor.
        </p>
      </td></tr>
      <tr><td style="padding:20px 36px;border-top:1px solid #1e293b;border-radius:0 0 8px 8px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
          <td><p style="margin:0;color:#cbd5e1;font-size:12px;">Predictiv AI Inc. · <a href="${SITE_URL}" style="color:#67e8f9;text-decoration:none;">73-76.com</a></p></td>
          <td align="right"><a href="${unsubscribeUrl(subscriberId)}" style="color:#64748b;font-size:11px;text-decoration:underline;">Unsubscribe</a></td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function welcomeText(firstName: string, subscriberId: string): string {
  return `Hi ${firstName},

You're confirmed on the Predictiv AI Inc. (CSE: PAI · FWB: 7IT) institutional coverage list.

YOUR RESEARCH MATERIALS
- Full Research Report: ${REPORT_URL}
- One-Page Tear Sheet: ${TEARSHEET_URL}

WHAT YOU'LL RECEIVE
- Material CSE / FWB filings as they happen
- Arcasia JV milestone & catalyst alerts
- Quarterly research updates and coverage notes
- Selected Omnia Capital Partners IR commentary

IMPORTANT DISCLOSURES
This communication is for informational purposes only and is research & analysis only. It is not an offer to sell or solicitation to buy any security, and contains no price targets, ratings, or recommendations. Investing in securities involves risk, including possible loss of principal.

Predictiv AI Inc. · ${SITE_URL}
Unsubscribe: ${unsubscribeUrl(subscriberId)}`;
}

async function sendWelcomeSMS(phone: string, firstName: string): Promise<void> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_PHONE_NUMBER");
  if (!sid || !token || !from) { console.log("Twilio not configured"); return; }
  let p = phone.replace(/\D/g, "");
  if (!p.startsWith("1") && p.length === 10) p = "1" + p;
  p = "+" + p;
  const body = `Welcome to Predictiv AI (CSE: PAI) alerts, ${firstName}. Material news + catalysts via SMS. Reply STOP to opt out.`;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { "Authorization": "Basic " + btoa(`${sid}:${token}`), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: p, From: from, Body: body }),
  });
  if (!res.ok) console.error("Twilio SMS error:", await res.text());
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { subscriberId, firstName, email, phone, smsOptedIn }: WelcomeEmailRequest = await req.json();
    console.log(`[send-welcome-email] to=${email} from=${FROM_ADDRESS}`);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const emailResponse = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Welcome — Your Predictiv AI (CSE: PAI) Research Access",
      html: welcomeHTML(firstName, subscriberId),
      text: welcomeText(firstName, subscriberId),
    });
    console.log("[send-welcome-email] resend response:", JSON.stringify(emailResponse));

    if (smsOptedIn && phone) {
      try { await sendWelcomeSMS(phone, firstName); } catch (e) { console.error("SMS err:", e); }
    }

    const { error: dripErr } = await supabase
      .from("drip_campaign_status")
      .insert({ signup_id: subscriberId, email_1_sent_at: new Date().toISOString() });
    if (dripErr) console.error("drip insert err:", dripErr);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[send-welcome-email] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
