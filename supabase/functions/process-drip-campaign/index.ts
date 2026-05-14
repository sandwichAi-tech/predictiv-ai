import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANDING_PAGE_URL = "https://biotechpick.com";
const REPORT_URL = "https://biotechpick.com";
const TEARSHEET_URL = "https://biotechpick.com";

function generateUnsubscribeUrl(subscriberId: string): string {
  return `${LANDING_PAGE_URL}/unsubscribe?id=${subscriberId}`;
}

// Day 3: Education Email
function generateEducationEmail(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_education";
  return `Hi ${firstName},

THE ACQUISITION

In February 2024, BioVaxys acquired IMV Inc.'s DPX™ platform and clinical assets for approximately $1 million. IMV's prior market cap exceeded $500 million. That's a ~99% discount.

THE PLATFORM

DPX™ is a lipid-based delivery platform that creates a depot at the injection site, enabling sustained antigen presentation. It's being developed for oncology (MVP-S) and has potential as an mRNA delivery carrier—a $98B+ market.

THE DATA

MVP-S demonstrated a 63% disease control rate and 21% objective response rate in platinum-resistant ovarian cancer—a notoriously difficult-to-treat population.

THE MATH

At $6.4M market cap, you're getting clinical-stage assets, 25+ patent families, and blue-chip partnerships (Merck KGaA, Zoetis) at a fraction of comparable company valuations.

Full analysis: ${LANDING_PAGE_URL}?${utm}

— Institutional Equity Research
biotechpick.com

Unsubscribe: ${generateUnsubscribeUrl(subscriberId)}`;
}

// Day 7: Catalysts Email
function generateCatalystsEmail(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_catalysts";
  return `Hi ${firstName},

As you evaluate BioVaxys, here are the key upcoming catalysts we're monitoring:

1. MVP-S PHASE IIB DATA
Additional readouts from the platinum-resistant ovarian cancer trial. Current data: 21% ORR, 63% DCR.

2. BVX-0918 PHASE I INITIATION
HapTenix© platform entering Phase I in Spain for Stage III/IV ovarian cancer.

3. PARTNERSHIP ANNOUNCEMENTS
Potential licensing deals or expanded collaboration with existing partners (Merck KGaA, Zoetis).

4. PATENT GRANTS
Additional patent issuances across US, EU, Japan, and China jurisdictions.

5. GMP SUPPLY AGREEMENTS
Multi-year lipid supply contracts to support ongoing clinical programs.

Our 12-month target remains $0.48-$0.60 (200-275% upside) with a SPECULATIVE BUY rating.

Valuation scenarios and risk factors: ${LANDING_PAGE_URL}?${utm}

— Institutional Equity Research
biotechpick.com

Unsubscribe: ${generateUnsubscribeUrl(subscriberId)}`;
}

// Day 10: Risk Balance Email
function generateRiskEmail(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_risk";
  return `Hi ${firstName},

We've covered the bull case for BioVaxys. Here's what could go wrong:

CLINICAL RISK
~80% of biotech drugs in clinical trials fail. MVP-S could miss endpoints in expanded trials.

CAPITAL REQUIREMENTS
The company will need additional financing. Dilution is likely. Terms matter.

REGULATORY UNCERTAINTY
FDA pathway for DPX™-based therapies is not fully established.

LIQUIDITY RISK
OTCQB trading volume is limited. Position sizing should reflect this.

COMPETITION
Well-funded players (Moderna, BioNTech, Gritstone) are pursuing similar markets.

Our SPECULATIVE BUY rating reflects both the opportunity and these risks. This is appropriate for risk-tolerant investors with proper position sizing who can afford total loss.

Full risk analysis in the report: ${LANDING_PAGE_URL}?${utm}

— Institutional Equity Research
biotechpick.com

Unsubscribe: ${generateUnsubscribeUrl(subscriberId)}`;
}

// Day 14: Re-engagement Email
function generateReengageEmail(firstName: string, subscriberId: string): string {
  const utm = "utm_source=resend&utm_medium=email&utm_campaign=bvaxf_drip_reengage";
  return `Hi ${firstName},

Just checking in. BioVaxys remains on our coverage list with a SPECULATIVE BUY rating and $0.48-$0.60 target.

If you've reviewed the materials and have questions, reply to this email—we read everything.

If biotech microcaps aren't your focus right now, no worries. We'll continue sending research updates as we publish new coverage.

Your materials:
→ Research Report: ${REPORT_URL}?${utm}
→ Tear Sheet: ${TEARSHEET_URL}?${utm}

— Institutional Equity Research
biotechpick.com

Unsubscribe: ${generateUnsubscribeUrl(subscriberId)}`;
}

