const BBLCTearSheetContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-primary font-mono mb-1">OMNIA CAPITAL PARTNERS LTD.</p>
          <h1 className="text-2xl font-bold text-foreground">Blockchain Loyalty Corp.</h1>
          <p className="text-muted-foreground">OTC: BBLC | AI Compute & Fintech</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-primary px-4 py-2 rounded">
            <span className="font-bold text-primary-foreground">SPECULATIVE BUY</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Target: $0.20 – $0.50</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-mono">$0.09</div>
          <div className="text-xs text-muted-foreground">Current Price</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground font-mono">~$9.95M</div>
          <div className="text-xs text-muted-foreground">Market Cap</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground font-mono">120.6M</div>
          <div className="text-xs text-muted-foreground">Shares Out</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-mono">$0.20–$0.50</div>
          <div className="text-xs text-muted-foreground">Base–Bull Target</div>
        </div>
      </div>

      {/* Investment Thesis */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">Investment Thesis</h2>
        <p className="text-sm text-muted-foreground">
          BBLC is developing InfernoGrid, a GPU marketplace for AI compute ($21B+ TAM by 2030), and Koilink, a fintech OTC trading platform. Strong insider ownership (70%) aligns management with shareholders. Shell risk removed March 2025.
        </p>
      </section>

      {/* Two-Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 py-6 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Key Catalysts</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Q1 2026: InfernoGrid MVP completion</li>
            <li>• Q2 2026: Koilink OTC launch</li>
            <li>• H2 2026: Marketplace public launch</li>
            <li>• 2027+: Revenue generation</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Key Risks</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Execution risk (pre-revenue)</li>
            <li>• Competition from cloud giants</li>
            <li>• Dilution from future financing</li>
            <li>• OTC liquidity constraints</li>
          </ul>
        </div>
      </div>

      {/* Share Structure */}
      <section className="py-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Share Structure</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-primary font-mono">70%</div>
            <div className="text-xs text-muted-foreground">Insider Ownership</div>
          </div>
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-foreground font-mono">~30%</div>
            <div className="text-xs text-muted-foreground">Public Float</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BBLCTearSheetContent;
