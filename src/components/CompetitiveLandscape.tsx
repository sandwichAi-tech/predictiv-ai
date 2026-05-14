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
    company: "BBLC (InfernoGrid)",
    differentiator: "Consumer host app",
    target: "Idle consumer GPUs",
    payouts: "Real cash ($)",
    enterprise: "Yes",
    highlighted: true,
  },
  {
    company: "Vast.ai",
    differentiator: "Low-cost rentals",
    target: "Pro GPU owners",
    payouts: "Crypto only",
    enterprise: "Limited",
    highlighted: false,
  },
  {
    company: "RunPod",
    differentiator: "Dev-focused",
    target: "ML developers",
    payouts: "Crypto",
    enterprise: "Yes",
    highlighted: false,
  },
  {
    company: "TensorDock",
    differentiator: "Budget cloud",
    target: "Small teams",
    payouts: "N/A",
    enterprise: "Limited",
    highlighted: false,
  },
  {
    company: "CoreWeave",
    differentiator: "Enterprise scale",
    target: "Large enterprises",
    payouts: "N/A",
    enterprise: "Yes",
    highlighted: false,
  },
  {
    company: "AWS/GCP/Azure",
    differentiator: "Full ecosystem",
    target: "All segments",
    payouts: "N/A",
    enterprise: "Yes",
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
            GPU marketplace & distributed compute sector comparison
          </p>
        </div>

        <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-primary-foreground font-semibold">Platform</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Key Differentiator</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden sm:table-cell">Target Market</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden md:table-cell">Host Payouts</TableHead>
                <TableHead className="text-primary-foreground font-semibold hidden lg:table-cell">Enterprise</TableHead>
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
                    {comp.payouts}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{comp.enterprise}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">InfernoGrid Key Differentiators</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Consumer-Friendly Host App</strong> — Simple 1-click setup for non-technical users</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Intelligent Job Pausing</strong> — Auto-pause when host uses their GPU</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Real Cash Payouts</strong> — USD payments, not crypto tokens</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground"><strong className="text-foreground">Enterprise Dashboard</strong> — Full management tools for business clients</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitiveLandscape;
