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

  const displayPrice = priceLoading
    ? "—"
    : currentPrice !== undefined && currentPrice > 0
      ? `C$${currentPrice.toFixed(3)}`
      : "—";

  const changeColor = change >= 0 ? "text-[hsl(140_85%_55%)]" : "text-hot";
  const changeSign = change >= 0 ? "+" : "";

  const CSE_TO_CONSOLIDATED = 1 / 0.6966;
  const consolidatedVolume =
    typeof volume === "number" ? Math.round(volume * CSE_TO_CONSOLIDATED) : null;
  const displayVolume =
    consolidatedVolume !== null
      ? new Intl.NumberFormat("en-US").format(consolidatedVolume)
      : null;

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

  return (
    <section className="relative overflow-hidden text-foreground gradient-hero px-5 pt-8 pb-10 md:pt-10 md:pb-12">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Trust strip — listings front-and-center */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-5">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 border border-accent/40 text-accent rounded-sm">
            CSE: PAI
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 border border-accent/40 text-accent rounded-sm">
            OTCID: PCIVF
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 border border-accent/40 text-accent rounded-sm">
            FWB: 7IT
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 border border-hot/40 text-hot rounded-sm">
            Institutional Coverage
          </span>
        </div>

        {/* One-line value prop — under 3 seconds to comprehend */}
        <h1 className="text-balance text-center text-3xl sm:text-5xl md:text-6xl leading-[1.02] font-semibold tracking-tight mb-4">
          AI Infrastructure.{" "}
          <span className="text-foreground/70">Public Markets.</span>{" "}
          <br className="hidden md:block" />
          <span className="text-hot">Real Edge.</span>
        </h1>

        <p className="text-center text-foreground/70 text-base sm:text-lg max-w-2xl mx-auto mb-6">
          Predictiv AI (CSE: PAI) — triple-listed, three commercial products,
          institutional research coverage now live.
        </p>

        {/* Primary + secondary CTA — visible above 600px */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => scrollToId("research")}
            className="w-full sm:w-auto px-7 py-3.5 bg-hot text-background font-mono text-xs tracking-[0.22em] uppercase font-semibold hover:bg-hot/90 transition-colors shadow-[0_0_30px_-8px_hsl(var(--hot)/0.6)]"
          >
            View Latest Research →
          </button>
          <button
            onClick={() => scrollToId("newsletter")}
            className="w-full sm:w-auto px-7 py-3.5 border border-accent/60 text-accent font-mono text-xs tracking-[0.22em] uppercase font-semibold hover:bg-accent/10 transition-colors"
          >
            Get Material Updates
          </button>
        </div>

        {/* Live quote strip — compact, single row */}
        <div className="max-w-3xl mx-auto border-y border-background/15 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/50">
              Last Trade
            </div>
            <div className="font-serif text-xl md:text-2xl text-[hsl(140_85%_55%)] mt-1">
              {displayPrice}
            </div>
            {currentPrice ? (
              <div className={`font-mono text-[10px] mt-0.5 ${changeColor}`}>
                {changeSign}
                {change.toFixed(3)} ({changeSign}
                {changePercent.toFixed(2)}%)
              </div>
            ) : null}
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/50">
              Market Cap
            </div>
            <div className="font-serif text-xl md:text-2xl text-[hsl(140_85%_55%)] mt-1">
              {displayMarketCap}
            </div>
            <div className="font-mono text-[9px] mt-0.5 text-foreground/40">
              118.3M shares
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/50">
              Volume (CA)
            </div>
            <div className="font-serif text-xl md:text-2xl text-foreground/90 mt-1">
              {displayVolume ?? "—"}
            </div>
            <div className="font-mono text-[9px] mt-0.5 text-foreground/40">
              consolidated
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/50">
              Listings
            </div>
            <div className="font-mono text-sm text-foreground/90 mt-1.5">
              CSE · OTC · FWB
            </div>
            <div className="font-mono text-[9px] mt-0.5 text-foreground/40">
              triple-listed
            </div>
          </div>
        </div>

      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40" aria-hidden />
    </section>
  );
};

export default Hero2;
