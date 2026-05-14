import { useState, useEffect } from "react";
import { FileText, BarChart3, Eye, Newspaper, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentViewer from "./DocumentViewer";
import BBLCReportContent from "./documents/BBLCReportContent";
import BBLCTearSheetContent from "./documents/BBLCTearSheetContent";
import BBLCPressReleaseContent from "./documents/BBLCPressReleaseContent";
import BBLCAboutContent from "./documents/BBLCAboutContent";
import { supabase } from "@/integrations/supabase/client";

type DocumentType = "report" | "tearsheet" | "pressrelease" | "about" | null;

const researchMaterials: {
  id: "report" | "tearsheet" | "pressrelease" | "about";
  icon: typeof FileText;
  title: string;
  description: string;
}[] = [
  {
    id: "report" as const,
    icon: FileText,
    title: "Full Research Report",
    description: "12-page institutional deep dive covering InfernoGrid, Koilink, valuation scenarios, and risk analysis",
  },
  {
    id: "tearsheet" as const,
    icon: BarChart3,
    title: "Executive Tear Sheet",
    description: "One-page summary with key metrics, price targets, catalysts, and investment thesis",
  },
  {
    id: "pressrelease" as const,
    icon: Newspaper,
    title: "Press Release",
    description: "Latest investor relations announcement and company developments",
  },
  {
    id: "about" as const,
    icon: Building2,
    title: "About the Company",
    description: "Company overview, business segments, leadership team, and corporate information",
  },
];

const ResearchCards = () => {
  const [activeDocument, setActiveDocument] = useState<DocumentType>(null);

  // Track document views with proper error handling
  useEffect(() => {
    const trackView = async () => {
      if (activeDocument) {
        const sessionId = sessionStorage.getItem('_sid');
        const visitorId = localStorage.getItem('_vid');
        const subscriberId = localStorage.getItem('_sub_id');
        
        // Ensure subscriber_id is null (not empty string) if not set - UUID column requires valid UUID or null
        const validSubscriberId = subscriberId && subscriberId.length > 0 ? subscriberId : null;
        
        console.log('[Document Engagement] Tracking view:', { 
          document_type: activeDocument, 
          session_id: sessionId, 
          visitor_id: visitorId, 
          subscriber_id: validSubscriberId 
        });
        
        const { data, error } = await supabase.from('document_engagement').insert([{
          session_id: sessionId,
          visitor_id: visitorId,
          subscriber_id: validSubscriberId,
          document_type: activeDocument,
          action: 'view',
        }]).select();
        
        if (error) {
          console.error('[Document Engagement] Insert error:', error);
        } else {
          console.log('[Document Engagement] Success:', data);
        }
      }
    };
    trackView();
  }, [activeDocument]);

  return (
    <>
      <section className="bg-card py-14 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Research Materials
            </h2>
            <p className="text-muted-foreground">
              Access comprehensive analysis prepared by Omnia Capital Partners
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {researchMaterials.map((item) => (
              <div key={item.id} className="research-card">
                {/* Icon */}
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Button */}
                <div className="flex justify-center">
                  <Button 
                    variant="default"
                    className="btn-navy gap-2 px-8"
                    onClick={() => setActiveDocument(item.id as DocumentType)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Viewers */}
      <DocumentViewer
        isOpen={activeDocument === "report"}
        onClose={() => setActiveDocument(null)}
        title="BBLC Full Research Report"
        documentType="report"
      >
        <BBLCReportContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "tearsheet"}
        onClose={() => setActiveDocument(null)}
        title="BBLC Executive Tear Sheet"
        documentType="tearsheet"
      >
        <BBLCTearSheetContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "pressrelease"}
        onClose={() => setActiveDocument(null)}
        title="BBLC Press Release"
        documentType="pressrelease"
      >
        <BBLCPressReleaseContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "about"}
        onClose={() => setActiveDocument(null)}
        title="About Blockchain Loyalty Corp."
        documentType="about"
      >
        <BBLCAboutContent />
      </DocumentViewer>

    </>
  );
};

export default ResearchCards;
