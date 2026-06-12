import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/lib/emailValidation";
import { getVisitorId, getSessionId } from "@/lib/analytics";

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
    <section className="relative overflow-hidden text-foreground gradient-hero px-5 pt-7 pb-8 md:pt-9 md:pb-10">
      {/* Top utility bar: listings + live price chip */}
      <div className="max-w-5xl mx-auto relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-accent/20">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 border border-accent/40 text-accent rounded-sm">CSE: PAI</span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 border border-accent/40 text-accent rounded-sm">OTCID: PCIVF</span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 border border-accent/40 text-accent rounded-sm">FWB: 7IT</span>
        </div>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-sm transition-colors duration-700 ${flashBg}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(140_85%_55%)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(140_85%_55%)]"></span>
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/60">Live</span>
          <span className="font-serif text-base text-foreground/95">{displayPrice}</span>
          {currentPrice ? (
            <span className={`font-mono text-[10px] ${changeColor}`}>
              {changeSign}{changePercent.toFixed(2)}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-5 gap-8 items-center">
        {/* LEFT: headline + value prop + inline capture */}
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-hot mb-4">
            ▲ Institutional Coverage — Now Live
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.02] font-semibold tracking-tight mb-5">
            The AI infrastructure trade,{" "}
            <span className="text-hot">before</span> the Street prices it in.
          </h1>

          <p className="text-foreground/70 text-base sm:text-lg mb-6 max-w-xl">
            Predictiv AI (CSE: PAI) — triple-listed, three commercial products, full institutional research now available.
          </p>

          {/* Inline email capture — primary conversion */}
          {success ? (
            <div className="border border-accent/40 bg-accent/5 px-5 py-4 max-w-lg">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-1">✓ You're on the distribution</div>
              <div className="text-sm text-foreground/80">Check your inbox — the research PDF is on its way.</div>
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
                Full PDF · catalyst alerts · no spam · unsubscribe anytime
              </div>
            </form>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-foreground/50">
            <span>Trusted by readers across</span>
            <span className="font-mono tracking-[0.15em] uppercase text-foreground/70">Canaccord · TD · RBC · Echelon</span>
          </div>

          <button
            onClick={() => scrollToId("research")}
            className="mt-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Or browse research first →
          </button>
        </div>

        {/* RIGHT: KPI tile stack */}
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
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/50">Listings</div>
              <div className="font-mono text-sm text-foreground/95 mt-1.5">CSE·OTC·FWB</div>
              <div className="font-mono text-[9px] text-foreground/40">triple-listed</div>
            </div>
          </div>
          <div className="border border-hot/30 bg-hot/5 p-3 flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-hot">Next Catalyst</span>
            <span className="font-mono text-[11px] text-foreground/80 ml-auto">Arcasia JV milestones</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40" aria-hidden />
    </section>
  );
};

export default Hero2;
