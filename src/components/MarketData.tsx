import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Newspaper } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    TradingView: any;
  }
}

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
  } | null;
}

interface MarketDataProps {
  quotes?: QuoteData;
  quotesLoading?: boolean;
}

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  }
  return volume.toString();
};

const MarketData = ({ quotes = {}, quotesLoading = false }: MarketDataProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartWidgetRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (chartContainerRef.current && window.TradingView) {
        chartContainerRef.current.innerHTML = '';
        
        chartWidgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: "CSE:PAI",
          interval: "D",
          timezone: "America/New_York",
          theme: "dark",
          style: "2",
          locale: "en",
          toolbar_bg: "#000000",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: "tradingview_chart",
          studies: [],
          hide_side_toolbar: true,
          show_popup_button: false,
          withdateranges: false,
          details: false,
          hotlist: false,
          calendar: false,
          allow_symbol_change: false,
          backgroundColor: "#000000",
          gridColor: "rgba(234, 179, 8, 0.06)",
          overrides: {
            "paneProperties.background": "#000000",
            "paneProperties.backgroundType": "solid",
            "paneProperties.vertGridProperties.color": "rgba(234, 179, 8, 0.06)",
            "paneProperties.horzGridProperties.color": "rgba(234, 179, 8, 0.06)",
            "scalesProperties.textColor": "#eab308",
            "scalesProperties.backgroundColor": "#000000",
            "mainSeriesProperties.lineStyle.color": "#eab308",
            "mainSeriesProperties.lineStyle.linewidth": 2,
            "mainSeriesProperties.areaStyle.color1": "rgba(234, 179, 8, 0.4)",
            "mainSeriesProperties.areaStyle.color2": "rgba(234, 179, 8, 0.0)",
            "mainSeriesProperties.areaStyle.linecolor": "#eab308",
            "mainSeriesProperties.areaStyle.linewidth": 2,
          },
          studies_overrides: {
            "volume.volume.color.0": "rgba(234, 179, 8, 0.35)",
            "volume.volume.color.1": "rgba(234, 179, 8, 0.65)",
            "volume.volume.transparency": 40,
          },
        });
      }
    };
    
    if (window.TradingView) {
      script.onload(new Event('load'));
    } else {
      document.head.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-12 md:py-16 transition-colors duration-300 bg-terminal-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Real-Time Market Data</h2>
            <p className="text-muted-foreground">Live quotes from CSE & Frankfurt</p>
          </div>
        </div>

        {/* Exchange Quote Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          <QuoteChip
            flag="🇨🇦"
            exchange="CSE"
            symbol="PAI"
            widgetSymbol="CSE:PAI"
            volume={quotes['PAI']?.volume}
            volumeLoading={quotesLoading}
            exchangeUrl="https://www.thecse.com/en/listings/technology/predictiv-ai-inc"
          />
          <QuoteChip
            flag="🇺🇸"
            exchange="OTCID"
            symbol="PCIVF"
            widgetSymbol="OTC:PCIVF"
            volume={quotes['PCIVF']?.volume}
            volumeLoading={quotesLoading}
            exchangeUrl="https://www.otcmarkets.com/stock/PCIVF/overview"
          />
          <QuoteChip
            flag="🇩🇪"
            exchange="Frankfurt"
            symbol="7IT"
            widgetSymbol="FWB:7IT"
            volume={quotes['7IT']?.volume}
            volumeLoading={quotesLoading}
            exchangeUrl="https://www.boerse-frankfurt.de/equity/7IT"
          />
        </div>

        {/* Chart + News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 rounded-lg shadow-sm border overflow-hidden bg-card border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">PAI Price Chart</h3>
            </div>
            <div
              id="tradingview_chart"
              ref={chartContainerRef}
              className="h-[450px]"
            />
          </div>

          {/* News Feed */}
          <div className="rounded-lg shadow-sm border overflow-hidden bg-card border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Latest News</h3>
            </div>
            <div className="h-[450px]">
              <OTCNewsTimeline />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs mt-6 text-muted-foreground/50">
          Quotes delayed 15-20 minutes. Data provided by TradingView. For informational purposes only.
        </p>
      </div>
    </section>
  );
};

