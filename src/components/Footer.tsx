import { MapPin, Clock, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-terminal-black py-10 px-5 border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Branding */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-foreground mb-1">Blockchain Loyalty Corp.</h3>
          <p className="text-sm text-primary font-mono">OTC: BBLC</p>
        </div>
        
        {/* Office Location */}
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Corporate Headquarters</span>
            </div>
            <p className="text-sm text-muted-foreground">
              30 N Gould St, Suite R<br />
              Sheridan, WY 82801, USA
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
              <span className="text-foreground text-right">Blockchain Loyalty Corp.</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Former Name</span>
              <span className="text-foreground text-right">Belle Bonica Luxe Corp.</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">State of Incorporation</span>
              <span className="text-foreground text-right">Delaware, USA</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Year Incorporated</span>
              <span className="text-foreground text-right">2004</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Fiscal Year End</span>
              <span className="text-foreground text-right">December 31</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Reporting Standard</span>
              <span className="text-foreground text-right">Alternative Reporting</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Audited Financials</span>
              <span className="text-foreground text-right">Unaudited</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Employees</span>
              <span className="text-foreground text-right">1 (as of Dec 2025)</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">SIC Code</span>
              <span className="text-foreground text-right">7371 — Custom Computer Programming</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Shell Risk Status</span>
              <span className="text-primary text-right font-semibold">REMOVED (March 2025)</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="text-foreground text-right">1.800.868.6118 / +1 514.434.2640</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Email</span>
              <a href="mailto:info@bblc.io" className="text-primary text-right hover:underline">info@bblc.io</a>
            </div>
            <div className="flex justify-between gap-2 md:col-span-2">
              <span className="text-muted-foreground">Website</span>
              <a href="https://bblc.io" target="_blank" rel="noopener noreferrer" className="text-primary text-right hover:underline">bblc.io</a>
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
            © 2026 Blockchain Loyalty Corp. All rights reserved.
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
