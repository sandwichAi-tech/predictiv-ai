import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Newspaper } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
}

interface QuoteData {
  [key: string]: {
    price?: number;
    volume?: number;
    change?: number;
    changePercent?: number;
    currency?: string;
  } | null;
}

interface MarketDataProps {
  quotes?: QuoteData;
  quotesLoading?: boolean;
}

const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(2) + 'M';
  if (volume >= 1_000) return (volume / 1_000).toFixed(1) + 'K';
  return volume.toString();
};

const LISTINGS = [
  {
    flag: '🇨🇦',
    badge: 'PAI',
    name: 'Predictiv AI Inc.',
    exchange: 'CSE',
    widgetSymbol: 'CSE:PAI',
    quoteKey: 'PAI',
    currency: 'C$',
    exchangeUrl: 'https://www.thecse.com/en/listings/technology/predictiv-ai-inc',
  },
  {
    flag: '🇺🇸',
    badge: 'PCIVF',
    name: 'Predictiv AI Inc.',
    exchange: 'OTCID',
    widgetSymbol: 'OTC:PCIVF',
    quoteKey: 'PCIVF',
    currency: '$',
    exchangeUrl: 'https://www.otcmarkets.com/stock/PCIVF/overview',
  },
  {
    flag: '🇩🇪',
    badge: '7IT',
    name: 'Predictiv AI Inc.',
    exchange: 'FWB',
    widgetSymbol: 'FWB:7IT',
    quoteKey: '7IT',
    currency: '€',
    exchangeUrl: 'https://www.boerse-frankfurt.de/equity/7IT',
  },
];

const MarketData = ({ quotes = {}, quotesLoading = false }: MarketDataProps) => {
  return (
    <section className="py-12 md:py-16 bg-terminal-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-hot mb-2">
            Live Market Data
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            $PAI · Triple-Listed Real-Time Quotes
          </h2>
          <p className="text-muted-foreground text-sm mt-2">Live charts from CSE · OTCID · Frankfurt</p>
        </div>

        <div className="space-y-6">
          {LISTINGS.map((l) => (
            <ListingChartCard
              key={l.widgetSymbol}
              {...l}
              quote={quotes[l.quoteKey]}
              quotesLoading={quotesLoading}
            />
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Latest News</h3>
          </div>
          <div className="h-[320px]">
            <OTCNewsTimeline />
          </div>
        </div>

        <p className="text-center text-xs mt-6 text-muted-foreground/50">
          Quotes delayed 15-20 minutes. Data provided by TradingView. For informational purposes only.
        </p>
      </div>
    </section>
  );
};

const TIMEFRAMES = [
  { label: '1D', interval: '5', range: '1D' },
  { label: '1M', interval: '60', range: '1M' },
  { label: '3M', interval: 'D', range: '3M' },
  { label: '1Y', interval: 'D', range: '12M' },
];

interface ListingChartCardProps {
  flag: string;
  badge: string;
  name: string;
  exchange: string;
  widgetSymbol: string;
  currency: string;
  exchangeUrl: string;
  quote?: QuoteData[string];
  quotesLoading?: boolean;
}

const ListingChartCard = ({
  flag, badge, name, exchange, widgetSymbol, currency, exchangeUrl, quote, quotesLoading,
}: ListingChartCardProps) => {
  const [tf, setTf] = useState(TIMEFRAMES[2]); // default 3M
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef(`tv_${badge}_${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetIdRef.current;
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: widgetSymbol,
      interval: tf.interval,
      range: tf.range,
      timezone: 'America/New_York',
      theme: 'dark',
      style: '2', // line
      locale: 'en',
      toolbar_bg: 'rgba(0,0,0,0)',
      backgroundColor: 'rgba(0,0,0,0)',
      gridColor: 'rgba(255,255,255,0.04)',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: false,
      hide_side_toolbar: true,
      allow_symbol_change: false,
      save_image: false,
      withdateranges: false,
      details: false,
      hotlist: false,
      calendar: false,
      studies: ['Volume@tv-basicstudies'],
      container_id: widgetIdRef.current,
    });
    container.appendChild(script);

    return () => { container.innerHTML = ''; };
  }, [widgetSymbol, tf]);

  const price = quote?.price;
  const change = quote?.change ?? 0;
  const changePct = quote?.changePercent ?? 0;
  const volume = quote?.volume;
  const positive = change >= 0;
  const changeColor = positive ? 'text-[hsl(140_85%_55%)]' : 'text-hot';
  const changeBg = positive ? 'bg-[hsl(140_85%_55%)]/10' : 'bg-hot/10';
  const sign = positive ? '+' : '';

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 sm:px-5 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase px-2 py-1 rounded border border-primary/40 text-primary bg-primary/5">
            {badge}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              {flag} {name}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {exchange} · {widgetSymbol}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          {quotesLoading ? (
            <span className="text-2xl font-mono text-muted-foreground">—</span>
          ) : price && price > 0 ? (
            <>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tabular-nums">
                {currency}{price.toFixed(price < 1 ? 3 : 2)}
              </span>
              <span className={`font-mono text-xs sm:text-sm px-2 py-0.5 rounded ${changeBg} ${changeColor} tabular-nums`}>
                {sign}{change.toFixed(3)} ({sign}{changePct.toFixed(2)}%)
              </span>
            </>
          ) : (
            <span className="text-2xl font-mono text-muted-foreground">—</span>
          )}
        </div>

        <div className="flex flex-col items-end leading-tight ml-auto">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">Volume</span>
          <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
            {volume && volume > 0 ? formatVolume(volume) : '—'}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded border border-border bg-background/40 p-0.5">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.label}
              onClick={() => setTf(t)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider rounded transition-colors ${
                tf.label === t.label
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <a
          href={exchangeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label={`Open ${badge} on ${exchange}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Chart */}
      <div className="relative h-[400px] sm:h-[440px] bg-background">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          Data: TradingView · Quotes may be delayed
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70">
          Not financial advice
        </span>
      </div>
    </div>
  );
};

const OTCNewsTimeline = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('otc-markets-news');
        if (error) { setError('Unable to load news'); return; }
        if (data?.news && Array.isArray(data.news)) setNews(data.news.slice(0, 5));
        else setNews([]);
      } catch {
        setError('Unable to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center p-4">
          <Newspaper className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent news available</p>
          <a href="https://www.predictiv.ai/news" target="_blank" rel="noopener noreferrer"
             className="text-xs mt-2 inline-flex items-center gap-1 hover:underline text-primary">
            View on Predictiv AI <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {news.map((item, index) => (
          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer"
             className="block p-3 rounded-lg transition-colors bg-muted/40 hover:bg-muted">
            <h4 className="text-sm font-medium leading-tight mb-1 line-clamp-2 text-foreground">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              {item.source && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-card text-muted-foreground">{item.source}</span>
              )}
              <span className="text-xs text-muted-foreground">{formatDate(item.pubDate)}</span>
            </div>
          </a>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MarketData;
