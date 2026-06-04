import { MapPin, Clock, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-terminal-black py-10 px-5 border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Branding */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-foreground mb-1">Predictiv AI Inc.</h3>
          <p className="text-sm text-primary font-mono">CSE: PAI · FWB: 7IT</p>
        </div>
        
        {/* Office Location */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Corporate Headquarters</span>
            </div>
            <p className="text-sm text-muted-foreground">
              20 Bay Street, 11th Floor<br />
              Toronto, Ontario, Canada M5J 2N8
            </p>
          </div>
        </div>

        {/* Corporate Information */}
        <div className="bg-card/50 border border-border rounded-lg p-5 mb-8">
          <h4 className="text-sm font-semibold text-foreground mb-4 text-center tracking-wide uppercase">
            Corporate Information
          </h4>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Legal Name</span>
              <span className="text-foreground text-right">Predictiv AI Inc.</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Tickers</span>
              <span className="text-foreground text-right">CSE: PAI · FWB: 7IT</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Country of Incorporation</span>
              <span className="text-foreground text-right">Canada</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">CSE Listing</span>
              <span className="text-foreground text-right">December 2025</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Fiscal Year End</span>
              <span className="text-foreground text-right">December 31</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Reporting Standard</span>
              <span className="text-foreground text-right">CSE Continuous Disclosure</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Sector</span>
              <span className="text-foreground text-right">Vertical AI · SaaS</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Subsidiaries</span>
              <span className="text-foreground text-right">Shift, CloudRep, Housestack +3</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Investor Relations</span>
              <span className="text-primary text-right font-semibold">Omnia Capital Partners</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">CEO</span>
              <span className="text-foreground text-right">Suman Pushparajah</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="text-foreground text-right">416-388-8886</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Email</span>
              <a href="mailto:info@predictiv.ai" className="text-primary text-right hover:underline">info@predictiv.ai</a>
            </div>
            <div className="flex justify-between gap-2 md:col-span-2">
              <span className="text-muted-foreground">Website</span>
              <a href="https://www.predictiv.ai" target="_blank" rel="noopener noreferrer" className="text-primary text-right hover:underline">www.predictiv.ai</a>
            </div>
          </div>
        </div>
        
        {/* Global Coverage */}
        <div className="flex items-center justify-center gap-4 mb-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>17+ Hours Daily Coverage</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Global Markets</span>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px w-full bg-border mb-6"></div>
        
        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">
            Institutional Research · May 2026
          </p>
          <p className="text-muted-foreground/60 text-xs mb-2">
            © 2026 Predictiv AI Inc. All rights reserved.
          </p>
          <p className="text-muted-foreground/40 text-xs mb-3">
            Investment involves substantial risk including total loss of principal. This is not investment advice.
          </p>
          <a
            href="/admin"
            className="text-muted-foreground/50 hover:text-primary text-xs underline-offset-4 hover:underline transition-colors"
          >
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
