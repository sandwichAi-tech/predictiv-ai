import { Calendar, Handshake, Truck, Globe, TrendingUp } from "lucide-react";

const catalysts = [
  {
    period: "Q2 2026",
    title: "Shift × Arcasia Definitive Agreements",
    description: "Definitive JV agreements, Sri Lanka entity formation, shareholders' and licensing agreements between Shift and the JV",
    icon: Handshake,
    status: "upcoming",
  },
  {
    period: "H2 2026",
    title: "Initial JV Deployments",
    description: "First Shift platform deployments across Arcasia Holdings' logistics network operators",
    icon: Truck,
    status: "upcoming",
  },
  {
    period: "2026",
    title: "Frankfurt (7IT) Institutional Outreach",
    description: "European institutional investor outreach via Omnia Capital Partners following the dual listing",
    icon: Globe,
    status: "upcoming",
  },
  {
    period: "2026 – 2027",
    title: "CloudRep Customer Wins & Multi-Product Scaling",
    description: "Voice/chat customer wins and multi-product revenue scaling across Shift, Shiftmatics, CloudRep, Housestack, Housefax and Weather Telematics",
    icon: TrendingUp,
    status: "future",
  },
];

const CatalystTimeline = () => {
  return (
    <section className="bg-background py-14 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Near-Term Catalysts
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Key Milestones & Timeline
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"></div>

          <div className="space-y-8">
            {catalysts.map((catalyst, index) => (
              <div key={index} className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background -translate-x-1.5 md:-translate-x-1.5 mt-6 glow-green"></div>

                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="catalyst-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded flex items-center justify-center">
                        <catalyst.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-mono text-primary font-semibold">{catalyst.period}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{catalyst.title}</h3>
                    <p className="text-sm text-muted-foreground">{catalyst.description}</p>
                  </div>
                </div>

                <div className="hidden md:block md:w-[calc(50%-2rem)]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalystTimeline;
