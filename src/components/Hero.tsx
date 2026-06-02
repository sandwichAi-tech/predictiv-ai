import { Activity } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  currentPrice?: number;
  priceLoading?: boolean;
}

const Hero = ({ currentPrice, priceLoading }: HeroProps) => {
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
        {/* Eyebrow */}
        <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'hsl(var(--accent-gold))' }}>
          Predictiv AI Inc. · CSE: PAI · OTCID: PCIVF · FWB: 7IT
        </p>

        {/* Company Name */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
          Vertical AI · <span className="text-primary">Six Commercial Products</span> · Dual Listed
        </h1>

        {/* Ticker Symbol */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            className="font-display-serif font-bold text-4xl md:text-5xl"
            style={{ color: 'hsl(var(--ticker-green))' }}
          >
            $PAI
          </span>
        </div>

        {/* Sector Subhead */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Activity className="inline w-3 h-3 mr-1.5 text-primary" />
            Vertical AI · Fleet Telematics · Voice/Chat Automation · Real Estate Intelligence
          </span>
        </div>

        {/* Live Price Tape */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">CSE</span>
            <span className="font-mono font-bold text-sm text-foreground">PAI</span>
            <div className="h-4 w-px" style={{ background: 'hsl(var(--accent-gold))' }}></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(var(--ticker-green))' }}></span>
              <span className="font-display-serif text-lg text-foreground font-bold">{displayPrice}</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded px-4 py-2 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">FWB</span>
            <span className="font-mono font-bold text-sm text-foreground">7IT</span>
          </div>
        </div>

        {/* Coverage Badge */}
        <div className="inline-block bg-primary px-8 py-3 rounded mb-4 glow-green">
          <span className="text-lg font-bold tracking-wide text-primary-foreground">
            BREAKOUT
          </span>
        </div>

        <p className="text-xs text-muted-foreground italic max-w-xl mx-auto mb-2">
          Research and analysis only. Not investment advice. Subject to material risk and change.
        </p>

        {/* Listing strip */}
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
