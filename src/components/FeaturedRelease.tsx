import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getSubscriberId, getVisitorId } from "@/lib/visitorIdentity";

const RELEASE_ID = "goc-ai-source-list-sep-2026";

const PARAGRAPHS: string[] = [
  "TORONTO, ON / September 9, 2026 / Predictiv AI Inc. (FWB: 7IT) (CSE: PAI) (the \u201cCompany\u201d or \u201cPredictiv AI\u201d) is pleased to announce that Public Services and Procurement Canada (PSPC) has accepted the Company\u2019s qualification to the Government of Canada\u2019s Artificial Intelligence Source List. In formal notification dated August 26, 2026, PSPC confirmed that Predictiv AI is qualified to participate in subsequent opportunities solicited under Bands 1, 2 and 3.",
  "Predictiv AI is now eligible to participate in subsequent opportunities solicited under the AI Source List across Bands 1, 2 and 3. Band 3 is the highest supplier band under the program and permits eligible requirements of up to $37,500,000 before taxes. Qualification provides access to compete for eligible federal AI procurement opportunities and does not constitute a contract award or guarantee future revenue.",
  "The qualification provides Predictiv AI with a federal procurement pathway through which the Company can pursue opportunities leveraging its capabilities across SHIFT AI, CloudRep.ai and CloudMD. The Company believes this can shorten the path to participating in eligible federal procurement opportunities and support broader public-sector business development.",
];

const SECTION_TITLE = "Expanding Predictiv AI\u2019s Government Procurement Channel";

const SECTION_PARAGRAPHS: string[] = [
  "The Government of Canada is one of the country\u2019s largest technology purchasers, and pre-qualified supplier status provides qualifying companies access to procurement opportunities issued under the AI Source List. Predictiv AI\u2019s qualification follows the Company\u2019s continued build-out of enterprise-grade AI infrastructure across fleet intelligence, communications and healthcare, and its active pursuit of provincial, municipal and airport authority customers across Canada.",
  "The qualification also aligns with Predictiv AI\u2019s commitment to supporting Canadian data sovereignty and strengthening Canada\u2019s domestic AI capabilities. The Company is focused on developing secure, enterprise-grade AI solutions and infrastructure designed to meet Canadian privacy, security and data-governance requirements. Predictiv AI intends to contribute to Canada\u2019s growing AI ecosystem by helping governments and Canadian organizations adopt advanced AI technologies while maintaining appropriate control over how their data is managed, processed and protected.",
];

const QUOTES: string[] = [
  "\u201cQualification across all three bands of the Government of Canada\u2019s Artificial Intelligence Source List is an important milestone for Predictiv AI. It gives us access to a significant federal procurement channel and strengthens our ability to compete for opportunities where secure, enterprise-grade AI can improve government operations. We see this as a meaningful extension of the public-sector strategy we are already advancing across municipal, provincial and other government markets.\u201d",
  "\u201cCanadian data sovereignty is becoming increasingly important as governments and enterprises accelerate the adoption of artificial intelligence. Organizations need the benefits of advanced AI without giving up control over where sensitive data resides, how it is processed or how it is governed. Predictiv AI is building its technology with that requirement in mind. Through SHIFT AI, CloudRep.ai and CloudMD, our objective is to deliver Canadian-controlled AI capabilities that meet demanding privacy, security and governance requirements while helping strengthen Canada\u2019s domestic AI ecosystem.\u201d",
];

const FORWARD_LOOKING =
  "This news release includes forward looking statements that are subject to assumptions, risks and uncertainties. Statements in this news release which are not purely historical are forward looking statements, including without limitation any statements concerning the expected future operating performance of the Company\u2019s business. Although the Company believes that any forward-looking statements in this news release are reasonable, there can be no assurance that any such forward looking statements will prove to be accurate. The Company cautions readers that all forward looking statements are based on assumptions none of which can be assured and are subject to certain risks and uncertainties that could cause actual events or results to differ materially from those indicated in the forward-looking statements. Readers are advised to rely on their own evaluation of such risks and uncertainties and should not place undue reliance on forward-looking statements. The forward-looking statements and information contained in this news release are made as of the date hereof and no undertaking is given to update publicly or revise any forward-looking statements or information, whether as a result of new information, future events or otherwise, unless so required by applicable securities laws or the CSE.";

const trackView = async () => {
  try {
    await supabase.from("analytics_events").insert([
      {
        event_type: "press_release_view",
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        page_url: window.location.href,
        event_data: { press_release_id: RELEASE_ID, subscriber_id: getSubscriberId(), placement: "featured_modal" },
      },
    ]);
  } catch (e) {
    console.error("PR track error", e);
  }
};

