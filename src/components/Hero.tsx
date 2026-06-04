import TrendingTickers from "./TrendingTickers";
import NewsTape from "./NewsTape";

interface HeroProps {
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

const Hero = ({ quote, priceLoading }: HeroProps) => {
  const currentPrice = quote?.price;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const asOf = quote?.asOf;
  const volume = quote?.volume;

  const displayPrice = priceLoading
    ? '—'
    : currentPrice !== undefined && currentPrice > 0
      ? `C$${currentPrice.toFixed(3)}`
      : '—';

  const changeColor = change >= 0 ? 'text-[hsl(140_85%_55%)]' : 'text-hot';
  const changeSign = change >= 0 ? '+' : '';

  const lastTradeLabel = asOf
    ? new Date(asOf * 1000).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }) + ' ET'
    : null;

  const CSE_TO_CONSOLIDATED = 1 / 0.6966;
  const consolidatedVolume = typeof volume === 'number'
    ? Math.round(volume * CSE_TO_CONSOLIDATED)
    : null;
  const displayVolume = consolidatedVolume !== null
    ? new Intl.NumberFormat('en-US').format(consolidatedVolume)
    : null;

  const SHARES_OUTSTANDING = 118_300_000;
  const marketCapValue = currentPrice && currentPrice > 0
    ? currentPrice * SHARES_OUTSTANDING
    : null;
  const formatMarketCap = (v: number) => {
    if (v >= 1_000_000_000) return `C$${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `C$${(v / 1_000_000).toFixed(2)}M`;
    return `C$${new Intl.NumberFormat('en-US').format(Math.round(v))}`;
  };
  const displayMarketCap = priceLoading
    ? '—'
    : marketCapValue !== null
      ? formatMarketCap(marketCapValue)
      : '—';

  return (
    <>
      <div className="bg-primary/10 border-b border-primary/30 px-5 py-2">
        <p className="max-w-5xl mx-auto text-center font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-foreground/80 leading-relaxed">
          Issuer-Paid Communication · Section 17(b) Disclosure: Omnia Capital Partners USA LLC has been paid US$1,500 by Predictiv AI Inc. for this landing page · Not investment advice
        </p>
      </div>
      <section className="relative overflow-hidden text-foreground gradient-hero py-12 md:py-16 px-5">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-hot/60" />
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-hot">
              Predictiv AI Inc. · CSE: PAI · OTCID: PCIVF · FWB: 7IT
            </span>
            <span className="h-px w-8 bg-hot/60" />
          </div>

          <h1 className="text-balance text-center text-4xl sm:text-5xl md:text-[4.5rem] leading-[0.95] font-semibold mb-3 tracking-tight">
            Predictive AI.
            <br className="hidden md:block" />
            Real Markets.{" "}
            <br className="hidden md:block" />
            <span className="text-hot">Real Edge.</span>
          </h1>

          <p className="text-center text-foreground/70 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto mb-3">
            AI Solutions Built for Your Industry
          </p>

          <p className="text-center text-foreground/50 font-mono text-xs sm:text-sm tracking-[0.12em] uppercase mb-6 max-w-2xl mx-auto">
            Integrated platforms. Purpose-built for impact.
          </p>

          <div className="text-center mb-8">
            <span className="inline-block font-mono font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight text-[hsl(140_85%_55%)] drop-shadow-[0_0_25px_hsl(140_85%_45%/0.55)]">
              $PAI
            </span>
          </div>

          <p className="text-center text-foreground/40 font-mono text-[11px] sm:text-xs tracking-[0.15em] uppercase mb-10 max-w-2xl mx-auto">
            CSE · OTC · Frankfurt · Triple-listed AI company
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-10 max-w-3xl mx-auto">
            <div className="text-center sm:text-left border-l-2 border-accent sm:pl-6">
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">
                $PAI · CSE · Last Trade
              </div>
              <div className="font-serif text-5xl md:text-6xl font-semibold text-[hsl(140_85%_55%)] flex items-baseline gap-2 justify-center sm:justify-start">
                {displayPrice}
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden />
              </div>
              {currentPrice ? (
                <div className={`font-mono text-xs mt-1 ${changeColor}`}>
                  {changeSign}{change.toFixed(3)} ({changeSign}{changePercent.toFixed(2)}%)
                </div>
              ) : null}
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase mt-2 text-accent">
                ● Last print (no trades since)
              </div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/40 mt-1 leading-relaxed">
                {lastTradeLabel ? `${lastTradeLabel} · ` : ''}{displayVolume ? `Vol ${displayVolume} sh (consolidated CA) · ` : ''}~20-min delayed · CSE:PAI
              </div>
            </div>
            <div className="text-center sm:text-left border-l-2 border-accent sm:pl-6">
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2">
                Market Cap · Live
              </div>
              <div className="font-serif text-5xl md:text-6xl font-semibold text-[hsl(140_85%_55%)] flex items-baseline gap-2 justify-center sm:justify-start">
                {displayMarketCap}
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden />
              </div>
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase mt-2 text-accent">
                ● Last price × 118.3M shares
              </div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/40 mt-1 leading-relaxed">
                Shares outstanding per company disclosure · ~20-min delayed
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto pt-6 border-t border-background/15">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-center md:text-left">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Market Cap</dt>
                <dd className="font-mono text-sm text-foreground/90 mt-0.5">{displayMarketCap} <span className="text-accent">●</span></dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Shares Out</dt>
                <dd className="font-mono text-sm text-foreground/90 mt-0.5">118.3M</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Products</dt>
                <dd className="font-mono text-sm text-foreground/90 mt-0.5">3 commercial</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Listings</dt>
                <dd className="font-mono text-sm text-foreground/90 mt-0.5">CSE · OTC · Frankfurt</dd>
              </div>
            </dl>

            <p className="text-center font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/45 mt-4 leading-relaxed">
              Market cap calculated live: last trade price × 118.3M shares outstanding · Figures per company disclosure
            </p>

            <p className="text-center font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/40 mt-2">
              Available through participating broker-dealers on CSE, OTC, and Börse Frankfurt
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-10">
            <NewsTape />
            <TrendingTickers />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40" aria-hidden />
      </section>
    </>
  );
};

export default Hero;
