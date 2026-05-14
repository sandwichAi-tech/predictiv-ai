import { TrendingUp, Activity } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  currentPrice?: number;
  priceLoading?: boolean;
}

const Hero = ({ currentPrice, priceLoading }: HeroProps) => {
  const targetLow = 0.40;
  const targetHigh = 1.20;
  
  const upsideLow = currentPrice ? Math.round(((targetLow - currentPrice) / currentPrice) * 100) : 208;
  const upsideHigh = currentPrice ? Math.round(((targetHigh - currentPrice) / currentPrice) * 100) : 823;
  
  const displayPrice = priceLoading ? '...' : currentPrice ? `C$${currentPrice.toFixed(3)}` : 'C$0.130';

  return (
    <section className="gradient-hero text-foreground py-12 md:py-20 px-5 relative overflow-hidden">
      {/* Animated background layers */}
      <div
        aria-hidden
        className="absolute inset-0 hero-bg-drift opacity-80"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hero-bg-pulse mix-blend-screen opacity-60"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(20deg) blur(2px)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.55) 60%, hsl(var(--background)) 100%)',
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}

        <span className="inline-block bg-primary/20 border border-primary/40 px-4 py-1.5 rounded text-xs font-semibold tracking-wider uppercase mb-4 text-primary">
          Institutional Equity Research
        </span>
        
        {/* Company Name */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
          Predictiv AI Inc.
        </h1>
        
        {/* Sector Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-card border border-border px-3 py-1 rounded text-xs font-medium tracking-wide text-muted-foreground">
            <Activity className="w-3 h-3 text-primary" />
            Vertical AI · Fleet Telematics · Voice/Chat Automation · Real Estate Intelligence
          </span>
        </div>
        
        {/* Ticker with Live Price */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-3">
            <span className="text-muted-foreground text-sm">CSE:</span>
            <span className="font-mono font-bold text-lg text-foreground">PAI</span>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="font-mono text-lg text-primary font-bold">{displayPrice}</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-3">
            <span className="text-muted-foreground text-sm">FWB:</span>
            <span className="font-mono font-bold text-lg text-foreground">7IT</span>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="inline-block bg-primary px-8 py-3 rounded mb-4 glow-green">
          <span className="text-lg font-bold tracking-wide text-primary-foreground">
            SPECULATIVE BUY
          </span>
        </div>
        
        {/* Price Target */}
        <div className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
          12-Month Target: <span className="text-primary text-glow">C$0.40 (Base) – C$1.20 (Bull)</span>
        </div>
        <p className="text-xs text-muted-foreground italic max-w-xl mx-auto mb-2">
          Forward-looking estimate. Not investment advice. Subject to market risk and material change.
        </p>
        
        {/* Upside Display */}
        <div className="flex items-center justify-center gap-2 text-base">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">Upside Potential:</span>
          <span className="text-primary font-semibold font-mono">{upsideLow}% - {upsideHigh}%</span>
        </div>
        
        {/* Shell Risk Removed Badge */}
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded text-sm text-primary">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            CSE Listed Dec 22, 2025 · Dual Listed Frankfurt (7IT) · IR by AGORACOM
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
