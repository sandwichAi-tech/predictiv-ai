import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LatestReleaseBody from "@/components/LatestReleaseBody";
import { latestRelease } from "@/data/latestRelease";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getSubscriberId, getVisitorId } from "@/lib/visitorIdentity";

const trackView = async () => {
  try {
    await supabase.from("analytics_events").insert([
      {
        event_type: "press_release_view",
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        page_url: window.location.href,
        event_data: { press_release_id: latestRelease.id, subscriber_id: getSubscriberId(), placement: "featured_modal" },
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
              Just Released · Oct 8, 2026
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              AWS · Aviation
            </span>
          </div>

          <h2 className="font-serif text-xl md:text-[1.6rem] font-semibold text-foreground leading-tight tracking-tight mb-3">
            {latestRelease.headline}
          </h2>
          <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-2xl mb-6">
            {latestRelease.summary}
          </p>

          <Button
            onClick={() => {
              setOpen(true);
              trackView();
            }}
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_hsl(var(--accent)/0.8)]"
          >
            Read the Full Release
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-[calc(100vw-1.5rem)] h-[88dvh] flex flex-col gap-0 overflow-hidden p-0 border-accent/40 bg-card shadow-[0_40px_120px_-40px_hsl(var(--accent)/0.45)]">
          <div className="h-1 w-full bg-gradient-to-r from-accent/30 via-accent to-accent/30" />
          <div className="px-5 md:px-9 shrink-0 pt-6 pb-4 border-b border-border">
            <div className="flex flex-wrap items-center gap-3 mb-3 pr-8">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm bg-accent/15 text-accent border border-accent/30">
                News Release
              </span>
              <span className="font-mono text-[11px] text-muted-foreground tracking-[0.16em] uppercase">
                October 8, 2026 · CSE: PAI · FWB: 7IT
              </span>
            </div>
            <DialogTitle className="font-serif text-lg md:text-2xl text-foreground leading-tight text-left break-words">
              {latestRelease.headline}
            </DialogTitle>
            <p className="mt-2 font-serif text-[13px] md:text-sm italic text-muted-foreground">
              {latestRelease.caution}
            </p>
          </div>

          <div className="overflow-y-auto overscroll-contain px-5 md:px-9 py-6 min-h-0 flex-1 space-y-4">
            <LatestReleaseBody />
            <Button asChild variant="outline">
              <a href={latestRelease.sourceUrl} target="_blank" rel="noopener noreferrer">View Original Release ↗</a>
            </Button>
          </div>

          <div className="px-5 md:px-9 shrink-0 py-4 border-t border-border bg-background/60 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Issuer-Paid Communication · Not Investment Advice
            </span>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent border border-accent/40 hover:border-accent rounded-sm px-3 py-2 transition-colors"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedRelease;
