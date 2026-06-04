import { useState, useEffect } from "react";
import { FileText, BarChart3, Eye, Newspaper, Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentViewer from "./DocumentViewer";
import DocumentGate from "./DocumentGate";
import BBLCReportContent from "./documents/BBLCReportContent";
import BBLCTearSheetContent from "./documents/BBLCTearSheetContent";
import BBLCPressReleaseContent from "./documents/BBLCPressReleaseContent";
import BBLCAboutContent from "./documents/BBLCAboutContent";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getSubscriberId, getVisitorId } from "@/lib/visitorIdentity";

type DocumentType = "report" | "tearsheet" | "pressrelease" | "about" | null;

const GATED: Set<NonNullable<DocumentType>> = new Set(["report", "tearsheet"]);

const researchMaterials: {
  id: NonNullable<DocumentType>;
  icon: typeof FileText;
  title: string;
  description: string;
}[] = [
  {
    id: "report",
    icon: FileText,
    title: "Full Research Report",
    description: "Institutional deep dive — Shift, CloudRep, the Arcasia JV, scenarios, and risk.",
  },
  {
    id: "tearsheet",
    icon: BarChart3,
    title: "Executive Tear Sheet",
    description: "One-page summary with key metrics, catalysts, and thesis.",
  },
  {
    id: "pressrelease",
    icon: Newspaper,
    title: "Press Release",
    description: "Latest investor relations announcement.",
  },
  {
    id: "about",
    icon: Building2,
    title: "About the Company",
    description: "Overview, business segments, and leadership.",
  },
];

const ResearchCards = () => {
  const [activeDocument, setActiveDocument] = useState<DocumentType>(null);
  const [pendingDocument, setPendingDocument] = useState<DocumentType>(null);

  const requestDocument = (id: NonNullable<DocumentType>) => {
    const identified = !!localStorage.getItem("_sub_id");
    if (GATED.has(id) && !identified) {
      setPendingDocument(id);
    } else {
      setActiveDocument(id);
    }
  };

  useEffect(() => {
    const trackView = async () => {
      if (activeDocument) {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const subscriberId = getSubscriberId();
        const validSubscriberId = subscriberId && subscriberId.length > 0 ? subscriberId : null;
        const { error } = await supabase.from('document_engagement').insert([{
          session_id: sessionId,
          visitor_id: visitorId,
          subscriber_id: validSubscriberId,
          document_type: activeDocument,
          action: 'view',
        }]).select();
        if (error) console.error('[Document Engagement] Insert error:', error);
      }
    };
    trackView();
  }, [activeDocument]);

  return (
    <>
      <section className="bg-background py-14 md:py-20 px-5 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
              Research Materials
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3 max-w-2xl">
            Company Research
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Research and analysis only. Not investment advice.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {researchMaterials.map((item) => {
              const isGated = GATED.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-md p-6 shadow-card transition-shadow hover:shadow-card-hover flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-accent rounded-md flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    {isGated && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] uppercase text-accent">
                        <Lock className="w-3 h-3" /> Email gate
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <Button
                    variant="default"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 self-start"
                    onClick={() => requestDocument(item.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isGated ? "Open with Email" : "Open"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DocumentGate
        open={!!pendingDocument}
        onClose={() => setPendingDocument(null)}
        documentTitle={researchMaterials.find((m) => m.id === pendingDocument)?.title || ""}
        onUnlock={() => {
          const next = pendingDocument;
          setPendingDocument(null);
          setActiveDocument(next);
        }}
      />

      <DocumentViewer
        isOpen={activeDocument === "report"}
        onClose={() => setActiveDocument(null)}
        title="Predictiv AI — Full Research Report"
        documentType="report"
      >
        <BBLCReportContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "tearsheet"}
        onClose={() => setActiveDocument(null)}
        title="Predictiv AI — Executive Tear Sheet"
        documentType="tearsheet"
      >
        <BBLCTearSheetContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "pressrelease"}
        onClose={() => setActiveDocument(null)}
        title="Predictiv AI — Press Release"
        documentType="pressrelease"
      >
        <BBLCPressReleaseContent />
      </DocumentViewer>

      <DocumentViewer
        isOpen={activeDocument === "about"}
        onClose={() => setActiveDocument(null)}
        title="About Predictiv AI Inc."
        documentType="about"
      >
        <BBLCAboutContent />
      </DocumentViewer>
    </>
  );
};

export default ResearchCards;
