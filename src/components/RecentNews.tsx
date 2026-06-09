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
    id: "cardiocomm-collaboration",
    date: "Jun 8, 2026",
    tag: "Strategic Collaboration",
    headline:
      "CardioComm Solutions and Predictiv AI Enter into Strategic AI Collaboration",
    summary:
      "Predictiv AI signs strategic collaboration, joint development and IP agreement with CardioComm Solutions (TSXV: EKG) covering AI-enabled remote patient monitoring, automated ECG interpretation, clinical decision support and software as a medical device applications.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) and CardioComm Solutions, Inc. (TSXV: EKG) have entered into a strategic collaboration, joint development and intellectual property agreement establishing a framework to identify, assess and pursue jointly approved projects across healthcare software, medical software, artificial intelligence, automated analytics, remote patient monitoring, clinical decision support, biosignal interpretation, predictive analytics, workflow optimization and software as a medical device applications. Under the framework, Predictiv AI is expected to contribute capabilities in artificial intelligence, telemetry aggregation, data intelligence and predictive analytics, while CardioComm contributes its proprietary medical software, ECG management technologies, ISO 13485 / ISO 27001 quality and regulatory expertise, and commercialization experience across FDA and Health Canada-cleared products. The agreement preserves each company's existing IP and sets out procedures for ownership, protection and use of any jointly developed IP, with project-specific deliverables, budgets, timelines, regulatory activities and commercialization terms to be addressed through separately approved written project schedules. For any project involving regulated medical software or SaMD, CardioComm retains final authority over quality, regulatory, validation, cybersecurity and release matters.",
    sourceUrl: "https://finance.yahoo.com/sectors/healthcare/articles/cardiocomm-solutions-predictiv-ai-enter-131100422.html",
  },
  {
    id: "prompt-xpress-contract",
    date: "Jun 4, 2026",
    tag: "Commercial Contract",
    headline:
      "Predictiv AI's Shift Technologies Secures Multi-Phase Commercial Contract with Prompt Xpress",
    summary:
      "Shift AI signs multi-phase contract to digitize and scale middle-mile and last-mile logistics for Prompt Xpress, one of Sri Lanka's largest couriers — first commercial deployment under the Arcasia JV.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced that its subsidiary, Shift Technologies Inc. (\"Shift AI\"), has secured a multi-phase commercial contract with Prompt Xpress, one of the largest courier and logistics networks in Sri Lanka. The agreement covers the deployment of Shift AI's transport intelligence platform to digitize and scale Prompt Xpress's middle-mile and last-mile operations. This is the first major commercial deployment executed under the previously announced Shift × Arcasia Holdings joint venture, validating both the JV deployment model and Shift AI's logistics platform in live enterprise operations.",
    sourceUrl: "https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/predictiv-ais-shift-technologies-secures-multi-phase-commercial-contract-to-digi-1170799",
  },
  {
    id: "clinicmaster-partnership",
    date: "May 26, 2026",
    tag: "Healthcare Partnership",
    headline:
      "Predictiv AI Announces Strategic Healthcare Partnership and CloudRep.ai Integration with Clinicmaster",
    summary:
      "Strategic partnership and reseller agreement with ADDATech Systems integrates CloudRep.ai with the Clinicmaster EMR platform following successful multi-clinic pilot deployments.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced a strategic healthcare partnership and reseller agreement with ADDATech Systems Inc., the company behind the Clinicmaster EMR platform, integrating CloudRep.ai's multi-agent voice, chat and SMS automation natively into Clinicmaster-powered clinics. The integration follows the successful completion of multi-clinic pilot deployments and supports patient intake, scheduling, recalls and front-desk workflows. The partnership establishes a repeatable commercial channel for CloudRep across the healthcare vertical and validates the platform's performance in live clinical environments.",
    sourceUrl: "https://www.morningstar.com/news/accesswire/1170266msn/predictiv-ai-announces-strategic-healthcare-partnership-and-cloudrep-ai-integration-with-clinicmaster-following-successful-multi-clinic-pilot-deployments",
  },
  {
    id: "arcasia-jv",
    date: "Apr 28, 2026",
    tag: "Joint Venture",
    headline:
      "Predictiv AI's Shift Technologies Enters Strategic JV with Arcasia Holdings",
    summary:
      "Shift Technologies enters a strategic joint venture with Arcasia Holdings (Pvt) Ltd to deploy the AI-powered logistics platform across global first, middle and last-mile networks, anchored in Sri Lanka.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced that its subsidiary Shift Technologies has entered into a strategic 51/49 joint venture with Arcasia Holdings (Pvt) Ltd to deploy the Shift AI logistics platform across global first, middle and last-mile networks. The JV is anchored by a Sri Lanka operating entity, with definitive agreements targeted for Q2 2026. The transaction structures Predictiv as the majority owner of the operating JV while leveraging Arcasia's regional distribution and on-the-ground execution across South Asia.",
    sourceUrl: "https://www.webdisclosure.com/press-release/predictiv-ai-inc-cve-pai-predictiv-ais-shift-technologies-enters-strategic-joint-venture-with-arcasia-holdings-pvt-ltd-to-deploy-ai-powered-logistics-platform-across-global-first-middle-and-last-mile-networks-GaxF7Yi0X1Y",
  },
  {
    id: "shiftmatics-hardware",
    date: "Apr 14, 2026",
    tag: "Hardware Launch",
    headline:
      "Predictiv AI Expands Into Hardware with Shiftmatics Platform and Secures Initial Client Order",
    summary:
      "Phase 1 of the Shiftmatics hardware platform complete; first client device order received and in progress — foundation for edge AI and autonomous fleet systems.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced the completion of Phase 1 of its Shiftmatics hardware platform and the receipt of its first client order. The milestone marks the Company's expansion into hardware-enabled AI infrastructure — combining edge AI, real-time intelligence and automation as the foundation for autonomous fleet systems. Devices are now in production for the initial customer, establishing the commercial baseline for Shiftmatics' hardware revenue stream and a clear pathway toward fleet-wide deployment.",
    sourceUrl: "https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/predictiv-ai-expands-into-hardware-with-shiftmatics-platform-and-1157372",
  },
  {
    id: "clinical-ai-patent",
    date: "Apr 7, 2026",
    tag: "Product & IP",
    headline:
      "Predictiv AI Introduces Clinical AI Reasoning Platform and Files Patent for Domain-Specific Clinical AI Methodology",
    summary:
      "Launch of a Clinical AI Reasoning Platform — an extension of CloudRep.ai — alongside a patent filing covering domain-specific clinical AI model training and structured clinical reasoning outputs.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced the introduction of its Clinical AI Reasoning Platform, an extension of CloudRep.ai aimed at enhancing medical decision-making, and the filing of a patent application covering its method for training domain-specific clinical AI models and generating structured clinical reasoning outputs. The platform leverages Predictiv's custom small language models tuned for clinical workflows, deepening the Company's intellectual property position in vertical AI for healthcare.",
    sourceUrl: "https://www.finanzwire.com/press-release/predictiv-ai-inc-cve-pai-predictiv-ai-introduces-clinical-ai-reasoning-platform-files-patent-for-domain-specific-clinical-ai-methodology-FB8jniridz8",
  },
  {
    id: "cloudrep-expansion",
    date: "Mar 25, 2026",
    tag: "Commercial Expansion",
    headline:
      "Predictiv AI Expands Active Deployment of CloudRep.ai Across Healthcare, Retail, Real Estate, Travel and Global Markets",
    summary:
      "Active deployment of the CloudRep.ai voice / chat / SMS agent platform expands into multiple verticals and international markets.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) reported continued progress in the deployment and expansion of its enterprise AI communications platform, CloudRep.ai, into multiple industries and international markets. CloudRep.ai is a multi-agent automation platform operating across voice, chat and SMS within a unified environment — supporting customer interactions, process automation and role-specific AI agents across healthcare, retail, real estate, travel and global enterprise channels.",
    sourceUrl: "https://www.predictiv.ai/predictiv-ai-expands-active-deployment-of-cloudrep-ai-across-healthcare-retail-real-estate-travel-and-global-markets/",
  },
  {
    id: "agoracom-vlp",
    date: "Mar 18, 2026",
    tag: "Capital Markets",
    headline:
      "Predictiv AI Launches AGORACOM Marketing Program and Engages Venture Liquidity Partners for Market Making",
    summary:
      "12-month online marketing and IR agreement with AGORACOM, plus engagement of Venture Liquidity Partners to provide market making services for PAI.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced that it has entered into a 12-month online marketing and investor relations agreement with AGORACOM, and engaged Venture Liquidity Partners to provide market making services in support of orderly trading in the Company's common shares. The programs are designed to broaden retail awareness, deepen the shareholder base and improve secondary market liquidity as the Company executes its multi-product Vertical AI strategy.",
    sourceUrl: "https://www.predictiv.ai/predictiv-ai-launches-agoracom-marketing-program-and-engages-venture-liquidity-partners-for-market-making-2/",
  },
  {
    id: "asia-regional-office",
    date: "Feb 10, 2026",
    tag: "Global Expansion",
    headline:
      "Predictiv AI Establishes Asia Regional Office to Support Expansion Across Asia, Africa and the Middle East",
    summary:
      "Establishment of an Asia regional office to support business development and deployment across Asia, Africa and the Middle East.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) announced the establishment of an Asia regional office to support the Company's expansion across Asia, Africa and the Middle East. The regional presence provides on-the-ground capacity for business development, partnership execution and customer deployment for CloudRep.ai, Shift AI and the broader Vertical AI product suite across emerging high-growth corridors.",
    sourceUrl: "https://www.predictiv.ai/predictiv-ai-establishes-asia-regional-office-to-support-expansion-across-asia-africa-and-the-middle-east/",
  },
  {
    id: "innovate-calgary-pilot",
    date: "Feb 2, 2026",
    tag: "Pilot Update",
    headline:
      "Predictiv AI Provides Pilot Update from Innovate Calgary's Soaring Higher Challenge with Calgary Airports and WestJet",
    summary:
      "Market update on the flagship asset and fleet intelligence platform pilot conducted under Innovate Calgary's Soaring Higher Challenge alongside Calgary Airports and WestJet.",
    body:
      "Predictiv AI Inc. (CSE: PAI · FWB: 7IT) provided a market update on its flagship asset and fleet intelligence platform pilot, conducted under Innovate Calgary's Soaring Higher Challenge with Calgary Airports and WestJet. The pilot exercises Predictiv's AI-driven asset and fleet intelligence stack in a live aviation environment, supporting the Company's broader move into hardware-enabled fleet systems via Shiftmatics.",
    sourceUrl: "https://www.predictiv.ai/predictiv-ai-provides-pilot-update-from-innovate-calgarys-soaring-higher-challenge-with-calgary-airports-and-westjet/",
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
