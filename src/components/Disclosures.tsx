import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const Disclosures = () => {
  return (
    <section className="bg-terminal-dark py-12 px-5 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-foreground text-center mb-8">
          Important Disclosures
        </h2>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent mb-6">
            <TabsTrigger value="general" className="disclosure-tab bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
              General
            </TabsTrigger>
            <TabsTrigger value="risks" className="disclosure-tab bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
              Risk Factors
            </TabsTrigger>
            <TabsTrigger value="analyst" className="disclosure-tab bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
              Analyst
            </TabsTrigger>
            <TabsTrigger value="privacy" className="disclosure-tab bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="terms" className="disclosure-tab bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
              Terms
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <ScrollArea className="h-64">
              <TabsContent value="general" className="text-muted-foreground text-sm leading-relaxed m-0">
                <h3 className="font-semibold text-foreground mb-3">Important Information and Disclaimer</h3>
                <p className="mb-4">
                  This research material (the "Report") has been prepared by Omnia Capital Partners Ltd. (the "Publisher") for informational purposes only. This Report is not intended to be, and should not be construed as, an offer to sell or a solicitation of an offer to buy any securities of Predictiv AI Inc. (the "Company," "Predictiv AI") or any other securities discussed herein.
                </p>
                <h4 className="font-semibold text-foreground mb-2">No Investment Advice</h4>
                <p className="mb-4">
                  The information contained in this Report does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the Report's content as such. The Publisher does not recommend that any security should be bought, sold, or held by you. Nothing in this Report should be taken as a recommendation to buy, sell, or hold any investment or to pursue any investment strategy.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Forward-Looking Statements</h4>
                <p className="mb-4">
                  This Report contains "forward-looking statements" within the meaning of Section 27A of the Securities Act of 1933 and Section 21E of the Securities Exchange Act of 1934. Forward-looking statements are based on the Company's current expectations and assumptions regarding its business, the economy, and other future conditions. As a result, actual results may differ materially from those contemplated by the forward-looking statements.
                </p>
                <h4 className="font-semibold text-foreground mb-2">No Warranties</h4>
                <p>
                  THE INFORMATION IN THIS REPORT IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </TabsContent>
              
              <TabsContent value="risks" className="text-muted-foreground text-sm leading-relaxed m-0">
                <h3 className="font-semibold text-foreground mb-3">Investment Risk Warning</h3>
                <p className="mb-4">
                  Investing in junior listed issuers involves an extremely high degree of risk and is suitable only for sophisticated investors who can afford the complete loss of their investment. Predictiv AI (CSE: PAI · FWB: 7IT) is a small-cap issuer with thin trading volume.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Specific Risk Factors:</h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Early Revenue Base:</strong> ~US$88K TTM revenue against ~US$9M net loss — early-stage commercialization risk</li>
                  <li><strong>JV Execution Risk:</strong> Shift × Arcasia is currently a non-binding term sheet; definitive agreements and Sri Lanka entity formation are pending</li>
                  <li><strong>Competition Risk:</strong> Logistics SaaS, fleet telematics and contact-center AI are contested by well-capitalized incumbents</li>
                  <li><strong>Capital Requirements:</strong> Substantial additional financing likely needed; dilution risk is material</li>
                  <li><strong>Liquidity Risk:</strong> Thin float and low average daily volume — bid-ask spreads may be wide</li>
                  <li><strong>Key Person Risk:</strong> Dependence on a small management team</li>
                  <li><strong>Regulatory Risk:</strong> CSE-listed issuer subject to continuous disclosure and evolving multi-jurisdictional regulation</li>
                  <li><strong>Market Risk:</strong> Stock price volatility regardless of operating performance</li>
                  <li><strong>Governance Risk:</strong> Small board with limited independent oversight</li>
                  <li><strong>Operating Losses:</strong> History of operating losses with no guarantee of future profitability</li>
                </ul>
                <p className="font-semibold text-destructive">
                  Past performance is not indicative of future results. All investments involve risk and may result in partial or total loss.
                </p>
              </TabsContent>
              
              <TabsContent value="analyst" className="text-muted-foreground text-sm leading-relaxed m-0">
                <h3 className="font-semibold text-foreground mb-3">Analyst Certification</h3>
                <p className="mb-4">
                  The research analyst(s) hereby certify that all views expressed in this Report accurately reflect the analyst's personal views about the subject company and its securities. No part of analyst compensation was, is, or will be related to the specific recommendations expressed herein.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Compensation Disclosure</h4>
                <p className="mb-4">
                  Omnia Capital Partners Ltd. has been engaged and compensated by Predictiv AI Inc. for investor relations and capital markets advisory services. This creates a material conflict of interest. Readers should consider this relationship when evaluating this research.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Ownership Disclosure</h4>
                <p className="mb-4">
                  The Publisher, its affiliates, officers, directors, and/or employees may own securities of the Company discussed in this Report.
                </p>
                <h4 className="font-semibold text-foreground mb-2">No Recommendation</h4>
                <p>
                  This research contains <strong className="text-primary">no price target, rating, or recommendation</strong> to buy, sell, or hold any security. Content is for informational and educational purposes only. Investing in junior listed issuers carries above-average risk and volatility, including the potential for total loss of capital.
                </p>
              </TabsContent>
              
              <TabsContent value="privacy" className="text-muted-foreground text-sm leading-relaxed m-0">
                <h3 className="font-semibold text-foreground mb-3">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Information you provide (name, email for newsletter)</li>
                  <li>Automatically collected data (IP, browser, device info)</li>
                  <li>Cookies for analytics</li>
                </ul>
                <h4 className="font-semibold text-foreground mb-2">How We Use Information</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Provide and improve services</li>
                  <li>Send requested research updates</li>
                  <li>Analyze usage patterns</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <h4 className="font-semibold text-foreground mb-2">Data Sharing</h4>
                <p className="mb-4">
                  We may share data with service providers, in response to legal requests, and to protect rights and safety.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Your Rights</h4>
                <p className="mb-4">
                  Depending on location, you may access, correct, delete, or port your data.
                </p>
                <p>
                  Contact: privacy@omniacap.com
                </p>
              </TabsContent>
              
              <TabsContent value="terms" className="text-muted-foreground text-sm leading-relaxed m-0">
                <h3 className="font-semibold text-foreground mb-3">Eligibility</h3>
                <p className="mb-4">
                  Must be 18+ and legally permitted to access investment research in your jurisdiction.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Intellectual Property</h4>
                <p className="mb-4">
                  All content is property of Omnia Capital Partners Ltd. and protected by copyright.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Permitted Use</h4>
                <p className="mb-4">
                  Personal, non-commercial use for investment research only.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Prohibited Conduct</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Redistributing or commercially exploiting materials</li>
                  <li>Automated access</li>
                  <li>Interference with services</li>
                  <li>Misrepresentation</li>
                </ul>
                <h4 className="font-semibold text-foreground mb-2">Governing Law</h4>
                <p>
                  Province of Ontario, Canada.
                </p>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Disclosures;
