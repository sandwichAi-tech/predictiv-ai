const BBLCReportContent = () => {
  return (
    <div className="document-content">
      {/* Cover */}
      <div className="text-center pb-8 border-b border-border">
        <p className="text-sm text-primary font-mono mb-2">OMNIA CAPITAL PARTNERS LTD.</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">Blockchain Loyalty Corp.</h1>
        <p className="text-lg text-muted-foreground mb-4">Institutional Deep Dive | May 2026</p>
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded">
          <span className="font-mono text-primary font-bold">OTC: BBLC</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-primary font-semibold">SPECULATIVE BUY</span>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="document-section">
        <h2 className="document-heading">Executive Summary</h2>
        <p className="document-text">
          Blockchain Loyalty Corp. (OTC: BBLC) is a micro-cap technology company developing two transformative platforms: <strong>InfernoGrid</strong>, a GPU marketplace connecting AI developers with idle consumer GPUs, and <strong>Koilink</strong>, a fintech OTC trading platform.
        </p>
        <p className="document-text">
          We initiate coverage with a <strong className="text-primary">SPECULATIVE BUY</strong> rating with a Base Case target of <strong>$0.20</strong> and a Bull Case target of <strong>$0.50</strong> (Bear Case $0.03), against a current price of $0.09 and ~$9.95M market cap. The thesis rests on InfernoGrid's potential to capture a meaningful share of the rapidly expanding AI compute market. <em className="text-muted-foreground">Forward-looking estimate. Not investment advice. Subject to market risk and material change.</em>
        </p>
      </section>

      {/* Investment Thesis */}
      <section className="document-section">
        <h2 className="document-heading">Investment Thesis</h2>
        <ul className="document-list">
          <li><strong>InfernoGrid GPU Marketplace:</strong> Targeting a $21B+ market by 2030, monetizing idle consumer GPUs for AI compute workloads</li>
          <li><strong>Massive Untapped Supply:</strong> 250M+ GPUs shipped annually, creating enormous underutilized compute capacity</li>
          <li><strong>Koilink Fintech:</strong> $340B global fintech market opportunity with near-term revenue potential</li>
          <li><strong>70% Insider Ownership:</strong> Strong management alignment with shareholders</li>
          <li><strong>Shell Risk Removed:</strong> OTC Markets validated company status (March 2025)</li>
          <li><strong>Asset-Light Model:</strong> Platform-based recurring revenue with high margins</li>
        </ul>
      </section>

      {/* Market Opportunity */}
      <section className="document-section">
        <h2 className="document-heading">Market Opportunity</h2>
        <h3 className="document-subheading">The AI Compute Crunch</h3>
        <p className="document-text">
          The AI revolution has created unprecedented demand for GPU compute. Major cloud providers are struggling to meet demand, with waitlists stretching months. This supply-demand imbalance creates an opportunity for distributed compute solutions.
        </p>
        <h3 className="document-subheading">InfernoGrid's Approach</h3>
        <p className="document-text">
          InfernoGrid differentiates through a consumer-friendly approach: simple host app installation, intelligent job pausing when hosts use their own GPUs, and real cash payouts (not crypto tokens). This positions BBLC to capture the vast pool of idle consumer GPUs.
        </p>
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
                <th>Target Price</th>
                <th>Upside</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Bear</td>
                <td>Platform delays, limited adoption</td>
                <td>$0.03</td>
                <td className="text-muted-foreground">-67%</td>
              </tr>
              <tr>
                <td className="font-semibold">Base</td>
                <td>Successful MVP, moderate traction</td>
                <td>$0.20</td>
                <td className="text-primary">+122%</td>
              </tr>
              <tr>
                <td className="font-semibold">Bull</td>
                <td>Strong adoption, partnership wins</td>
                <td>$0.50</td>
                <td className="text-primary">+456%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Risks */}
      <section className="document-section">
        <h2 className="document-heading">Key Risks</h2>
        <ul className="document-list">
          <li><strong>Execution Risk:</strong> Pre-revenue platforms may fail to achieve product-market fit</li>
          <li><strong>Competition:</strong> Well-capitalized cloud providers and GPU marketplaces</li>
          <li><strong>Capital Requirements:</strong> Additional financing likely needed; dilution risk</li>
          <li><strong>Liquidity Risk:</strong> OTC Pink with limited trading volume</li>
          <li><strong>Technology Risk:</strong> Rapid changes in AI/GPU computing</li>
        </ul>
      </section>

      {/* Recommendation */}
      <section className="document-section">
        <h2 className="document-heading">Recommendation</h2>
        <p className="document-text">
          We rate BBLC a <strong className="text-primary">SPECULATIVE BUY</strong> with a Base Case 6-month target of $0.20 and a Bull Case of $0.50. The combination of InfernoGrid's large addressable market, Koilink's near-term revenue potential, gold mining optionality via Blue Crown, and 70% insider ownership creates an attractive risk/reward for investors comfortable with micro-cap volatility.
        </p>
        <p className="document-text text-muted-foreground italic">
          This rating is suitable only for risk-tolerant investors who can afford the complete loss of their investment.
        </p>
      </section>
    </div>
  );
};

export default BBLCReportContent;
