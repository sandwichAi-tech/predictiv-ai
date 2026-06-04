import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const competitors = [
  {
    company: "Predictiv AI (Shift + CloudRep)",
    differentiator: "Vertical AI · multi-product",
    target: "Logistics, fleet, voice/chat",
    delivery: "Embedded JV deployments",
    coverage: "End-to-end (1st/Mid/Last-Mile + Ops)",
    highlighted: true,
  },
  {
    company: "Project44",
    differentiator: "Visibility platform",
    target: "Enterprise shippers",
    delivery: "SaaS subscription",
    coverage: "Visibility-only",
    highlighted: false,
  },
  {
    company: "FourKites",
    differentiator: "Real-time tracking",
    target: "Large shippers",
    delivery: "SaaS subscription",
    coverage: "Visibility-only",
    highlighted: false,
  },
  {
    company: "Samsara",
    differentiator: "Connected fleet ops",
    target: "Mid/large fleets",
    delivery: "Hardware + SaaS",
    coverage: "Fleet telematics",
    highlighted: false,
  },
  {
    company: "Geotab",
    differentiator: "Telematics platform",
    target: "Commercial fleets",
    delivery: "Hardware + SaaS",
    coverage: "Fleet telematics",
    highlighted: false,
  },
  {
    company: "Five9 / NICE CXone",
    differentiator: "Contact-center AI",
    target: "Enterprise CX",
    delivery: "SaaS subscription",
    coverage: "Voice/chat only",
    highlighted: false,
  },
];

const CompetitiveLandscape = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Competitive Landscape
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vertical AI in logistics, fleet telematics and voice/chat automation
          </p>
        </div>

        <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-primary-foreground font-semibold">Company</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Key Differentiator</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden sm:table-cell">Target Market</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden md:table-cell">Delivery Model</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden lg:table-cell">Coverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((comp) => (
                <TableRow
                  key={comp.company}
                  className={
                    comp.highlighted
                      ? "bg-primary/10 border-l-4 border-l-primary font-medium"
                      : ""
                  }
                >
                  <TableCell>
                    <span className={comp.highlighted ? "text-primary font-semibold" : "text-foreground"}>
                      {comp.company}
                    </span>
                  </TableCell>
                  <TableCell className={comp.highlighted ? "text-primary" : ""}>
                    {comp.differentiator}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{comp.target}</TableCell>
                  <TableCell className={`hidden md:table-cell ${comp.highlighted ? "text-primary font-semibold" : ""}`}>
                    {comp.delivery}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{comp.coverage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Predictiv AI Key Differentiators</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Multi-Product Vertical AI</strong> — Six commercial products under one umbrella</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Embedded JV Deployment</strong> — Shift × Arcasia 51/49 inside a real operating network</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">End-to-End Logistics OS</strong> — First, middle, and last-mile in a single AI execution layer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Dual-Listed Liquidity</strong> — CSE (PAI) + Frankfurt (7IT) with IR by Omnia Capital Partners</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitiveLandscape;
