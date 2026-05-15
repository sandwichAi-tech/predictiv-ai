import { Truck, Gauge, Headphones, Building2, FileSearch, CloudRain, ArrowRight } from "lucide-react";

const divisions = [
  {
    icon: Truck,
    tags: "Logistics • First/Middle/Last-Mile • AI Execution",
    name: "Shift Technologies",
    status: "Flagship · Arcasia JV (Apr 2026)",
    description:
      "AI-powered logistics platform spanning first-mile, middle-mile and last-mile execution. Subject of the 51/49 joint venture with Arcasia Holdings — embedded directly inside an existing South Asian logistics ecosystem.",
  },
  {
    icon: Gauge,
    tags: "Fleet • Telematics • Predictive Ops",
    name: "Shiftmatics",
    status: "Commercial · Active",
    description:
      "Fleet management software with predictive performance, dispatch and operational analytics — purpose-built for multi-operator transport networks.",
  },
  {
    icon: Headphones,
    tags: "Voice • Chat • SMS Automation",
    name: "CloudRep",
    status: "Commercial · Customer Wins",
    description:
      "AI-based voice, chat and SMS agents for fleet dispatch, customer service and structured operational workflows where labor scarcity makes automation an immediate ROI.",
  },
  {
    icon: Building2,
    tags: "Real Estate • Workflow • Intelligence",
    name: "Housestack",
    status: "Commercial · Active",
    description:
      "Real estate intelligence and workflow tooling for agents, brokerages and operators — structured data and AI-driven productivity.",
  },
  {
    icon: FileSearch,
    tags: "Property History • Risk • Diligence",
    name: "Housefax",
    status: "Commercial · Active",
    description:
      "Property history and risk intelligence — structured reports and data for residential real estate diligence and underwriting.",
  },
  {
    icon: CloudRain,
    tags: "Weather • Road Intelligence • Routing",
    name: "Weather Telematics",
    status: "Commercial · Active",
    description:
      "Hyper-local road and weather intelligence for fleet routing, safety and risk optimization — feeding Shift and third-party telematics platforms.",
  },
];

const Divisions = () => {
  return (
    <section id="divisions" className="bg-background py-16 px-5 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-primary font-mono text-xs tracking-widest uppercase mb-2">
            Product Lines
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Six Vertical AI Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Predictiv AI operates six commercial product lines across fleet telematics, voice/chat automation and real estate intelligence — production-grade software, one corporate umbrella.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.predictiv.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all"
          >
            Visit predictiv.ai <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Divisions;
