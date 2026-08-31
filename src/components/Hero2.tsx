import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/lib/emailValidation";
import { getVisitorId, getSessionId } from "@/lib/visitorIdentity";

interface Hero2Props {
  quote?: {
    price?: number;
    volume?: number;
    change?: number;
    changePercent?: number;
    asOf?: number;
    currency?: string;
    exchange?: string;
  } | null;
  priceLoading?: boolean;
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Hero2 = ({ quote, priceLoading }: Hero2Props) => {
  const currentPrice = quote?.price;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const volume = quote?.volume;

  // Live-price flash effect
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (currentPrice === undefined) return;
    if (prevPrice.current !== undefined && currentPrice !== prevPrice.current) {
      setFlash(currentPrice > prevPrice.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 1200);
      return () => clearTimeout(t);
    }
    prevPrice.current = currentPrice;
  }, [currentPrice]);

  const displayPrice = priceLoading
    ? "—"
    : currentPrice !== undefined && currentPrice > 0
      ? `C$${currentPrice.toFixed(3)}`
      : "—";

  const isUp = change >= 0;
  const changeColor = isUp ? "text-[hsl(140_85%_55%)]" : "text-hot";
  const changeSign = isUp ? "+" : "";

  const SHARES_OUTSTANDING = 118_300_000;
  const marketCapValue =
    currentPrice && currentPrice > 0 ? currentPrice * SHARES_OUTSTANDING : null;
  const formatMarketCap = (v: number) => {
    if (v >= 1_000_000_000) return `C$${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `C$${(v / 1_000_000).toFixed(2)}M`;
    return `C$${new Intl.NumberFormat("en-US").format(Math.round(v))}`;
  };
  const displayMarketCap = priceLoading
    ? "—"
    : marketCapValue !== null
      ? formatMarketCap(marketCapValue)
      : "—";

  // Inline email capture
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateEmail(email);
    if (!v.valid) {
      toast({ title: "Invalid email", description: v.reason, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: email.trim().toLowerCase(),
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          source: "hero2_inline",
          ctaVariant: "report",
          utmSource: urlParams.get("utm_source"),
          utmMedium: urlParams.get("utm_medium"),
          utmCampaign: urlParams.get("utm_campaign"),
        },
      });
      if (error) throw error;
      if (data?.error === "duplicate") {
        toast({ title: "Already on the list", description: "You're already subscribed." });
        setSuccess(true);
        return;
      }
      if (data?.error === "rate_limited") {
        toast({ title: "Too many attempts", description: "Try again in an hour.", variant: "destructive" });
        return;
      }
      if (data?.error) throw new Error(data.message || "Signup failed");
      if (data?.subscriberId) localStorage.setItem("_sub_id", data.subscriberId);
      setSuccess(true);
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err.message || "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const flashBg =
    flash === "up"
      ? "bg-[hsl(140_85%_55%)]/15"
      : flash === "down"
        ? "bg-hot/15"
        : "bg-transparent";

  return (
    <section className="relative overflow-hidden text-foreground gradient-hero px-5 pt-8 pb-10 md:pt-12 md:pb-12">
      {/* Ticker strip */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-wrap items-center justify-between gap-3 mb-7 pb-3 border-b border-accent/20">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {["CSE: PAI", "OTCID: PCIVF", "FWB: 7IT"].map((t) => (
            <span key={t} className="font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 border border-accent/40 text-accent rounded-sm">
              {t}
            </span>
          ))}
        </div>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-sm transition-colors duration-700 ${flashBg}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(140_85%_55%)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(140_85%_55%)]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/60">Last trade</span>
          <span className="font-serif text-base text-foreground/95">{displayPrice}</span>
          {currentPrice ? (
            <span className={`font-mono text-[10px] ${changeColor}`}>
              {changeSign}{changePercent.toFixed(2)}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-5 gap-8 md:gap-10 items-start">
        {/* LEFT */}
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-accent mb-4 flex items-center gap-2">
            <span className="h-px w-6 bg-accent/60" />
            Issuer-Paid Communication · Research &amp; Analysis Only
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.02] font-semibold tracking-tight mb-5">
            Three commercial AI products.
            <br className="hidden sm:block" /> <span className="text-hot">Three exchanges.</span> One ticker.
          </h1>

          <p className="text-foreground/70 text-base sm:text-lg mb-6 max-w-xl">
            Predictiv AI (CSE: PAI · OTCID: PCIVF · FWB: 7IT) builds vertical AI for healthcare, logistics and
            enterprise operations. Get the full research document, financial detail and dated catalyst timeline — free.
          </p>

          {/* Inline email capture */}
          <div id="get-research" className="scroll-mt-20">
            {success ? (
              <div className="border border-accent/40 bg-accent/5 px-5 py-4 max-w-lg">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-1">✓ You've been added</div>
                <div className="text-sm text-foreground/80">Now look in your inbox — the research document is on its way.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="you@firm.com"
                    className="flex-1 bg-background/40 border border-accent/40 px-4 py-3.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors font-mono text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 bg-hot text-background font-mono text-xs tracking-[0.22em] uppercase font-semibold hover:bg-hot/90 transition-colors shadow-[0_0_30px_-8px_hsl(var(--hot)/0.6)] disabled:opacity-60 whitespace-nowrap"
                  >
                    {loading ? "Sending…" : "Get the Research →"}
                  </button>
                </div>
                <div className="mt-2.5 font-mono text-[10px] tracking-[0.15em] uppercase text-foreground/45">
                  Full document · catalyst alerts · no spam · unsubscribe anytime
                </div>
              </form>
            )}
          </div>

          {/* Trust row — factual only */}
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg border-t border-accent/15 pt-4">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/45">Read by</div>
              <div className="font-serif text-lg text-foreground/95">2,400+</div>
              <div className="font-mono text-[9px] text-foreground/40">investors, 30 days</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/45">Listings</div>
              <div className="font-serif text-lg text-foreground/95">3</div>
              <div className="font-mono text-[9px] text-foreground/40">CSE · OTC · FWB</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/45">Latest news</div>
              <div className="font-serif text-lg text-foreground/95">Aug 26</div>
              <div className="font-mono text-[9px] text-foreground/40">corporate update</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollToId("research")}
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Browse the research →
            </button>
            <button
              onClick={() => scrollToId("news")}
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/50 hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Latest releases →
            </button>
          </div>
        </div>

        {/* RIGHT: KPI stack */}
        <div className="md:col-span-2 space-y-2">
          <div className="border border-accent/25 bg-background/30 p-4">
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/50 mb-1">Market Cap</div>
            <div className="font-serif text-2xl text-[hsl(140_85%_55%)]">{displayMarketCap}</div>
            <div className="font-mono text-[10px] text-foreground/40 mt-0.5">118.3M shares outstanding</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-accent/25 bg-background/30 p-3">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/50">Products</div>
              <div className="font-serif text-xl text-foreground/95 mt-1">3</div>
              <div className="font-mono text-[9px] text-foreground/40">commercial</div>
            </div>
            <div className="border border-accent/25 bg-background/30 p-3">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/50">Sectors</div>
              <div className="font-mono text-sm text-foreground/95 mt-1.5">Health·Logistics</div>
              <div className="font-mono text-[9px] text-foreground/40">enterprise AI</div>
            </div>
          </div>
          <div className="border border-hot/30 bg-hot/5 p-3 flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-hot">Next Catalyst</span>
            <span className="font-mono text-[11px] text-foreground/80 ml-auto">Arcasia JV milestones</span>
          </div>
          <button
            onClick={() => scrollToId("catalysts")}
            className="w-full border border-accent/25 bg-background/20 p-3 text-left hover:border-accent/60 transition-colors group"
          >
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/50">Catalyst timeline</div>
            <div className="font-mono text-[11px] text-accent mt-1 group-hover:translate-x-1 transition-transform">
              View dated milestones →
            </div>
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="max-w-5xl mx-auto relative z-10 mt-9 flex justify-center">
        <button
          onClick={() => scrollToId("market-data")}
          className="font-mono text-[10px] tracking-[0.28em] uppercase text-foreground/40 hover:text-accent transition-colors flex flex-col items-center gap-1"
        >
          Scroll for market data
          <span className="animate-bounce">↓</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40" aria-hidden />
    </section>
  );
};

export default Hero2;

