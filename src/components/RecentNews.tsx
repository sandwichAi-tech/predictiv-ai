import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getSubscriberId, getVisitorId } from "@/lib/visitorIdentity";

type Release = {
  id: string;
  date: string;
  tag: string;
  headline: string;
  summary: string;
  body: string;
  sourceUrl?: string;
};

const releases: Release[] = [
  {
    id: "clinicmaster-partnership",
    date: "May 20, 2026",
    tag: "Healthcare Partnership",
    headline:
      "Predictiv AI Announces Strategic Healthcare Partnership and CloudRep.ai Integration with Clinicmaster",
    summary:
      "CloudRep.ai integrates with Clinicmaster's clinic management platform following successful multi-clinic pilot deployments — establishing a repeatable healthcare channel.",
    body:
      "Predictiv AI Inc. (CSE: PAI · OTCID: PCIVF · FWB: 7IT) announced a strategic healthcare partnership and the integration of its CloudRep.ai multi-agent communications platform with Clinicmaster, a leading clinic management system, following the successful completion of multi-clinic pilot deployments. The integration brings CloudRep.ai's voice, chat and SMS automation natively into Clinicmaster-powered clinics — supporting patient intake, scheduling, recalls and front-desk workflows. The partnership establishes a repeatable commercial channel for CloudRep across the healthcare vertical and validates the platform's performance in live clinical environments.",
    sourceUrl: "https://finance.yahoo.com/news/predictiv-ai-announces-strategic-healthcare-120000000.html",
  },
  {
    id: "arcasia-jv",
    date: "Apr 27, 2026",
    tag: "Joint Venture",
    headline: "Predictiv AI Announces 51/49 JV with Arcasia Holdings",
    summary:
      "Shift Technologies enters a 51/49 joint venture with Arcasia Holdings to deploy the AI logistics platform across South Asia, anchored in Sri Lanka.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) has signed a non-binding term sheet with Arcasia Holdings Ltd to establish a 51/49 joint venture for the deployment of the Shift Technologies AI-powered logistics platform across South Asia. The JV will be anchored by a Sri Lanka operating entity, with definitive agreements targeted for Q2 2026. The transaction structures Predictiv as the majority owner of the operating JV while leveraging Arcasia's regional distribution and on-the-ground execution. Management expects the JV to be the primary commercial vehicle for Shift in the South Asian corridor.",
    sourceUrl: "https://ca.finance.yahoo.com/news/predictiv-ais-shift-technologies-enters-123000144.html",
  },
  {
    id: "shiftmatics-hardware",
    date: "Apr 14, 2026",
    tag: "Hardware Launch",
    headline: "Predictiv AI Expands Into Hardware with Shiftmatics — First Client Order Secured",
    summary:
      "Phase 1 of the Shiftmatics hardware platform complete; first client device order received and in progress.",
    body:
      "Predictiv AI Inc. (CSE: PAI · OTCID: PCIVF · FWB: 7IT) announced the completion of Phase 1 of its Shiftmatics hardware platform and the receipt of its first client order. The milestone marks the Company's expansion into hardware-enabled AI infrastructure — combining edge AI, real-time intelligence, and automation as the foundation for autonomous fleet systems. Devices are now in production for the initial customer, establishing the commercial baseline for Shiftmatics' hardware revenue stream and a clear pathway toward fleet-wide deployment.",
    sourceUrl: "https://ca.finance.yahoo.com/news/predictiv-ai-expands-hardware-shiftmatics-123000443.html",
  },
  {
    id: "cloudrep-expansion",
    date: "Mar 25, 2026",
    tag: "Commercial Expansion",
    headline: "Predictiv AI Expands CloudRep.ai Deployment Across Healthcare, Retail, Real Estate, Travel & Global Markets",
    summary:
      "Active deployment of the CloudRep.ai voice / chat / SMS agent platform expands into multiple verticals and international markets.",
    body:
      "Predictiv AI Inc. (CSE: PAI · OTCID: PCIVF · FWB: 7IT) reported continued progress in the deployment and expansion of its enterprise AI communications platform, CloudRep.ai, into multiple industries and international markets. CloudRep.ai is a multi-agent automation platform operating across voice, chat and SMS within a unified environment — supporting customer interactions, process automation and role-specific AI agents across healthcare, retail, real estate, travel and global enterprise channels. The expansion broadens CloudRep's commercial footprint as the Company scales its multi-product Vertical AI strategy.",
    sourceUrl: "https://ca.finance.yahoo.com/news/predictiv-ai-expands-active-deployment-122500216.html",
  },
];

const trackPRView = async (prId: string) => {
  try {
    await supabase.from("analytics_events").insert([{
      event_type: "press_release_view",
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_url: window.location.href,
      event_data: { press_release_id: prId, subscriber_id: getSubscriberId() },
    }]);
  } catch (e) {
    console.error("PR track error", e);
  }
};

const RecentNews = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = releases.find((r) => r.id === openId) ?? null;

  return (
    <section id="news" className="bg-background py-14 md:py-20 px-5 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
            Recent News
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h2 className="font-serif text-2xl md:text-[1.75rem] font-semibold text-foreground mb-8 max-w-2xl tracking-tight leading-tight">
          The latest material releases.
        </h2>
        <div className="divide-y divide-border/70 border border-border rounded-md bg-card shadow-card">
          {releases.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setOpenId(r.id);
                trackPRView(r.id);
              }}
              className="w-full text-left px-5 md:px-7 py-5 hover:bg-muted/40 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground md:w-24 shrink-0 mb-2 md:mb-0">
                  {r.date}
                </div>
                <span className="inline-block self-start font-mono text-[9px] tracking-[0.22em] uppercase px-2 py-0.5 bg-accent/10 text-accent rounded-sm mb-2 md:mb-0 md:mr-4 border border-accent/20">
                  {r.tag}
                </span>
                <h3 className="font-serif text-[15px] md:text-base font-medium text-foreground/95 group-hover:text-accent transition-colors flex-1 leading-snug tracking-tight">
                  {r.headline}
                </h3>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent shrink-0 mt-2 md:mt-0 md:ml-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  Read →
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-4 italic tracking-wide">
          Releases open inline. Full source filings available on ACCESS Newswire.
        </p>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl bg-card">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 bg-accent/15 text-accent rounded">
                {active?.tag}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{active?.date}</span>
            </div>
            <DialogTitle className="font-serif text-2xl text-foreground leading-tight text-left">
              {active?.headline}
            </DialogTitle>
          </DialogHeader>
          <p className="font-serif text-base text-foreground leading-relaxed">
            {active?.body}
          </p>
          {active?.sourceUrl && (
            <a
              href={active.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 font-mono text-xs tracking-[0.18em] uppercase text-accent hover:text-accent/80 transition-colors border border-accent/40 hover:border-accent rounded px-3 py-2 self-start"
            >
              View Source Filing ↗
            </a>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RecentNews;
