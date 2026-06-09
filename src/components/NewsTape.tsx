import { useEffect, useState } from "react";

type Headline = { ticker: string; text: string; url?: string };

const HEADLINES: Headline[] = [
  { ticker: "NASDAQ: ANY", text: "Sphere 3D Corp. Advances AI Infrastructure Power Platform Expansion Across Tennessee and Kentucky" },
  { ticker: "NYSE: TOON", text: "Kartoon Studios Expands / Inks Deal w/ Mattel (NASDAQ: MAT) — Q1 +80% Y/Y · See More!" },
  { ticker: "NASDAQ: NDRA", text: "ENDRA Life Sciences Reports MRI-Like Validation for TAEUS® Liver Imaging Device" },
  { ticker: "NASDAQ: PRSO", text: "Peraso Enters Commercial Phase — Additional Order(s) Shipped · More Stocks Inside" },
  { ticker: "TSXV: GMG · OTCQX: GMGMF", text: "Graphene Ltd Signs Energy-Saving Deals w/ Oil and Gas Majors · More Stocks Inside" },
  { ticker: "OTCQB: ADMQ", text: "ADM Endeavors — Q1 +10.6% Y/Y Growth, Expanding Margins · More Stocks Inside" },
  { ticker: "CSE: DOSE · OTCQB: RDTCF", text: "Rapid Dose Leading $5.21B Oral Thin Film Market — See Why" },
  { ticker: "NYSE: TOON", text: "Kartoon Studios' CFO Sets 2026 Expectations — Listen Now" },
  { ticker: "WATCHLIST", text: "Stocks Under $1: NXXT, TOON, VRAX, AIM, SBFM on Breakout Watch" },
  { ticker: "ACTIVE NOW", text: "Stocks to Watch: NDRA, SBFM, GOVX, HIVE, ANY Trading Actively NOW!" },
];

// Google News rejects long/punctuated search URLs, so fall back to a clean
// ticker-only query when an item doesn't have a direct article URL.
const storyUrl = (h: Headline) => {
  if (h.url) return h.url;
  // Use the ticker symbol after the colon (e.g. "NASDAQ: ANY" -> "ANY"),
  // or the first token if there's no colon. Keeps the query short & valid.
  const sym = h.ticker.split("·")[0].split(":").pop()?.trim() || h.ticker;
  return `https://news.google.com/search?q=${encodeURIComponent(sym)}`;
};

const ROTATE_MS = 15_000;

const NewsTape = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HEADLINES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const h = HEADLINES[idx];

  return (
    <div
      className="border border-border bg-[hsl(220_45%_7%)] rounded-md overflow-hidden mb-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-stretch min-h-[40px]">
        <div className="relative flex-1 overflow-hidden">
          <a
            key={idx}
            href={storyUrl(h)}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 animate-newstape-flip group"
          >
            <span className="inline-flex items-baseline gap-3 font-mono text-[12px] sm:text-[13px]">
              <span className="text-accent font-semibold tracking-wider whitespace-nowrap">{h.ticker}</span>
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">{h.text}</span>
              <span className="text-hot/80 group-hover:text-hot transition-colors whitespace-nowrap">› Read</span>
            </span>
          </a>
        </div>

        <div className="shrink-0 hidden sm:flex items-center gap-2 px-3 border-l border-border">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
            {String(idx + 1).padStart(2, "0")}/{String(HEADLINES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsTape;
