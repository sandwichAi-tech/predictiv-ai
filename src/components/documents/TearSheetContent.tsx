const TearSheetContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <section className="document-section text-center pb-6 sm:pb-8 border-b border-border">
        <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mb-2">One-Page Summary</div>
        <h1 className="text-xl sm:text-3xl font-bold text-primary mb-1">BioVaxys Technology Corp.</h1>
        <p className="text-xs sm:text-base text-muted-foreground">OTCQB: BVAXF · CSE: BIOV · Frankfurt: 5LB</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
          <span className="bg-accent text-accent-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base">
            SPECULATIVE BUY
          </span>
          <span className="text-base sm:text-lg font-semibold text-primary">
            Target: $0.48 – $0.60
          </span>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="document-section">
        <h2 className="document-heading">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">$0.16</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Current Price</div>
          </div>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">$6.4M</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Market Cap</div>
          </div>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">44.2M</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Shares Out</div>
          </div>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-accent">200-275%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Upside</div>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="document-section">
        <h2 className="document-heading">Investment Thesis</h2>
        <p className="document-text">
          BioVaxys acquired IMV Inc.'s DPX™ immunotherapy platform for ~$1M—a 99% discount to IMV's prior $500M+ market cap. The lead asset MVP-S has Phase IIB clinical data showing 21% ORR and 63% DCR in platinum-resistant ovarian cancer. Dual-platform strategy with DPX™ and HapTenix© provides multiple paths to value creation.
        </p>
      </section>

      {/* Clinical Pipeline */}
      <section className="document-section">
        <h2 className="document-heading">Clinical Pipeline</h2>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Indication</th>
                <th>Stage</th>
                <th>Catalyst</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MVP-S</strong></td>
                <td>Ovarian Cancer</td>
                <td>Phase IIB</td>
                <td>Data 2026</td>
              </tr>
              <tr>
                <td><strong>MVP-S</strong></td>
                <td>DLBCL</td>
                <td>Phase I/II</td>
                <td>Expansion</td>
              </tr>
              <tr>
                <td><strong>BVX-0918</strong></td>
                <td>Solid Tumors</td>
                <td>Phase I Ready</td>
                <td>IND 2026</td>
              </tr>
              <tr>
                <td><strong>DPX-COVID</strong></td>
                <td>COVID-19</td>
                <td>Phase I Done</td>
                <td>Partnership</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* MVP-S Clinical Data */}
      <section className="document-section">
        <h2 className="document-heading">MVP-S Phase IIB Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="border border-border p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-accent">21%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">ORR</div>
          </div>
          <div className="border border-border p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-accent">63%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">DCR</div>
          </div>
          <div className="border border-border p-3 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">4.2 mo</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Median PFS</div>
          </div>
          <div className="border border-border p-3 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-2xl font-bold text-primary">Favorable</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Safety</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          *In heavily pretreated platinum-resistant ovarian cancer patients
        </p>
      </section>

      {/* Partnerships */}
      <section className="document-section">
        <h2 className="document-heading">Strategic Partnerships</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Merck KGaA</h3>
            <p className="text-sm text-muted-foreground">Research collaboration for DPX™ + checkpoint inhibitor combinations</p>
          </div>
          <div className="border border-border p-4 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Zoetis</h3>
            <p className="text-sm text-muted-foreground">DPX™ platform licensed for veterinary applications</p>
          </div>
        </div>
      </section>

      {/* Valuation */}
      <section className="document-section">
        <h2 className="document-heading">Valuation Scenarios</h2>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Assumptions</th>
                <th>Value</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Base</strong></td>
                <td>MVP-S advances; single deal</td>
                <td>$25M</td>
                <td>$0.48</td>
              </tr>
              <tr>
                <td><strong>Bull</strong></td>
                <td>Positive data; multi-deals</td>
                <td>$50M</td>
                <td>$0.96</td>
              </tr>
              <tr>
                <td><strong>Upside</strong></td>
                <td>Major partnership/M&A</td>
                <td>$100M+</td>
                <td>$1.92+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Near-Term Catalysts */}
      <section className="document-section">
        <h2 className="document-heading">Near-Term Catalysts</h2>
        <ul className="document-list">
          <li><strong>Q1-Q2 2026:</strong> MVP-S Phase IIB data update</li>
          <li><strong>H1 2026:</strong> BVX-0918 Phase I initiation (Spain)</li>
          <li><strong>2026:</strong> Partnership/licensing announcements</li>
          <li><strong>Ongoing:</strong> Additional patent grants</li>
        </ul>
      </section>

      {/* Key Risks */}
      <section className="document-section">
        <h2 className="document-heading">Key Risks</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-destructive/10 p-3 rounded-lg">
            <strong className="text-destructive">Clinical:</strong> ~80% of drugs fail in trials
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <strong className="text-destructive">Financial:</strong> Will need additional capital
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <strong className="text-destructive">Liquidity:</strong> Limited trading volume
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="document-section border-t border-border pt-6 mt-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-semibold">Omnia Capital Partners · Institutional Research · December 2026</p>
          <p className="mt-2">This summary is for informational purposes only. See full report for complete analysis and disclosures.</p>
        </div>
      </section>
    </div>
  );
};

export default TearSheetContent;
