import sumanPhoto from "@/assets/suman-pushparajah-matched.png";
import sanaPhoto from "@/assets/sana-srithas.png";

const BBLCAboutContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-primary font-mono mb-1">COMPANY OVERVIEW</p>
          <h1 className="text-2xl font-bold text-foreground">Predictiv AI Inc.</h1>
          <p className="text-muted-foreground">CSE: PAI · FWB: 7IT | Vertical AI for Fleet, Voice/Chat &amp; Real Estate</p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-primary/10 border border-primary px-4 py-2 rounded">
            <span className="font-bold text-primary">CSE Listed Dec 2025</span>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">Mission</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Predictiv AI is a Canadian artificial intelligence company focused on developing vertical AI applications
          for defined industries. The Company builds production-grade software across fleet telematics, voice and
          chat automation, and real estate intelligence — empowering smarter decisions for operators that move the
          physical economy.
        </p>
      </section>

      {/* Core Business Segments */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Six Vertical AI Product Lines</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">SH</span>
              </div>
              <h3 className="font-bold text-foreground">Shift Technologies</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered logistics platform spanning first, middle, and last-mile execution. Subject of the April 2026 51/49 joint venture with Arcasia Holdings.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">SM</span>
              </div>
              <h3 className="font-bold text-foreground">Shiftmatics</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fleet management software with predictive performance, dispatch, and operational analytics.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">CR</span>
              </div>
              <h3 className="font-bold text-foreground">CloudRep</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-based agents for voice, chat, and SMS — built for structured operational workflows and customer service automation.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">HS</span>
              </div>
              <h3 className="font-bold text-foreground">Housestack</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Real estate intelligence and workflow tooling for agents, brokerages, and operators.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">HF</span>
              </div>
              <h3 className="font-bold text-foreground">Housefax</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Property history and risk intelligence — structured data and reports for residential real estate diligence.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">WT</span>
              </div>
              <h3 className="font-bold text-foreground">Weather Telematics</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Hyper-local road and weather intelligence for fleet routing, safety, and risk optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Leadership Team</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border bg-muted">
              <img src={sumanPhoto} alt="Suman Pushparajah" width={48} height={48} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Suman Pushparajah</h3>
              <p className="text-xs text-primary mb-1">Chief Executive Officer &amp; Director</p>
              <p className="text-sm text-muted-foreground">
                Leading product strategy across Shift, Shiftmatics, and CloudRep, and driving the Shift × Arcasia joint venture rollout.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border bg-muted">
              <img src={sanaPhoto} alt="Sana Srithas" width={48} height={48} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Sana Srithas</h3>
              <p className="text-xs text-primary mb-1">Chief Operating Officer &amp; Director</p>
              <p className="text-sm text-muted-foreground">
                Co-Founder of Shift and HouseStack. Former Chief of Staff to a Member of Parliament and Director of Operations at a TSX Venture-listed company, leading operations across Canada.
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
            <div className="text-xl font-bold text-primary font-mono">+651%</div>
            <div className="text-xs text-muted-foreground">Revenue YoY</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-primary font-mono">~C$15.98M</div>
            <div className="text-xs text-muted-foreground">Market Cap</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-foreground font-mono">118.3M</div>
            <div className="text-xs text-muted-foreground">Shares Outstanding</div>
          </div>
          <div className="text-center bg-card border border-border rounded p-3">
            <div className="text-xl font-bold text-foreground font-mono">6</div>
            <div className="text-xs text-muted-foreground">Product Lines</div>
          </div>
        </div>
      </section>

      {/* Corporate Information */}
      <section className="py-6">
        <h2 className="text-lg font-bold text-foreground mb-3">Corporate Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Tickers:</span> CSE: PAI · FWB: 7IT</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Headquarters:</span> Toronto, ON, Canada</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">CSE Listed:</span> December 22, 2025</p>
          </div>
          <div>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Industry:</span> Vertical AI / SaaS</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Sectors:</span> Fleet · Voice/Chat · Real Estate</p>
            <p className="text-muted-foreground"><span className="text-foreground font-medium">Investor Relations:</span> Internal</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BBLCAboutContent;
