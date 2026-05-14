import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")!;
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANDING_PAGE_URL = "https://biotechpick.com";

interface OutboundRequest {
  campaignName: string;
  emailType: "initial" | "followup" | "final";
  recipients: Array<{ email: string; firstName: string }>;
  subjectVariant?: "A" | "B" | "C" | "D"; // For A/B testing
}

const SUBJECT_LINES = {
  initial: {
    A: "BioVaxys (BVAXF): New Research Report Available",
    B: "BVAXF: 200%+ Upside Opportunity — Full Analysis Inside",
    C: "Clinical-Stage Biotech at $6.4M Market Cap",
    D: "IMV Platform Acquired at 99% Discount — Research Inside",
  },
  followup: "Quick follow-up: BioVaxys research (BVAXF)",
  final: "Last chance: BVAXF research access",
};

function generateInitialEmail(firstName: string): string {
  const utm = "utm_source=mailgun&utm_medium=email&utm_campaign=bvaxf_outbound_initial";
  return `Hi ${firstName},

We've published new institutional research on BioVaxys Technology Corp. (OTCQB: BVAXF), a clinical-stage immunotherapy company trading at a $6.4M market cap with Phase IIB assets. The DPX™ platform was acquired from IMV Inc. for ~$1M—a 99% discount to IMV's prior $500M valuation. Our 12-month target is $0.48-$0.60, representing 200-275% potential upside from current levels.

Access the full research report and one-page tear sheet here: ${LANDING_PAGE_URL}?${utm}

Institutional Equity Research
biotechpick.com

This email is for informational purposes only and does not constitute investment advice. Investment in clinical-stage biotechnology involves substantial risk including total loss of principal.

Unsubscribe: <%unsubscribe_url%>`;
}

function generateFollowupEmail(firstName: string): string {
  const utm = "utm_source=mailgun&utm_medium=email&utm_campaign=bvaxf_outbound_followup";
  return `Hi ${firstName},

Following up on the BioVaxys research we published. Key points at a glance:

- OTCQB: BVAXF | $0.16 current | $6.4M market cap
- Phase IIB lead asset with 63% disease control rate
- DPX™ platform acquired at 99% discount to prior valuation
- 12-month target: $0.48-$0.60 (200-275% upside)

One-page tear sheet and full report available here: ${LANDING_PAGE_URL}?${utm}

Institutional Equity Research
biotechpick.com

Unsubscribe: <%unsubscribe_url%>`;
}

function generateFinalEmail(firstName: string): string {
  const utm = "utm_source=mailgun&utm_medium=email&utm_campaign=bvaxf_outbound_final";
  return `Hi ${firstName},

This is our final follow-up on the BioVaxys research. If biotech microcaps aren't a fit for your portfolio right now, no problem—just wanted to make sure you had access.

The full report covers the IMV acquisition, clinical pipeline, valuation scenarios, and risk factors. The tear sheet gives you everything on one page.

${LANDING_PAGE_URL}?${utm}

We'll reach out again when we publish new research.

Institutional Equity Research
biotechpick.com

Unsubscribe: <%unsubscribe_url%>`;
}

async function sendMailgunEmail(
  to: string,
  subject: string,
  text: string,
  campaignId: string
): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("from", `Institutional Equity Research <research@${MAILGUN_DOMAIN}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("text", text);
  formData.append("o:tracking", "yes");
  formData.append("o:tracking-clicks", "yes");
  formData.append("o:tracking-opens", "yes");
  formData.append("o:tag", campaignId);

  const response = await fetch(
    `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Mailgun error:", errorText);
    throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-outbound-campaign function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignName, emailType, recipients, subjectVariant }: OutboundRequest = await req.json();
    console.log(`Sending ${emailType} campaign "${campaignName}" to ${recipients.length} recipients`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create campaign record
    const subject = emailType === "initial"
      ? SUBJECT_LINES.initial[subjectVariant || "A"]
      : emailType === "followup"
      ? SUBJECT_LINES.followup
      : SUBJECT_LINES.final;

    const { data: campaign, error: campaignError } = await supabase
      .from("outbound_campaigns")
      .insert({
        name: campaignName,
        subject_a: subject,
        subject_b: emailType === "initial" && subjectVariant ? SUBJECT_LINES.initial[subjectVariant] : null,
      })
      .select()
      .single();

    if (campaignError) {
      console.error("Error creating campaign:", campaignError);
      throw campaignError;
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Generate email content based on type
    const getEmailContent = (firstName: string) => {
      switch (emailType) {
        case "initial":
          return generateInitialEmail(firstName);
        case "followup":
          return generateFollowupEmail(firstName);
        case "final":
          return generateFinalEmail(firstName);
        default:
          return generateInitialEmail(firstName);
      }
    };

    // Send emails
    for (const recipient of recipients) {
      try {
        const content = getEmailContent(recipient.firstName);
        const mailgunResponse = await sendMailgunEmail(
          recipient.email,
          subject,
          content,
          campaign.id
        );

        // Log the send
        await supabase.from("outbound_email_log").insert({
          campaign_id: campaign.id,
          email: recipient.email,
          subject_variant: subjectVariant || "A",
          mailgun_id: mailgunResponse.id,
        });

        results.sent++;
        console.log(`Sent to ${recipient.email}: ${mailgunResponse.id}`);
      } catch (err: any) {
        console.error(`Failed to send to ${recipient.email}:`, err);
        results.failed++;
        results.errors.push(`${recipient.email}: ${err.message}`);
      }
    }

    // Update campaign sent count
    await supabase
      .from("outbound_campaigns")
      .update({ sent_count: results.sent })
      .eq("id", campaign.id);

    console.log("Outbound campaign complete:", results);

    return new Response(JSON.stringify({ success: true, campaignId: campaign.id, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-outbound-campaign function:", error);
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
