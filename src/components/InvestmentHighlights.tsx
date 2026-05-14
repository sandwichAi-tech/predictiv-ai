import { Cpu, Globe, DollarSign, Users, Mountain, Shield, TrendingUp, Layers } from "lucide-react";

const highlights = [
  {
    icon: Cpu,
    title: "InfernoGrid GPU Marketplace",
    description: "$21B+ addressable market by 2030 (26–36% CAGR) — monetizing idle GPUs for AI compute with real cash payouts",
  },
  {
    icon: Globe,
    title: "250M+ GPUs Shipped Annually",
    description: "Massive untapped supply across gaming PCs, workstations, university labs, and mining rigs",
  },
  {
    icon: DollarSign,
    title: "Koilink Fintech Platform",
    description: "$340B global fintech market — front-end complete, OTC listing paperwork submitted",
  },
  {
    icon: Users,
    title: "70% Insider Ownership",
    description: "~77.4M shares held by insiders — strong management alignment with shareholders",
  },
  {
    icon: Mountain,
    title: "Gold Mining Optionality",
    description: "Blue Crown lease in California Motherlode with $55M+ historical production at $20/oz gold",
  },
  {
    icon: Shield,
    title: "Shell Risk Removed",
    description: "OTC Markets validated operational status (March 2025) — regulatory clarity achieved",
  },
  {
    icon: TrendingUp,
    title: "Near 52-Week High",
    description: "Stock at $0.09 — at 52-week high with strong momentum off $0.007 low",
  },
  {
    icon: Layers,
    title: "Asset-Light Model",
    description: "Platform-based revenue with transaction fees and minimal capex post-launch",
  },
];

const InvestmentHighlights = () => {
  return (
    <section className="bg-background py-14 px-5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
          Investment Highlights
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Key value drivers under institutional review
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, index) => (
            <div key={index} className="highlight-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentHighlights;
