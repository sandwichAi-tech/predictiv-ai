const ResearchReportContent = () => {
  return (
    <div className="document-content">
      {/* Cover Page */}
      <section className="document-section text-center pb-12 border-b border-border">
        <div className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Institutional Equity Research</div>
        <h1 className="text-4xl font-bold text-primary mb-2">BioVaxys Technology Corp.</h1>
        <p className="text-lg text-muted-foreground mb-6">OTCQB: BVAXF · CSE: BIOV · Frankfurt: 5LB</p>
        <div className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold text-xl mb-4">
          SPECULATIVE BUY
        </div>
        <p className="text-2xl font-semibold text-primary">12-Month Price Target: $0.48 – $0.60</p>
        <p className="text-muted-foreground mt-2">Current Price: $0.16 · Potential Upside: 200% – 275%</p>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Prepared by Omnia Capital Partners</p>
          <p>December 2026</p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="document-section">
        <h2 className="document-heading">Executive Summary</h2>
        <p className="document-text">
          BioVaxys Technology Corp. is a clinical-stage biotechnology company developing novel immunotherapy platforms for oncology and infectious disease indications. The company's investment thesis centers on the transformational acquisition of IMV Inc.'s DPX™ lipid nanoparticle platform—acquired for approximately $1 million in cash plus assumption of certain liabilities, representing a ~99% discount to IMV's prior market capitalization of $500+ million.
        </p>
        <p className="document-text">
          The DPX™ platform has demonstrated compelling clinical proof-of-concept, with the lead asset MVP-S (survivin-targeting cancer vaccine) showing a 21% objective response rate and 63% disease control rate in heavily pretreated platinum-resistant ovarian cancer patients. BioVaxys is now positioned to advance this Phase IIB-ready asset while simultaneously developing its proprietary HapTenix© platform for personalized cancer vaccines.
        </p>
        <p className="document-text">
          At a current market capitalization of approximately $6.4 million, we believe BioVaxys offers substantial upside potential for risk-tolerant investors. Our 12-month price target of $0.48–$0.60 reflects the deep discount to the acquired DPX™ platform's historical valuation, near-term clinical catalysts, and optionality from the dual-platform strategy.
        </p>
      </section>

      {/* Company Overview */}
      <section className="document-section">
        <h2 className="document-heading">Company Overview</h2>
        
        <h3 className="document-subheading">Corporate Background</h3>
        <p className="document-text">
          BioVaxys Technology Corp., headquartered in Vancouver, British Columbia, is a publicly traded clinical-stage biotechnology company focused on developing next-generation immunotherapies. The company trades on the OTCQB Venture Market (BVAXF), Canadian Securities Exchange (BIOV), and Frankfurt Stock Exchange (5LB).
        </p>

        <h3 className="document-subheading">Management Team</h3>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Background</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>James Passin</td>
                <td>CEO & Chairman</td>
                <td>Former hedge fund manager; biotech investor</td>
              </tr>
              <tr>
                <td>Kenneth Kovan</td>
                <td>President & CFO</td>
                <td>25+ years pharma/biotech finance experience</td>
              </tr>
              <tr>
                <td>David Berd, M.D.</td>
                <td>Chief Medical Officer</td>
                <td>Pioneer in autologous cancer vaccines; Thomas Jefferson University</td>
              </tr>
              <tr>
                <td>Joanne Sanchez, Ph.D.</td>
                <td>Chief Scientific Officer</td>
                <td>Former IMV Inc. VP; DPX™ platform inventor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="document-subheading">Capital Structure</h3>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Shares Outstanding</td><td>44.2 million</td></tr>
              <tr><td>Fully Diluted Shares</td><td>~52 million</td></tr>
              <tr><td>Market Capitalization</td><td>~$6.4 million</td></tr>
              <tr><td>Cash Position (Est.)</td><td>~$2.5 million</td></tr>
              <tr><td>Debt</td><td>Minimal</td></tr>
              <tr><td>52-Week Range</td><td>$0.08 – $0.38</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Technology Platforms */}
      <section className="document-section">
        <h2 className="document-heading">Technology Platforms</h2>
        
        <h3 className="document-subheading">DPX™ Lipid Nanoparticle Platform</h3>
        <p className="document-text">
          The DPX™ (Depot + Antigen) platform is a proprietary lipid-based delivery system designed to enhance immune responses to peptide antigens. Unlike traditional vaccine adjuvants that create a simple depot effect, DPX™ utilizes a unique mechanism:
        </p>
        <ul className="document-list">
          <li><strong>Sustained Antigen Presentation:</strong> Creates a persistent local depot that releases antigens over extended periods</li>
          <li><strong>Enhanced Dendritic Cell Activation:</strong> Proprietary lipid formulation optimizes dendritic cell uptake and activation</li>
          <li><strong>Reduced Systemic Toxicity:</strong> Localized immune activation minimizes off-target effects</li>
          <li><strong>Flexible Payload Capacity:</strong> Platform can deliver multiple peptide antigens simultaneously</li>
        </ul>
        <p className="document-text">
          The DPX™ platform has been validated through multiple clinical trials and has received regulatory acceptance for Phase I/II studies in the United States, Canada, and European Union.
        </p>

        <h3 className="document-subheading">HapTenix© Personalized Vaccine Platform</h3>
        <p className="document-text">
          HapTenix© represents BioVaxys' proprietary approach to personalized cancer immunotherapy. The platform utilizes haptenization technology to enhance the immunogenicity of autologous tumor cells:
        </p>
        <ul className="document-list">
          <li><strong>Patient-Specific:</strong> Each vaccine is manufactured from the patient's own tumor tissue</li>
          <li><strong>Hapten Modification:</strong> Tumor antigens are chemically modified to enhance immune recognition</li>
          <li><strong>Broad Antigen Coverage:</strong> Unlike single-antigen approaches, captures full tumor antigenic profile</li>
          <li><strong>Established Safety Profile:</strong> Based on decades of research by Dr. David Berd</li>
        </ul>
      </section>

      {/* Clinical Pipeline */}
      <section className="document-section">
        <h2 className="document-heading">Clinical Pipeline</h2>
        
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Platform</th>
                <th>Indication</th>
                <th>Stage</th>
                <th>Next Milestone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MVP-S</strong></td>
                <td>DPX™</td>
                <td>Ovarian Cancer</td>
                <td>Phase IIB</td>
                <td>Data Readout 2026</td>
              </tr>
              <tr>
                <td><strong>MVP-S</strong></td>
                <td>DPX™</td>
                <td>DLBCL</td>
                <td>Phase I/II</td>
                <td>Expansion Cohort</td>
              </tr>
              <tr>
                <td><strong>BVX-0918</strong></td>
                <td>HapTenix©</td>
                <td>Solid Tumors</td>
                <td>Phase I Ready</td>
                <td>IND Filing 2026</td>
              </tr>
              <tr>
                <td><strong>DPX-COVID</strong></td>
                <td>DPX™</td>
                <td>COVID-19</td>
                <td>Phase I Complete</td>
                <td>Partnership Sought</td>
              </tr>
              <tr>
                <td><strong>DPX-RSV</strong></td>
                <td>DPX™</td>
                <td>RSV</td>
                <td>Preclinical</td>
                <td>IND-Enabling Studies</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="document-subheading">MVP-S: Lead Clinical Asset</h3>
        <p className="document-text">
          MVP-S (Maveropepimut-S) is a survivin-targeting cancer vaccine utilizing the DPX™ platform. Survivin is an ideal tumor antigen due to its:
        </p>
        <ul className="document-list">
          <li>Overexpression in virtually all human cancers</li>
          <li>Critical role in tumor cell survival and proliferation</li>
          <li>Minimal expression in normal adult tissues</li>
          <li>Association with poor prognosis and treatment resistance</li>
        </ul>

        <h3 className="document-subheading">Phase IIB Clinical Data (Ovarian Cancer)</h3>
        <p className="document-text">
          The pivotal Phase IIB study in platinum-resistant ovarian cancer (PRROC) demonstrated:
        </p>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Result</th>
                <th>Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Objective Response Rate (ORR)</td>
                <td>21%</td>
                <td>vs. ~10% historical for single-agent chemo</td>
              </tr>
              <tr>
                <td>Disease Control Rate (DCR)</td>
                <td>63%</td>
                <td>Clinically meaningful in this population</td>
              </tr>
              <tr>
                <td>Median PFS</td>
                <td>4.2 months</td>
                <td>Favorable vs. ~3.4 mo historical</td>
              </tr>
              <tr>
                <td>Safety Profile</td>
                <td>Well-tolerated</td>
                <td>Primarily injection site reactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Strategic Partnerships */}
      <section className="document-section">
        <h2 className="document-heading">Strategic Partnerships</h2>
        
        <h3 className="document-subheading">Merck KGaA Collaboration</h3>
        <p className="document-text">
          BioVaxys maintains a research collaboration with Merck KGaA (Darmstadt, Germany) to evaluate DPX™-based cancer vaccines in combination with Merck's checkpoint inhibitors. This collaboration validates the DPX™ platform's potential for combination immunotherapy approaches and provides access to Merck's oncology expertise and resources.
        </p>

        <h3 className="document-subheading">Zoetis Animal Health Agreement</h3>
        <p className="document-text">
          The DPX™ platform has been licensed to Zoetis, the world's largest animal health company, for veterinary vaccine applications. This partnership provides:
        </p>
        <ul className="document-list">
          <li>Non-dilutive funding through milestone and royalty payments</li>
          <li>Validation of DPX™ technology by a major pharmaceutical company</li>
          <li>Potential for revenue generation outside of human clinical development</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="document-section">
        <h2 className="document-heading">Intellectual Property</h2>
        <p className="document-text">
          BioVaxys maintains an extensive intellectual property portfolio protecting its core technologies:
        </p>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Patents/Filings</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DPX™ Platform</td>
                <td>15+ patent families</td>
                <td>US, EU, Japan, China, Canada, Australia</td>
              </tr>
              <tr>
                <td>MVP-S Compositions</td>
                <td>5+ patent families</td>
                <td>Major markets through 2035+</td>
              </tr>
              <tr>
                <td>HapTenix© Technology</td>
                <td>3+ patent families</td>
                <td>Global coverage pending</td>
              </tr>
              <tr>
                <td>Manufacturing Methods</td>
                <td>2+ patent families</td>
                <td>Process and formulation protection</td>
              </tr>
              <tr>
                <td><strong>Total Portfolio</strong></td>
                <td><strong>25+ families, 100+ filings</strong></td>
                <td><strong>Major global markets</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="document-section">
        <h2 className="document-heading">Market Opportunity</h2>
        
        <h3 className="document-subheading">Addressable Markets</h3>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Market</th>
                <th>2024 Size</th>
                <th>2030 Projected</th>
                <th>CAGR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Global Cancer Immunotherapy</td>
                <td>$126B</td>
                <td>$226B</td>
                <td>10.2%</td>
              </tr>
              <tr>
                <td>Cancer Vaccines</td>
                <td>$8B</td>
                <td>$18B</td>
                <td>14.5%</td>
              </tr>
              <tr>
                <td>Ovarian Cancer Therapeutics</td>
                <td>$3.2B</td>
                <td>$5.8B</td>
                <td>10.4%</td>
              </tr>
              <tr>
                <td>mRNA Therapeutics</td>
                <td>$45B</td>
                <td>$98B</td>
                <td>13.8%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="document-subheading">mRNA Delivery Opportunity</h3>
        <p className="document-text">
          The DPX™ platform's lipid nanoparticle technology positions BioVaxys at the intersection of two major therapeutic trends: cancer immunotherapy and mRNA therapeutics. While originally developed for peptide delivery, the platform's core technology is applicable to mRNA and other nucleic acid payloads, representing a significant expansion of the addressable market opportunity.
        </p>
      </section>

      {/* Valuation Analysis */}
      <section className="document-section">
        <h2 className="document-heading">Valuation Analysis</h2>
        
        <h3 className="document-subheading">Comparable Transactions</h3>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Relevance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IMV Inc. Peak Valuation</td>
                <td>Phase II</td>
                <td>$500M+</td>
                <td>Same DPX™ platform</td>
              </tr>
              <tr>
                <td>Advaxis Acquisition (2022)</td>
                <td>Phase II</td>
                <td>$50M</td>
                <td>Cancer vaccine company</td>
              </tr>
              <tr>
                <td>Heat Biologics Merger (2023)</td>
                <td>Phase I/II</td>
                <td>$35M</td>
                <td>Immunotherapy platform</td>
              </tr>
              <tr>
                <td>Oncobiologics Acquisition</td>
                <td>Phase III</td>
                <td>$120M</td>
                <td>Clinical-stage oncology</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="document-subheading">Valuation Scenarios</h3>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Assumptions</th>
                <th>Implied Value</th>
                <th>Price Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Base Case</strong></td>
                <td>MVP-S advances; single partnership</td>
                <td>$25M</td>
                <td>$0.48</td>
              </tr>
              <tr>
                <td><strong>Bull Case</strong></td>
                <td>Positive data; multiple deals</td>
                <td>$50M</td>
                <td>$0.96</td>
              </tr>
              <tr>
                <td><strong>Upside Case</strong></td>
                <td>Major pharma partnership/M&A</td>
                <td>$100M+</td>
                <td>$1.92+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="document-subheading">Price Target: $0.48 – $0.60</h3>
        <p className="document-text">
          Our 12-month price target of $0.48–$0.60 is based on a probability-weighted analysis of potential outcomes, applying appropriate risk discounts for clinical and regulatory uncertainty. This target implies an enterprise value of $25–$32 million, which we believe is conservative given:
        </p>
        <ul className="document-list">
          <li>The DPX™ platform was acquired at a 99% discount to IMV's historical valuation</li>
          <li>Phase IIB clinical validation already achieved</li>
          <li>Multiple near-term catalysts that could drive re-rating</li>
          <li>Optionality from the HapTenix© platform not fully reflected in current price</li>
        </ul>
      </section>

      {/* Risk Factors */}
      <section className="document-section">
        <h2 className="document-heading">Risk Factors</h2>
        <p className="document-text">
          Investing in clinical-stage biotechnology companies involves substantial risk. Key risk factors for BioVaxys include:
        </p>
        
        <h3 className="document-subheading">Clinical Development Risks</h3>
        <ul className="document-list">
          <li>Approximately 80% of drugs in clinical trials fail to achieve regulatory approval</li>
          <li>Phase IIB data may not be replicated in larger studies</li>
          <li>Regulatory agencies may require additional trials or reject applications</li>
        </ul>

        <h3 className="document-subheading">Financial Risks</h3>
        <ul className="document-list">
          <li>Company will require substantial additional capital to fund development</li>
          <li>Future financings will likely result in dilution to existing shareholders</li>
          <li>No revenue generated from product sales; operating losses expected to continue</li>
        </ul>

        <h3 className="document-subheading">Market & Liquidity Risks</h3>
        <ul className="document-list">
          <li>OTCQB securities typically have limited trading volume and liquidity</li>
          <li>Stock price may be volatile regardless of operating performance</li>
          <li>Microcap biotechnology stocks may experience significant price declines</li>
        </ul>
      </section>

      {/* Catalysts */}
      <section className="document-section">
        <h2 className="document-heading">Near-Term Catalysts</h2>
        <div className="document-table-wrapper">
          <table className="document-table">
            <thead>
              <tr>
                <th>Catalyst</th>
                <th>Timeline</th>
                <th>Potential Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MVP-S Phase IIB Data Update</td>
                <td>Q1-Q2 2026</td>
                <td>High</td>
              </tr>
              <tr>
                <td>BVX-0918 Phase I Initiation (Spain)</td>
                <td>H1 2026</td>
                <td>Medium</td>
              </tr>
              <tr>
                <td>Partnership/Licensing Announcement</td>
                <td>2026</td>
                <td>High</td>
              </tr>
              <tr>
                <td>Additional Patent Grants</td>
                <td>Ongoing</td>
                <td>Low-Medium</td>
              </tr>
              <tr>
                <td>Conference Presentations</td>
                <td>Throughout 2026</td>
                <td>Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Conclusion */}
      <section className="document-section">
        <h2 className="document-heading">Investment Conclusion</h2>
        <p className="document-text">
          BioVaxys Technology Corp. represents a compelling speculative investment opportunity in the clinical-stage biotechnology sector. The company's acquisition of IMV Inc.'s DPX™ platform at a fraction of its historical valuation provides an asymmetric risk/reward profile for investors willing to accept the inherent risks of microcap biotech investing.
        </p>
        <p className="document-text">
          With Phase IIB clinical validation, a dual-platform strategy, blue-chip partnerships, and multiple near-term catalysts, we believe BioVaxys offers significant upside potential from current levels. We initiate coverage with a <strong>SPECULATIVE BUY</strong> rating and a 12-month price target of <strong>$0.48–$0.60</strong>.
        </p>
        <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            This report was prepared by Omnia Capital Partners for informational purposes only.
            <br />See full disclosures for important risk information.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ResearchReportContent;
