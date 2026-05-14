const BBLCTearSheetContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-primary font-mono mb-1">OMNIA CAPITAL PARTNERS LTD.</p>
          <h1 className="text-2xl font-bold text-foreground">Predictiv AI Inc.</h1>
          <p className="text-muted-foreground">CSE: PAI · FWB: 7IT | Vertical AI · Fleet · Voice/Chat · Real Estate</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-primary px-4 py-2 rounded">
            <span className="font-bold text-primary-foreground">INSTITUTIONAL COVERAGE</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Research & Analysis Only</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-border">
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-mono">C$0.13</div>
          <div className="text-xs text-muted-foreground">Current Price</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground font-mono">~C$15.98M</div>
          <div className="text-xs text-muted-foreground">Market Cap</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground font-mono">118.3M</div>
          <div className="text-xs text-muted-foreground">Shares Out</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-primary font-mono">+651%</div>
          <div className="text-xs text-muted-foreground">Revenue YoY</div>
        </div>
      </div>

      {/* Investment Thesis */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">Investment Thesis</h2>
        <p className="text-sm text-muted-foreground">
          Predictiv AI is a vertical AI platform with six commercial products spanning logistics (Shift),
          fleet telematics (Shiftmatics, Weather Telematics), voice/chat automation (CloudRep) and real estate
          intelligence (Housestack, Housefax). The April 2026 Shift × Arcasia Holdings 51/49 JV embeds the
          AI logistics platform directly inside a South Asian operating ecosystem led by Aravinda De Silva —
          a deployment pathway, not a sales pipeline. Dual-listed CSE + Frankfurt with IR by AGORACOM.
        </p>
      </section>

      {/* Two-Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 py-6 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Key Catalysts</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Q2 2026: Shift × Arcasia definitive agreements + Sri Lanka entity</li>
            <li>• H2 2026: Initial JV deployments across Arcasia logistics network</li>
            <li>• 2026: Frankfurt (7IT) institutional outreach via AGORACOM</li>
            <li>• Ongoing: CloudRep voice/chat customer wins</li>
            <li>• 2027: Multi-product revenue scaling</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Key Risks</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Tiny revenue base (~US$88K TTM)</li>
            <li>• ~US$9M net loss → likely capital raise / dilution</li>
            <li>• JV currently non-binding term sheet</li>
            <li>• Thin float (~153K ADV) cuts both ways</li>
            <li>• Logistics SaaS competition</li>
          </ul>
        </div>
      </div>

      {/* Share Structure */}
      <section className="py-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Share Structure</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-primary font-mono">118.3M</div>
            <div className="text-xs text-muted-foreground">Shares Outstanding</div>
          </div>
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-foreground font-mono">~C$15.98M</div>
            <div className="text-xs text-muted-foreground">Market Cap</div>
          </div>
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-foreground font-mono">CSE · FWB</div>
            <div className="text-xs text-muted-foreground">Dual Listed</div>
          </div>
          <div className="bg-card border border-border rounded p-3">
            <div className="text-lg font-bold text-primary font-mono">Dec 2025</div>
            <div className="text-xs text-muted-foreground">CSE Listing</div>
          </div>
        </div>
      </section>

      <p className="text-[10px] text-muted-foreground italic text-center">
        Forward-looking estimates. Not investment advice. Subject to market risk and material change.
      </p>
    </div>
  );
};

export default BBLCTearSheetContent;
