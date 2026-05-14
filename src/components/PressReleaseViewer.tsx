import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Share2, ExternalLink, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PressReleaseContent from "@/components/documents/PressReleaseContent";

interface PressReleaseViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PressReleaseViewer = ({ isOpen, onClose }: PressReleaseViewerProps) => {
  const isMobile = useIsMobile();
  const [viewTracked, setViewTracked] = useState(false);

  // Track view when opened
  useEffect(() => {
    if (isOpen && !viewTracked) {
      trackView();
      setViewTracked(true);
    }
    if (!isOpen) {
      setViewTracked(false);
    }
  }, [isOpen, viewTracked]);

  const trackView = async () => {
    try {
      const visitorId = localStorage.getItem("_vid") || crypto.randomUUID();
      const sessionId = sessionStorage.getItem("_sid") || crypto.randomUUID();
      const subscriberId = localStorage.getItem("_sub_id");

      await supabase.from("document_engagement").insert({
        document_type: "press_release",
        action: "view",
        visitor_id: visitorId,
        session_id: sessionId,
        subscriber_id: subscriberId || null,
      });
    } catch (error) {
      console.error("Error tracking press release view:", error);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = "BioVaxys Strengthens Scientific Team - New VP of R&D";

    try {
      // Track share
      const visitorId = localStorage.getItem("_vid") || crypto.randomUUID();
      const sessionId = sessionStorage.getItem("_sid") || crypto.randomUUID();
      const subscriberId = localStorage.getItem("_sub_id");

      await supabase.from("document_engagement").insert({
        document_type: "press_release",
        action: "share",
        visitor_id: visitorId,
        session_id: sessionId,
        subscriber_id: subscriberId || null,
      });

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Press release link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const ViewerContent = ({ isMobileDrawer = false }: { isMobileDrawer?: boolean }) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Premium Header */}
      <div className="flex-shrink-0 bg-primary border-b border-primary-foreground/20 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-destructive animate-pulse" />
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded">
              BREAKING NEWS
            </span>
          </div>
          <span className="hidden sm:inline text-primary-foreground/70 text-sm">
            December 15, 2026
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content with native scrolling */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        <div className="p-4 sm:p-6 md:p-8">
          <PressReleaseContent />
        </div>

        {/* Premium Disclaimer Footer - inside scrollable area */}
      <div className="border-t border-border bg-muted/50 px-4 sm:px-6 py-4 safe-area-bottom">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <ExternalLink className="h-3 w-3" />
            IMPORTANT NOTICE AND DISCLAIMER — OMNIA CAPITAL PARTNERS
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed space-y-2">
            <p>
              This press release is provided by <strong>Omnia Capital Partners</strong> for informational purposes only. The information contained herein does not constitute an offer to sell or a solicitation of an offer to buy any securities, nor shall there be any sale of securities in any jurisdiction in which such offer, solicitation, or sale would be unlawful.
            </p>
            <p>
              <strong>NO INVESTMENT ADVICE:</strong> This content is provided for general informational purposes only and should not be considered as investment advice. Omnia Capital Partners is not a registered investment adviser, broker-dealer, or financial planner. Readers should consult with their own financial advisors before making any investment decisions.
            </p>
            <p>
              <strong>COMPENSATION DISCLOSURE:</strong> Omnia Capital Partners and/or its affiliates may receive compensation in connection with the publication and distribution of this content. Such compensation may be in the form of cash, securities, or other consideration. This compensation creates a conflict of interest and should be considered when evaluating any information presented.
            </p>
            <p>
              <strong>OWNERSHIP DISCLOSURE:</strong> Omnia Capital Partners, its affiliates, officers, directors, and employees may hold positions in securities mentioned herein. Any such positions may be increased or decreased at any time without notice.
            </p>
            <p>
              <strong>FORWARD-LOOKING STATEMENTS:</strong> This release contains forward-looking statements that involve risks and uncertainties. Actual results may differ materially from those expressed or implied. The Company undertakes no obligation to update forward-looking statements except as required by law.
            </p>
            <p>
              <strong>INVESTMENT RISK:</strong> An investment in BioVaxys Technology Corp. (CSE: BIOV / OTCQB: BVAXF) is considered to be highly speculative and involves a high degree of risk. Investors should only invest funds they can afford to lose entirely.
            </p>
            <p className="pt-2 border-t border-border/50">
              © 2026 Omnia Capital Partners. All rights reserved. | Contact: ir@omniacap.ai
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[95dvh] max-h-[95dvh] overflow-hidden">
          <ViewerContent isMobileDrawer />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden bg-background flex flex-col">
        <VisuallyHidden>
          <DialogTitle>BioVaxys Scientific Team Announcement</DialogTitle>
          <DialogDescription>Breaking news: Former IMV VP of R&D Dr. Marianne Stanford joins BioVaxys as Scientific Advisor</DialogDescription>
        </VisuallyHidden>
        <ViewerContent />
      </DialogContent>
    </Dialog>
  );
};

export default PressReleaseViewer;
