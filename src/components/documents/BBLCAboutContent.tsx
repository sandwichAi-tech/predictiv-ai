const BBLCAboutContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-primary font-mono mb-1">COMPANY OVERVIEW</p>
          <h1 className="text-2xl font-bold text-foreground">Blockchain Loyalty Corp.</h1>
          <p className="text-muted-foreground">OTC: BBLC | Digital Infrastructure & Fintech</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-primary/10 border border-primary px-4 py-2 rounded">
            <span className="font-bold text-primary">Est. 2022</span>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">Mission</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Blockchain Loyalty Corp. is building next-generation digital infrastructure at the intersection of AI compute and fintech. Our mission is to democratize access to GPU computing power while creating innovative financial technology solutions for the modern economy.
        </p>
      </section>

      {/* Core Business Segments */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Core Business Segments</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">IG</span>
              </div>
              <h3 className="font-bold text-foreground">InfernoGrid</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized GPU marketplace connecting AI developers with idle consumer GPUs. Targeting the $21B+ GPU-as-a-Service market by 2030.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">KL</span>
              </div>
              <h3 className="font-bold text-foreground">Koilink Technologies</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              19.9% subsidiary — geo-social fintech platform connecting brokers, accredited investors, and growth-stage issuers. OTC listing pending.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FU</span>
              </div>
              <h3 className="font-bold text-foreground">For Us TV Productions</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Subscription streaming for BIPOC filmmakers — Roku, Apple TV, Amazon TV, mobile. 300M+ potential viewers.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BC</span>
              </div>
              <h3 className="font-bold text-foreground">Blue Crown Group</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Mining lease in California's Eastern Pocket Belt with $55M+ historical gold production at $20/oz gold.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Leadership Team</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-muted-foreground">JD</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Joel DeBellefeuille</h3>
              <p className="text-xs text-primary mb-1">Chief Executive Officer & Chief Strategist</p>
              <p className="text-sm text-muted-foreground">
                Driving InfernoGrid and Koilink development across the BBLC group.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-muted-foreground">SC</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Svetlana Chernienko</h3>
              <p className="text-xs text-primary mb-1">Operations</p>
              <p className="text-sm text-muted-foreground">
                Overseeing day-to-day operations and execution.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-muted-foreground">ZL</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Zbigniew Lambo</h3>
              <p className="text-xs text-primary mb-1">Independent Director</p>
              <p className="text-sm text-muted-foreground">
                Board oversight and corporate governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Company Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-primary font-mono">70%</div>
            <div className="text-xs text-muted-foreground">Insider Ownership</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-primary font-mono">~$9.95M</div>
            <div className="text-xs text-muted-foreground">Market Cap</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-foreground font-mono">$21B+</div>
            <div className="text-xs text-muted-foreground">TAM by 2030</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-foreground font-mono">4</div>
            <div className="text-xs text-muted-foreground">Divisions</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-primary font-mono">2025</div>
            <div className="text-xs text-muted-foreground">Shell Risk Removed</div>
          </div>
        </div>
      </section>

      {/* Corporate Information */}
      <section className="py-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Corporate Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Ticker:</span> OTC: BBLC</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Headquarters:</span> Sheridan, WY, USA</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Founded:</span> 2022</p>
          </div>
          <div>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Industry:</span> Technology / Fintech</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Sector:</span> Digital Infrastructure</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Exchange:</span> OTC Markets</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BBLCAboutContent;
