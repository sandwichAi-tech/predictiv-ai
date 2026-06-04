import { useEffect, useRef } from 'react';

const TrendingTickers = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'CSE:PAI', title: 'PAI' },
        { proName: 'OTC:PCIVF', title: 'PCIVF' },
        { proName: 'FWB:7IT', title: '7IT' },
        { proName: 'NASDAQ:NVDA', title: 'NVDA' },
        { proName: 'NASDAQ:PLTR', title: 'PLTR' },
        { proName: 'NYSE:AI', title: 'C3.ai' },
        { proName: 'NASDAQ:BBAI', title: 'BBAI' },
      ],
      showSymbolLogo: false,
      isTransparent: false,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
      backgroundColor: 'rgba(11, 20, 38, 1)',
    });
    const widgetContainer = document.createElement('div');
    widgetContainer.style.backgroundColor = 'hsl(220 45% 9%)';
    widgetContainer.className = 'tradingview-widget-container__widget';
    ref.current.innerHTML = '';
    ref.current.appendChild(widgetContainer);
    ref.current.appendChild(script);
    return () => { if (ref.current) ref.current.innerHTML = ''; };
  }, []);

  return (
    <div className="border border-border bg-card/80 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-hot ticker-blink" aria-hidden />
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-hot font-semibold">
            Live Tape
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground hidden sm:inline">
          Delayed 15m · TradingView
        </span>
      </div>
      <div ref={ref} className="tradingview-widget-container" />
    </div>
  );
};

export default TrendingTickers;
