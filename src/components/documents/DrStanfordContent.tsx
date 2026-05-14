import { GraduationCap, Award, FlaskConical, Building2, TrendingUp, FileText, Shield } from "lucide-react";

const DrStanfordContent = () => {
  return (
    <div className="document-content">
      {/* Header */}
      <div className="text-center pb-6 border-b border-amber-200/50">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200">
            Scientific Advisory Appointment
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Dr. Marianne Stanford, PhD
        </h1>
        <p className="text-lg text-amber-700 font-medium">
          Joins BioVaxys as Scientific Advisor
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          December 15, 2026 · 8:00 AM ET
        </p>
      </div>

      {/* Investor Significance Section */}
      <section className="document-section">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="document-heading !mb-0 !pb-0 !border-0">Why This Matters for Investors</h2>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-5 border border-amber-200">
          <p className="document-text mb-4">
            The appointment of Dr. Marianne Stanford represents a <strong>strategic validation signal</strong> for BioVaxys' DPX™ platform acquisition and development strategy:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-primary">Platform Continuity:</strong>
                <span className="text-muted-foreground"> The scientist who BUILT the DPX platform at IMV now advises BioVaxys — ensuring seamless technology transfer and institutional knowledge retention.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-primary">IP Strength:</strong>
                <span className="text-muted-foreground"> Named inventor on multiple DPX patents including mRNA delivery formulations — insider knowledge on defensibility and freedom-to-operate.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-primary">Clinical Expertise:</strong>
                <span className="text-muted-foreground"> Her Keytruda™ (pembrolizumab) combination research directly supports MVP-S Phase IIB trials in DLBCL and ovarian cancer.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <div>
                <strong className="text-primary">De-risking Signal:</strong>
                <span className="text-muted-foreground"> Top-tier scientific talent choosing to work with BioVaxys represents a vote of confidence in the platform's potential.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Biography Section */}
      <section className="document-section">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="document-heading !mb-0 !pb-0 !border-0">Professional Biography</h2>
        </div>
        
        <h3 className="document-subheading">IMV Inc. — Vice President of R&D</h3>
        <p className="document-text">
          As Vice President of R&D at IMV Inc., Dr. Stanford and her team were responsible for the complete development of the <strong>DPX™ vaccine portfolio</strong>. Her work encompassed:
        </p>
        <ul className="document-list">
          <li>Studying the unique mechanism of action of the DPX platform</li>
          <li>Establishing safety, efficacy, and dosing schedules in preclinical models</li>
          <li>Demonstrating that combining DPX with cyclophosphamide and PD-1 blockade (using antibodies such as pembrolizumab, Merck's Keytruda™) enhanced immunogenicity and efficacy in cancer models</li>
          <li>Publishing numerous peer-reviewed studies on DPX technology</li>
          <li>Named inventor on multiple patents related to the DPX platform and DPX formulations, including patents exploring mRNA-encoded compositions</li>
        </ul>

        <h3 className="document-subheading">Mara Renewables Corp. — Chief Scientific Officer</h3>
        <p className="document-text">
          Most recently, Dr. Stanford served as Chief Scientific Officer at Mara Renewables Corp., where she:
        </p>
        <ul className="document-list">
          <li>Drove the commercialization of bio-based omega-3 nutrition products for global markets</li>
          <li>Oversaw teams of scientists across multiple research groups</li>
          <li>Led initiatives spanning from discovery science to application research</li>
        </ul>

        <h3 className="document-subheading">Canadian Institutes of Health Research (CIHR)</h3>
        <p className="document-text">
          Prior to her industry roles, Dr. Stanford was the Assistant Scientific Director at the Institute for Infection and Immunity at CIHR, Canada's federal funding agency for health research, where she helped build Canada's national infectious disease research capacity.
        </p>

        <h3 className="document-subheading">Education & Training</h3>
        <p className="document-text">
          Dr. Stanford holds a <strong>PhD in Microbiology and Immunology from Dalhousie University</strong>, complemented by postdoctoral fellowships in viral immunotherapy and oncology.
        </p>
      </section>

      {/* Patent & Publications Section */}
      <section className="document-section">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h2 className="document-heading !mb-0 !pb-0 !border-0">Patent Portfolio & Research Impact</h2>
        </div>
        
        <p className="document-text">
          Dr. Stanford is named inventor on <strong>multiple patents</strong> central to BioVaxys' DPX technology platform:
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <FlaskConical className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold text-primary mb-1">DPX Platform Patents</h4>
            <p className="text-sm text-muted-foreground">Core formulation and delivery mechanism patents for the DPX immune-educating technology</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <FileText className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold text-primary mb-1">mRNA Delivery Patents</h4>
            <p className="text-sm text-muted-foreground">Patents exploring DPX compositions that express mRNA encoded by nucleic acid components in targeted cells</p>
          </div>
        </div>
        
        <p className="document-text">
          Her peer-reviewed publications span studies on DPX mechanism of action, combination immunotherapy approaches, and novel vaccine formulation strategies.
        </p>
      </section>

      {/* Executive Quote */}
      <section className="document-section">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="document-heading !mb-0 !pb-0 !border-0">Executive Commentary</h2>
        </div>
        
        <blockquote className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/50 rounded-r-lg">
          <p className="document-text italic mb-3">
            "We are pleased to now have the support of Dr. Stanford. Her deep familiarity with the DPX platform and experience leading the development of DPX formulations for oncology and infectious disease brings significant internal strength to BioVaxys. We are particularly excited to further her work developing DPX as a delivery platform for mRNA and other polypeptides."
          </p>
          <footer className="text-sm text-primary font-medium">
            — Kenneth Kovan, President and Chief Operating Officer, BioVaxys
          </footer>
        </blockquote>
      </section>

      {/* About BioVaxys */}
      <section className="document-section">
        <h2 className="document-heading">About BioVaxys Technology Corp.</h2>
        <p className="document-text">
          BioVaxys Technology Corp. (<a href="https://www.biovaxys.com" className="text-primary hover:underline">www.biovaxys.com</a>), a biopharmaceuticals company registered in British Columbia, Canada, is a clinical-stage biopharmaceutical company dedicated to improving patient lives with novel immunotherapies based on the DPX™ immune-educating technology platform for treating cancers, infectious disease, antigen desensitization for food allergy, and other immunological diseases.
        </p>
        <p className="document-text">
          Through a differentiated mechanism of action, the DPX platform delivers instruction to the immune system to generate a specific, robust, and persistent immune response. The Company's clinical stage pipeline includes maveropepimut-S (MVP-S), based on the DPX platform, in Phase IIB clinical development for advanced Relapsed-Refractory Diffuse Large B Cell Lymphoma (DLBCL) and platinum resistant Ovarian Cancer.
        </p>
        <p className="document-text">
          BioVaxys is also developing DPX+SurMAGE, DPX-RSV for Respiratory Syncytial Virus, DPX+rPA for peanut allergy prophylaxis, and BVX-0918, a personalized immunotherapeutic vaccine using its proprietary HapTenix© 'neoantigen' tumor cell construct platform.
        </p>
        <p className="document-text font-medium">
          BioVaxys common shares are listed on the CSE under the stock symbol 'BIOV', trade on the Frankfurt Bourse (FRA: 5LB), and in the US (OTCQB: BVAXF).
        </p>
      </section>

      {/* Forward-Looking Statements */}
      <section className="document-section">
        <h2 className="document-heading">Cautionary Statements on Forward-Looking Information</h2>
        <p className="document-text text-sm">
          This announcement includes certain "forward-looking information" and "forward-looking statements" within the meaning of applicable securities legislation. Forward-looking statements are frequently identified by words such as "expects", "anticipates", "believes", "intends", "estimates", "potential", "possible", and similar expressions.
        </p>
        <p className="document-text text-sm">
          Forward-looking statements reflect the beliefs, opinions and projections on the date the statements are made and are based upon a number of assumptions and estimates that, while considered reasonable by BioVaxys, are inherently subject to significant business, economic, competitive, political and social uncertainties and contingencies.
        </p>
        <p className="document-text text-sm">
          Many factors, both known and unknown, could cause actual results, performance or achievements to be materially different from the results, performance or achievements that are or may be expressed or implied by such forward-looking statements. BioVaxys does not assume any obligation to update the forward-looking statements, except as required by applicable securities laws.
        </p>
      </section>

      {/* Omnia Capital Partners Disclaimer */}
      <section className="document-section bg-muted/50 rounded-lg p-5 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-destructive" />
          <h2 className="text-base font-bold text-destructive uppercase tracking-wider">
            Important Notice and Disclaimer
          </h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          This announcement summary has been prepared by Omnia Capital Partners for informational purposes only. It does not constitute investment advice, a recommendation, or an offer to buy or sell securities.
        </p>
        
        <p className="text-sm text-muted-foreground mb-3">
          <strong>Compensation Disclosure:</strong> Omnia Capital Partners has been retained by BioVaxys Technology Corp. for investor relations and corporate communications services. This creates an inherent conflict of interest.
        </p>
        
        <p className="text-sm text-muted-foreground mb-3">
          <strong>Ownership Disclosure:</strong> Principals, employees, or affiliates of Omnia Capital Partners may hold positions in BioVaxys securities and may buy or sell such securities at any time without notice.
        </p>
        
        <p className="text-sm text-muted-foreground mb-3">
          <strong>Forward-Looking Statements:</strong> This document contains forward-looking statements that involve risks and uncertainties. Actual results may differ materially from those expressed or implied.
        </p>
        
        <p className="text-sm text-muted-foreground">
          <strong>Investment Risk:</strong> Investing in micro-cap securities involves substantial risk, including the potential for complete loss of capital. Investors should conduct their own due diligence and consult with qualified financial advisors before making investment decisions.
        </p>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2026 Omnia Capital Partners · <a href="mailto:ir@omniacap.ai" className="text-primary hover:underline">ir@omniacap.ai</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default DrStanfordContent;