interface DripCandidate {
  id: string;
  signup_id: string;
  email: string;
  first_name: string;
  created_at: string;
  email_1_sent_at: string | null;
  email_2_sent_at: string | null;
  email_3_sent_at: string | null;
  email_4_sent_at: string | null;
  email_5_sent_at: string | null;
  unsubscribed: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("process-drip-campaign function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active drip campaigns with subscriber data (fixed: now references subscribers table)
    const { data: candidates, error: fetchError } = await supabase
      .from("drip_campaign_status")
      .select(`
        id,
        signup_id,
        email_1_sent_at,
        email_2_sent_at,
        email_3_sent_at,
        email_4_sent_at,
        email_5_sent_at,
        unsubscribed,
        subscribers!inner(email, first_name, created_at)
      `)
      .eq("unsubscribed", false);

    if (fetchError) {
      console.error("Error fetching drip candidates:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${candidates?.length || 0} active drip campaigns`);

    const now = new Date();
    const results = {
      processed: 0,
      email2Sent: 0,
      email3Sent: 0,
      email4Sent: 0,
      email5Sent: 0,
      errors: 0,
    };

    for (const candidate of candidates || []) {
      const subscriber = (candidate as any).subscribers;
      const signupDate = new Date(subscriber.created_at);
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

      try {
        // Day 3: Education email (using biotechpick.com domain for Resend)
        if (daysSinceSignup >= 3 && !candidate.email_2_sent_at) {
          console.log(`Sending Day 3 email to ${subscriber.email}`);
          await resend.emails.send({
            from: "Institutional Equity Research <research@biotechpick.com>",
            to: [subscriber.email],
            subject: "The thesis behind BioVaxys (BVAXF)",
            text: generateEducationEmail(subscriber.first_name, candidate.signup_id),
          });
          await supabase
            .from("drip_campaign_status")
            .update({ email_2_sent_at: now.toISOString() })
            .eq("id", candidate.id);
          results.email2Sent++;
        }

        // Day 7: Catalysts email
        if (daysSinceSignup >= 7 && !candidate.email_3_sent_at) {
          console.log(`Sending Day 7 email to ${subscriber.email}`);
          await resend.emails.send({
            from: "Institutional Equity Research <research@biotechpick.com>",
            to: [subscriber.email],
            subject: "Near-term catalysts for BVAXF",
            text: generateCatalystsEmail(subscriber.first_name, candidate.signup_id),
          });
          await supabase
            .from("drip_campaign_status")
            .update({ email_3_sent_at: now.toISOString() })
            .eq("id", candidate.id);
          results.email3Sent++;
        }

        // Day 10: Risk email
        if (daysSinceSignup >= 10 && !candidate.email_4_sent_at) {
          console.log(`Sending Day 10 email to ${subscriber.email}`);
          await resend.emails.send({
            from: "Institutional Equity Research <research@biotechpick.com>",
            to: [subscriber.email],
            subject: "What could go wrong with BVAXF",
            text: generateRiskEmail(subscriber.first_name, candidate.signup_id),
          });
          await supabase
            .from("drip_campaign_status")
            .update({ email_4_sent_at: now.toISOString() })
            .eq("id", candidate.id);
          results.email4Sent++;
        }

        // Day 14: Re-engagement email
        if (daysSinceSignup >= 14 && !candidate.email_5_sent_at) {
          console.log(`Sending Day 14 email to ${subscriber.email}`);
          await resend.emails.send({
            from: "Institutional Equity Research <research@biotechpick.com>",
            to: [subscriber.email],
            subject: "Still following BVAXF?",
            text: generateReengageEmail(subscriber.first_name, candidate.signup_id),
          });
          await supabase
            .from("drip_campaign_status")
            .update({ email_5_sent_at: now.toISOString() })
            .eq("id", candidate.id);
          results.email5Sent++;
        }

        results.processed++;
      } catch (err) {
        console.error(`Error processing drip for ${subscriber.email}:`, err);
        results.errors++;
      }
    }

    console.log("Drip campaign processing complete:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in process-drip-campaign function:", error);
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
