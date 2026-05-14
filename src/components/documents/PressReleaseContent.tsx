const PressReleaseContent = () => {
  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded font-bold animate-pulse">
          BREAKING
        </span>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
          CSE: BIOV
        </span>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
          OTCQB: BVAXF
        </span>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
          FRA: 5LB
        </span>
        <span className="ml-auto">December 15, 2026 · 8:00 AM ET</span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-foreground">
        BioVaxys Strengthens Scientific Team with Addition of Former IMV Vice President of R&D
      </h1>

      {/* Distribution Notice */}
      <div className="text-xs text-muted-foreground border-l-2 border-primary pl-3">
        VANCOUVER, BC, December 15, 2026 — TheNewswire
      </div>

      {/* Main Content */}
      <div className="prose prose-sm max-w-none text-foreground/90 space-y-4">
        <p>
          <strong>BioVaxys Technology Corp.</strong> (CSE: BIOV) (FRA: 5LB) (OTCQB: BVAXF) ("BioVaxys" or "Company") 
          is pleased to announce that <strong>Marianne Stanford, PhD</strong>, has joined BioVaxys as Scientific Advisor.
        </p>

        <p>
          Dr. Stanford was Vice President of R&D at the former IMV Inc, where she and her team were responsible for the 
          development of the <strong>DPX™ vaccine portfolio</strong>. This included the study of the unique mechanism of action 
          of the DPX platform and its safety, efficacy, and dosing schedules in preclinical models. Under her leadership, 
          Dr. Stanford's team also demonstrated that combining DPX, cyclophosphamide and then PD-1 blockade (using antibodies 
          such as pembrolizumab, Merck's Keytruda™) enhanced immunogenicity and thus efficacy in cancer models.
        </p>

        <p>
          Dr. Stanford and collaborators have published numerous studies and she is named inventor on multiple patents related 
          to the DPX platform and DPX formulations. This includes patents that explore DPX compositions that express mRNA 
          encoded by the nucleic acid components in targeted cells.
        </p>

        <p>
          Dr. Stanford was most recently the Chief Scientific Officer at <strong>Mara Renewables Corp.</strong>, where she drove 
          the commercialization of bio-based omega-3 nutrition products for global markets and oversaw teams of scientists 
          across multiple research groups, from discovery science to application research. Prior to this role, Dr. Stanford 
          was the Assistant Scientific Director at the Institute for Infection and Immunity at <strong>The Canadian Institutes 
          of Health Research (CIHR)</strong>, Canada's federal funding agency for health research, where she helped build 
          Canada's national infectious disease research capacity.
        </p>

        <p>
          Dr. Stanford holds a PhD in Microbiology and Immunology from Dalhousie University, complemented by postdoctoral 
          fellowships in viral immunotherapy and oncology.
        </p>

        {/* Executive Quote */}
        <div className="bg-primary/5 border-l-4 border-primary p-4 my-6">
          <p className="italic text-foreground/90">
            "We are pleased to now have the support of Dr. Stanford. Her deep familiarity with the DPX platform and experience 
            leading the development of DPX formulations for oncology and infectious disease brings significant internal strength 
            to BioVaxys. We are particularly excited to further her work developing DPX as a delivery platform for mRNA and 
            other polypeptides."
          </p>
          <p className="mt-3 text-sm font-semibold text-primary">
            — Kenneth Kovan, President and Chief Operating Officer, BioVaxys
          </p>
        </div>

        {/* About Section */}
        <div className="border-t border-border pt-4 mt-6">
          <h3 className="font-bold text-foreground mb-2">About BioVaxys Technology Corp.</h3>
          <p className="text-sm text-foreground/80">
            BioVaxys Technology Corp. (<a href="https://www.biovaxys.com" className="text-primary hover:underline">www.biovaxys.com</a>), 
            a biopharmaceuticals company registered in British Columbia, Canada, is a clinical-stage biopharmaceutical company 
            dedicated to improving patient lives with novel immunotherapies based on the DPX™ immune-educating technology platform 
            for treating cancers, infectious disease, antigen desensitization for food allergy, and other immunological diseases.
          </p>
          <p className="text-sm text-foreground/80 mt-3">
            Through a differentiated mechanism of action, the DPX platform delivers instruction to the immune system to generate 
            a specific, robust, and persistent immune response. The Company's clinical stage pipeline includes maveropepimut-S (MVP-S), 
            based on the DPX platform, in Phase IIB clinical development for advanced Relapsed-Refractory Diffuse Large B Cell 
            Lymphoma (DLBCL) and platinum resistant Ovarian Cancer.
          </p>
          <p className="text-sm text-foreground/80 mt-3">
            BioVaxys is also developing DPX+SurMAGE, a dual-targeted immunotherapy combining antigenic peptides for both the survivin 
            and MAGE-A9 cancer proteins, DPX-RSV for Respiratory Syncytial Virus, DPX+rPA for peanut allergy prophylaxis, and BVX-0918, 
            a personalized immunotherapeutic vaccine using its proprietary HapTenix© 'neoantigen' tumor cell construct platform for 
            refractive late-stage ovarian cancer.
          </p>
        </div>

        {/* Board Signature */}
        <div className="border-t border-border pt-4 mt-6">
          <p className="text-sm font-semibold">ON BEHALF OF THE BOARD</p>
          <p className="text-sm mt-2">Signed "James Passin"</p>
          <p className="text-sm text-muted-foreground">Chief Executive Officer</p>
          <p className="text-sm text-muted-foreground">Phone: +1 740 358 0555</p>
        </div>

        {/* Cautionary Statements */}
        <div className="border-t border-border pt-4 mt-6">
          <h3 className="font-bold text-foreground mb-2 text-sm">Cautionary Statements on Forward Looking Information</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This news release includes certain "forward-looking information" and "forward-looking statements" (collectively 
            "forward-looking statements") within the meaning of applicable securities legislation. All statements, other than 
            statements of historical fact, included herein, without limitation, statements relating to the future operating or 
            financial performance of the Company, are forward-looking statements. Forward-looking statements are frequently, 
            but not always, identified by words such as "expects", "anticipates", "believes", "intends", "estimates", "potential", 
            "possible", and similar expressions, or statements that events, conditions, or results "will", "may", "could", or 
            "should" occur or be achieved.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            Forward-looking statements reflect the beliefs, opinions and projections on the date the statements are made and are 
            based upon a number of assumptions and estimates, primarily the assumption that BioVaxys will be successful in developing 
            and testing vaccines, that, while considered reasonable by BioVaxys, are inherently subject to significant business, 
            economic, competitive, political and social uncertainties and contingencies including, primarily but without limitation, 
            the risk that BioVaxys' vaccines will not prove to be effective and/or will not receive the required regulatory approvals.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            BioVaxys does not assume any obligation to update the forward-looking statements of beliefs, opinions, projections, 
            or other factors, should they change, except as required by applicable securities laws.
          </p>
        </div>

        {/* Omnia Capital Partners Disclaimer */}
        <div className="border-t-2 border-destructive/50 pt-6 mt-8 bg-destructive/5 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <h3 className="font-bold text-destructive mb-3 text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
            IMPORTANT NOTICE AND DISCLAIMER — Omnia Capital Partners
          </h3>
          <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
            <p>
              <strong>Purpose:</strong> This press release is being distributed by Omnia Capital Partners for informational 
              purposes only and should not be construed as investment advice or a recommendation to buy, sell, or hold any 
              securities of BioVaxys Technology Corp. or any other company.
            </p>
            <p>
              <strong>No Investment Advice:</strong> Omnia Capital Partners is not a registered investment adviser, broker-dealer, 
              or member of any securities exchange. The information contained herein does not constitute a professional analysis 
              of BioVaxys' financial position or investment merit. All investment decisions should be made after conducting your 
              own due diligence and consulting with a qualified financial advisor.
            </p>
            <p>
              <strong>Compensation Disclosure:</strong> Omnia Capital Partners and/or its affiliates may have received or may 
              receive compensation from BioVaxys Technology Corp. or third parties for the distribution of this press release 
              and related investor awareness services. This creates a conflict of interest.
            </p>
            <p>
              <strong>Ownership Disclosure:</strong> Omnia Capital Partners, its affiliates, officers, directors, and employees 
              may hold positions in securities of BioVaxys Technology Corp. and may buy or sell such securities at any time 
              without notice.
            </p>
            <p>
              <strong>Forward-Looking Statements:</strong> This release may contain forward-looking statements that involve 
              substantial risks and uncertainties. Actual results may differ materially from those expressed or implied.
            </p>
            <p>
              <strong>Investment Risk:</strong> An investment in BioVaxys Technology Corp. is considered highly speculative 
              and should not be made unless an investor can afford a complete loss of investment. Past performance is not 
              indicative of future results.
            </p>
            <p className="pt-2 border-t border-border/50">
              <strong>Contact:</strong> Omnia Capital Partners | ir@omniacap.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseContent;