const FeaturedRelease = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-card px-5 py-10 md:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ background: "radial-gradient(circle at 20% 0%, hsl(var(--accent)) 0%, transparent 60%)" }}
      />
      <div className="relative max-w-4xl mx-auto">
        <div className="rounded-lg border border-accent/35 bg-background/70 p-6 md:p-8 shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.5)]">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase px-2.5 py-1 rounded-sm bg-accent text-accent-foreground font-semibold">
              Just Released · Sep 9, 2026
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              Federal Procurement
            </span>
          </div>

          <h2 className="font-serif text-xl md:text-[1.6rem] font-semibold text-foreground leading-tight tracking-tight mb-3">
            Predictiv AI Qualifies Across All Three Bands of the Government of Canada Artificial Intelligence Source List
          </h2>
          <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-2xl mb-6">
            Public Services and Procurement Canada confirmed the Company&apos;s qualification under Bands 1, 2 and 3 —
            Band 3 permitting eligible requirements of up to C$37,500,000 before taxes. Qualification permits
            participation in subsequent federal AI opportunities; it is not a contract award or a guarantee of revenue.
          </p>

          <button
            onClick={() => {
              setOpen(true);
              trackView();
            }}
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_hsl(var(--accent)/0.8)]"
          >
            Read the Full Release
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-[calc(100vw-1.5rem)] max-h-[88vh] overflow-hidden p-0 border-accent/40 bg-card shadow-[0_40px_120px_-40px_hsl(var(--accent)/0.45)]">
          <div className="h-1 w-full bg-gradient-to-r from-accent/30 via-accent to-accent/30" />
          <div className="px-5 md:px-9 pt-6 pb-4 border-b border-border">
            <div className="flex flex-wrap items-center gap-3 mb-3 pr-8">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm bg-accent/15 text-accent border border-accent/30">
                News Release
              </span>
              <span className="font-mono text-[11px] text-muted-foreground tracking-[0.16em] uppercase">
                September 9, 2026 · CSE: PAI · FWB: 7IT
              </span>
            </div>
            <DialogTitle className="font-serif text-lg md:text-2xl text-foreground leading-tight text-left break-words">
              Predictiv AI Qualifies Across All Three Bands of Government of Canada Artificial Intelligence Source List
            </DialogTitle>
            <p className="mt-2 font-serif text-[13px] md:text-sm italic text-muted-foreground">
              Qualification enables Predictiv AI to participate in streamlined federal AI procurement opportunities
              across Bands 1, 2 and 3.
            </p>
          </div>

          <div className="overflow-y-auto overscroll-contain px-5 md:px-9 py-6 max-h-[62vh] space-y-4">
            {PARAGRAPHS.map((p, i) => (
              <p key={i} className="font-serif text-[15px] text-foreground/95 leading-relaxed break-words">
                {p}
              </p>
            ))}

            <h3 className="font-mono text-[10px] tracking-[0.24em] uppercase text-accent pt-3">{SECTION_TITLE}</h3>
            {SECTION_PARAGRAPHS.map((p, i) => (
              <p key={i} className="font-serif text-[15px] text-foreground/95 leading-relaxed break-words">
                {p}
              </p>
            ))}

            {QUOTES.map((q, i) => (
              <blockquote
                key={i}
                className="border-l-2 border-accent/60 pl-4 font-serif text-[15px] italic text-foreground/90 leading-relaxed"
              >
                {q}
                <footer className="mt-2 font-mono text-[10px] not-italic tracking-[0.2em] uppercase text-muted-foreground">
                  Suman Pushparajah, Chief Executive Officer
                </footer>
              </blockquote>
            ))}

            <div className="pt-4 border-t border-border">
              <h4 className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-2">
                About Predictiv AI Inc.
              </h4>
              <p className="font-serif text-[14px] text-foreground/90 leading-relaxed">
                Predictiv AI Inc. is a Canadian artificial intelligence company developing vertical AI applications for
                defined industries. The Company&apos;s products address fleet operations and communications, including
                fleet management software, AI-based agents for voice, chat and SMS, and tools designed to support
                structured operational workflows.{" "}
                <a
                  href="https://www.predictiv.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  www.predictiv.ai
                </a>
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground mb-2">
                Forward-Looking Statements
              </h4>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">{FORWARD_LOOKING}</p>
            </div>
          </div>

          <div className="px-5 md:px-9 py-4 border-t border-border bg-background/60 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Issuer-Paid Communication · Not Investment Advice
            </span>
            <button
              onClick={() => setOpen(false)}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent border border-accent/40 hover:border-accent rounded-sm px-3 py-2 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedRelease;