interface QuoteChipProps {
  flag: string;
  exchange: string;
  symbol: string;
  widgetSymbol: string;
  volume?: number;
  volumeLoading?: boolean;
  exchangeUrl: string;
}

const QuoteChip = ({ flag, exchange, symbol, widgetSymbol, volume, volumeLoading, exchangeUrl }: QuoteChipProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[widgetSymbol]],
      chartOnly: true,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: true,
      hideMarketStatus: true,
      hideSymbolLogo: true,
      scalePosition: "no",
      scaleMode: "Normal",
      fontFamily: "Inter, sans-serif",
      fontSize: "10",
      noTimeScale: true,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["12m|1D"],
      backgroundColor: "rgba(0, 0, 0, 1)",
      gridLineColor: "rgba(234, 179, 8, 0.06)",
      lineColor: "#eab308",
      topColor: "rgba(234, 179, 8, 0.35)",
      bottomColor: "rgba(234, 179, 8, 0)",
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [widgetSymbol]);

  return (
    <a 
      href={exchangeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="quote-chip rounded-lg border shadow-sm transition-all hover:shadow-md flex flex-col cursor-pointer bg-card border-border hover:border-primary/50"
    >
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-2 border-border">
        <span className="text-lg">{flag}</span>
        <span className="text-sm font-medium text-muted-foreground">{exchange}</span>
        <span className="text-sm font-bold ml-auto font-mono text-primary">{symbol}</span>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      {/* TradingView Widget */}
      <div 
        ref={containerRef}
        className="tradingview-widget-container h-[80px] overflow-hidden pointer-events-none"
      />
      {/* Volume Display */}
      <div className="px-3 py-2 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Volume</span>
          {volumeLoading ? (
            <span className="text-xs text-muted-foreground">...</span>
          ) : volume !== undefined && volume > 0 ? (
            <span className="text-xs font-semibold font-mono text-foreground">
              {formatVolume(volume)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">--</span>
          )}
        </div>
      </div>
    </a>
  );
};

const LATEST_NEWS: NewsItem[] = [
  {
    title: "CardioComm Solutions and Predictiv AI Enter into Strategic AI Collaboration",
    link: "https://finance.yahoo.com/sectors/healthcare/articles/cardiocomm-solutions-predictiv-ai-enter-131100422.html",
    pubDate: "2026-06-08",
    description: "",
    source: "Yahoo Finance",
  },
  {
    title: "Predictiv AI's Shift Technologies Secures Multi-Phase Commercial Contract with Prompt Xpress",
    link: "https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/predictiv-ais-shift-technologies-secures-multi-phase-commercial-contract-to-digi-1170799",
    pubDate: "2026-06-04",
    description: "",
    source: "ACCESS Newswire",
  },
  {
    title: "Predictiv AI Announces Strategic Healthcare Partnership and CloudRep.ai Integration with Clinicmaster",
    link: "https://www.morningstar.com/news/accesswire/1170266msn/predictiv-ai-announces-strategic-healthcare-partnership-and-cloudrep-ai-integration-with-clinicmaster-following-successful-multi-clinic-pilot-deployments",
    pubDate: "2026-05-26",
    description: "",
    source: "ACCESS Newswire",
  },
];

const OTCNewsTimeline = () => {
  const news = LATEST_NEWS;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg transition-colors bg-muted/50 hover:bg-muted"
          >
            <h4 className="text-sm font-medium leading-tight mb-1 line-clamp-3 text-foreground">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {item.source && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-card text-muted-foreground">
                  {item.source}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(item.pubDate)}
              </span>
            </div>
          </a>
        ))}

        <a
          href="#news"
          className="block text-center text-xs py-2 hover:underline text-primary"
        >
          View all recent news →
        </a>
      </div>
    </ScrollArea>
  );
};

export default MarketData;
