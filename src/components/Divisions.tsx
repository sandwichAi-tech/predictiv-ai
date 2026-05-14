import { Cpu, Network, Tv, Mountain, ArrowRight } from "lucide-react";

const divisions = [
  {
    icon: Cpu,
    tags: "GPU Compute • Marketplace • AI Infrastructure",
    name: "InfernoGrid",
    status: "Flagship · MVP In Build",
    description:
      "Global GPU-sharing marketplace connecting idle GPU capacity with AI compute demand. Targeting the $21B+ GPU-as-a-Service market by 2030 (26–36% CAGR).",
    url: "https://infernogrid.com",
  },
  {
    icon: Network,
    tags: "Fintech • Capital Markets • Deal-Flow",
    name: "Koilink Technologies",
    status: "19.9% Subsidiary · OTC Listing Pending",
    description:
      "Real-time, geo-social fintech platform connecting brokers, accredited investors, and growth-stage issuers. Front-end complete; pursuing OTC listing in a $340B+ fintech market.",
    url: "https://koilinkinc.com",
  },
  {
    icon: Tv,
    tags: "Streaming • Media • BIPOC Content",
    name: "For Us TV Productions",
    status: "Portfolio Company · Active",
    description:
      "Subscription streaming service for BIPOC filmmakers — films, series, and documentaries distributed across Roku, Apple TV, Amazon TV, and mobile to 300M+ potential viewers.",
  },
  {
    icon: Mountain,
    tags: "Gold • Rare Earths • Mining Optionality",
    name: "Blue Crown Group",
    status: "Partnership · California Motherlode",
    description:
      "Mining lease in California's Eastern Pocket Belt with $55M+ historical gold production. Up to 15 gold-bearing properties targeted within 6 months — gold, telluride, and rare earths.",
  },
];

const Divisions = () => {
  return (
    <section id="divisions" className="bg-background py-16 px-5 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-primary font-mono text-xs tracking-widest uppercase mb-2">
            Portfolio
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Our Divisions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            BBLC operates through focused technology and resource divisions, each designed to build real products and create long-term shareholder value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((d) => (
            <div
              key={d.name}
              className="group bg-card border border-border rounded-xl p-6 transition-all hover:border-primary/60 hover:-translate-y-1 shadow-card hover:shadow-card-hover flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <d.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-primary/80 mb-2">
                {d.tags}
              </p>
              <h3 className="text-xl font-bold text-foreground mb-1">{d.name}</h3>
              <p className="text-[11px] text-muted-foreground/80 uppercase tracking-wide mb-3">
                {d.status}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {d.description}
              </p>
              {d.url && (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all"
                >
                  Visit site <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Divisions;
