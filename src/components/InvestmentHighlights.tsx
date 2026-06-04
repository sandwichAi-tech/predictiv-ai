import { Cpu, Globe, Layers, Users, Truck, Building2, Network } from "lucide-react";

const highlights = [
  {
    icon: Layers,
    title: "Six Commercial Vertical AI Products",
    description: "Shift, Shiftmatics, CloudRep, Housestack, Housefax, and Weather Telematics — production-grade software across logistics, fleet, voice/chat and real estate",
  },
  {
    icon: Network,
    title: "Shift × Arcasia Holdings JV",
    description: "51/49 joint venture (Apr 2026) embeds Shift's AI logistics platform inside an existing South Asian operating ecosystem led by Aravinda De Silva",
  },
  {
    icon: Truck,
    title: "Port-to-Home Logistics OS",
    description: "Shift unifies first-mile, middle-mile and last-mile under one AI execution layer — allocation, routing, dispatch, settlement and visibility",
  },
  {
    icon: Cpu,
    title: "CloudRep Voice & Chat Automation",
    description: "AI-based agents for voice, SMS and chat — built for fleet dispatch, customer service and structured operational workflows",
  },
  {
    icon: Building2,
    title: "Real Estate Intelligence",
    description: "Housestack and Housefax deliver workflow tooling and property history/risk intelligence for agents, brokerages and operators",
  },
  {
    icon: Globe,
    title: "Dual Listed CSE + Frankfurt",
    description: "CSE: PAI listed Dec 22, 2025 · FWB: 7IT — opens both North American retail and European institutional channels",
  },
  {
    icon: Users,
    title: "IR by Omnia Capital Partners",
    description: "Capital markets storytelling and investor outreach managed by a leading small-cap IR firm",
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
          Key items the Company has highlighted in its public disclosure
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
