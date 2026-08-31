import { useEffect, useState } from "react";

interface SiteHeaderProps {
  quote?: {
    price?: number;
    change?: number;
    changePercent?: number;
  } | null;
  priceLoading?: boolean;
}

const NAV = [
  { id: "research", label: "Research" },
  { id: "divisions", label: "Products" },
  { id: "catalysts", label: "Catalysts" },
  { id: "leadership", label: "Team" },
  { id: "news", label: "News" },
];

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SiteHeader = ({ quote, priceLoading }: SiteHeaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const price = quote?.price;
  const changePercent = quote?.changePercent ?? 0;
  const isUp = (quote?.change ?? 0) >= 0;
  const displayPrice =
    priceLoading || !price || price <= 0 ? "—" : `C$${price.toFixed(3)}`;

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1080px] mx-auto px-5 h-14 flex items-center gap-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-baseline gap-2 shrink-0"
          aria-label="Predictiv AI — top of page"
        >
          <span className="font-serif text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Predictiv<span className="text-accent"> AI</span>
          </span>
          <span className="hidden sm:inline font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground">
            CSE: PAI
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-5 ml-2">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollToId(n.id)}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            <span className="font-mono text-sm text-foreground/90">{displayPrice}</span>
            {price ? (
              <span className={`font-mono text-[10px] ${isUp ? "text-[hsl(140_85%_55%)]" : "text-destructive"}`}>
                {isUp ? "+" : ""}
                {changePercent.toFixed(2)}%
              </span>
            ) : null}
          </div>
          <button
            onClick={() => scrollToId("get-research")}
            className="px-3.5 py-2 bg-accent text-accent-foreground font-mono text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Get Research
          </button>
        </div>
      </div>
      <div className="h-[2px] bg-transparent">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
};

export default SiteHeader;
