const BBLCPressReleaseContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <p className="text-xs text-primary font-mono mb-2">FOR IMMEDIATE RELEASE</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Blockchain Loyalty Corp. Announces InfernoGrid GPU Marketplace Development
        </h1>
        <p className="text-sm text-muted-foreground">January 10, 2026</p>
      </div>

      {/* Body */}
      <section className="py-6">
        <p className="document-text">
          <strong>SHERIDAN, WY</strong> – Blockchain Loyalty Corp. (OTC: BBLC) ("BBLC" or the "Company"), a technology company focused on AI compute infrastructure and fintech solutions, today announced significant progress on its InfernoGrid GPU marketplace platform.
        </p>

        <p className="document-text">
          InfernoGrid is designed to connect AI developers and enterprises requiring GPU compute power with individuals and organizations possessing idle GPU capacity. The platform addresses the growing demand for affordable, accessible AI compute resources.
        </p>

        <h2 className="document-subheading">Key Development Milestones</h2>
        <ul className="document-list">
          <li>Core marketplace architecture completed</li>
          <li>Host application development in advanced stages</li>
          <li>Enterprise dashboard features being finalized</li>
          <li>Beta testing program scheduled for Q1 2026</li>
        </ul>

        <p className="document-text">
          "We're excited about the progress our team has made on InfernoGrid," said Joel DeBellefeuille, CEO of Blockchain Loyalty Corp. "The AI compute market represents a massive opportunity, and we believe our consumer-friendly approach to GPU sharing will differentiate us from existing solutions."
        </p>

        <h2 className="document-subheading">About Blockchain Loyalty Corp.</h2>
        <p className="document-text">
          Blockchain Loyalty Corp. (OTC: BBLC) is a technology company developing InfernoGrid, a GPU marketplace for AI compute, and Koilink, a fintech OTC trading platform. The Company is headquartered in Sheridan, Wyoming, USA.
        </p>

        <h2 className="document-subheading">Forward-Looking Statements</h2>
        <p className="text-xs text-muted-foreground">
          This press release contains forward-looking statements that involve risks and uncertainties. Actual results may differ materially from those anticipated. The Company undertakes no obligation to update forward-looking statements.
        </p>
      </section>

      {/* Contact */}
      <div className="pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Investor Relations Contact:</strong><br />
          Omnia Capital Partners Ltd.<br />
          ir@blockchainloyalty.com
        </p>
      </div>
    </div>
  );
};

export default BBLCPressReleaseContent;
