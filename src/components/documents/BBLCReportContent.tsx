const BBLCReportContent = () => {
  return (
    <div className="document-content">
      {/* Cover */}
      <div className="text-center pb-8 border-b border-border">
        <p className="text-sm text-primary font-mono mb-2">OMNIA CAPITAL PARTNERS LTD.</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">Predictiv AI Inc.</h1>
        <p className="text-lg text-muted-foreground mb-4">Institutional Deep Dive | May 2026</p>
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded">
          <span className="font-mono text-primary font-bold">CSE: PAI</span>
          <span className="text-muted-foreground">|</span>
          <span className="font-mono text-primary font-bold">FWB: 7IT</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-primary font-semibold">BREAKOUT</span>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="document-section">
        <h2 className="document-heading">Executive Summary</h2>
        <p className="document-text">
          Predictiv AI Inc. (CSE: PAI / FWB: 7IT) is a Canadian vertical AI company building production-grade
          software across <strong>fleet telematics, voice/chat automation, and real estate intelligence</strong>.
          The Company operates six commercial product lines — Shift, Shiftmatics, CloudRep, Housestack, Housefax,
          and Weather Telematics — under one corporate umbrella, listed on the CSE December 22, 2025 and dual-listed
          on the Frankfurt Stock Exchange (7IT). IR is provided by Omnia Capital Partners.
        </p>
        <p className="document-text">
          The Company trades at a current price of C$0.13 with a market cap of ~C$15.98M (118.3M shares O/S).
          Key drivers under analysis include the Shift/Arcasia Holdings joint venture unlocking near-term
          deployment across South Asian and Middle Eastern logistics corridors, +651% YoY revenue growth off
          a small base, and a tight float.
          <em className="text-muted-foreground"> Research and analysis only. Not investment advice. Subject to market risk and material change.</em>
        </p>
      </section>

      {/* Investment Thesis */}
      <section className="document-section">
        <h2 className="document-heading">Investment Thesis</h2>
        <ul className="document-list">
          <li><strong>Shift × Arcasia Holdings JV (Apr 2026):</strong> 51/49 JV embeds Shift's AI-powered first/middle/last-mile platform inside an existing South Asian logistics ecosystem led by Aravinda De Silva — a direct path to deployment, not a sales pipeline.</li>
          <li><strong>Six Vertical AI Products:</strong> Shift (logistics), Shiftmatics (fleet), CloudRep (voice/chat agents), Housestack &amp; Housefax (real estate intelligence), Weather Telematics — each addressable independently.</li>
          <li><strong>Revenue Inflection:</strong> +651% revenue YoY (small base, ~US$88K TTM) signals product-market validation as commercial deployments begin.</li>
          <li><strong>Dual-Listed Liquidity:</strong> CSE (PAI) + Frankfurt (7IT, WKN forthcoming) opens both North American retail and European institutional channels.</li>
          <li><strong>Tight Float:</strong> 118.3M shares O/S with thin ADV — moves on volume; historical pattern shows sharp rerates on news.</li>
          <li><strong>Post-Listing Reset:</strong> Price has reset 94% from 52-week high, removing seller exhaustion risk and creating an asymmetric entry.</li>
        </ul>
      </section>

      {/* Market Opportunity */}
      <section className="document-section">
        <h2 className="document-heading">Market Opportunity</h2>
        <h3 className="document-subheading">Vertical AI: The Next Software Cycle</h3>
        <p className="document-text">
          Horizontal foundation models commoditize quickly. Durable margin lives in vertical AI — purpose-built
          software that owns a workflow end-to-end. Predictiv AI is squarely positioned in three of the highest-value
          verticals: logistics ($10T+ global), fleet operations, and real estate intelligence.
        </p>
        <h3 className="document-subheading">Shift: Port-to-Home Logistics OS</h3>
        <p className="document-text">
          Global logistics remains fragmented across first-mile (port/supplier), middle-mile (multi-leg transport,
          the highest-value segment), and last-mile (e-commerce delivery). Shift unifies allocation, capacity
          planning, transport management, route optimization, dispatch, proof-of-delivery and settlement under
          one AI execution layer — with real-time visibility and predictive performance across the lifecycle.
        </p>
        <h3 className="document-subheading">CloudRep: Voice + Chat Automation</h3>
        <p className="document-text">
          AI agents for voice, SMS, and chat targeting fleet dispatch, customer service, and structured operational
          workflows where labor scarcity and wage inflation make automation an immediate ROI play.
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
                <th>Target Price (CAD)</th>
                <th>Upside</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Bear</td>
                <td>JV slips to definitive agreements; cash raise dilutes</td>
                <td>C$0.08</td>
                <td className="text-muted-foreground">-38%</td>
              </tr>
              <tr>
                <td className="font-semibold">Base</td>
                <td>JV closes; Shift deploys in 2-3 Arcasia network operators</td>
                <td>C$0.40</td>
                <td className="text-primary">+208%</td>
              </tr>
              <tr>
                <td className="font-semibold">Bull</td>
                <td>Multi-product traction + EU institutional flow on 7IT</td>
                <td>C$1.20</td>
                <td className="text-primary">+823%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="document-text text-muted-foreground italic text-xs mt-2">
          Forward-looking. Targets are scenarios, not guarantees. Subject to material change.
        </p>
      </section>

      {/* Risks */}
      <section className="document-section">
        <h2 className="document-heading">Key Risks</h2>
        <ul className="document-list">
          <li><strong>Tiny Revenue Base:</strong> ~US$88K TTM vs. ~US$9M net loss — early-stage commercialization risk.</li>
          <li><strong>Capital Raise Pressure:</strong> Dilution likely as the Company funds JV ramp and product scaling.</li>
          <li><strong>JV Execution:</strong> Shift × Arcasia is currently a non-binding term sheet; definitive agreements and Sri Lanka entity formation pending.</li>
          <li><strong>Liquidity:</strong> ~153K ADV — thin float cuts both ways.</li>
          <li><strong>Competition:</strong> Logistics SaaS is contested by well-capitalized incumbents.</li>
        </ul>
      </section>

      {/* Summary */}
      <section className="document-section">
        <h2 className="document-heading">Summary</h2>
        <p className="document-text">
          Predictiv AI (CSE: PAI · FWB: 7IT) operates six commercial vertical AI products, a 51% JV embedded
          inside a real operating logistics network, +651% revenue growth, and a dual-listed structure
          (CSE + Frankfurt). This research is provided for informational purposes only.
        </p>
        <p className="document-text text-muted-foreground italic">
          This report contains no price target, rating, or recommendation. Forward-looking statements are
          subject to material change and are not a guarantee of future performance. Not investment advice.
        </p>
      </section>
    </div>
  );
};

export default BBLCReportContent;
