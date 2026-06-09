import { X, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentType?: string;
  children: React.ReactNode;
}

const DocumentViewer = ({ isOpen, onClose, title, documentType, children }: DocumentViewerProps) => {
  const trackShare = async () => {
    if (!documentType) return;
    
    const sessionId = sessionStorage.getItem('_sid');
    const visitorId = localStorage.getItem('_vid');
    const subscriberId = localStorage.getItem('_sub_id');
    
    const { error } = await supabase.from('document_engagement').insert([{
      session_id: sessionId,
      visitor_id: visitorId,
      subscriber_id: subscriberId || null,
      document_type: documentType,
      action: 'share',
    }]);
    
    if (error) console.error('Share tracking error:', error);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Predictiv AI Research: ${title}`,
      text: `Institutional research on Predictiv AI Inc. - ${title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        await trackShare();
      } catch (err) {
        // User cancelled or error - silently ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
        await trackShare();
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90dvh] max-h-[90dvh] p-0 gap-0 !flex flex-col overflow-hidden [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-background flex-shrink-0">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Research Document</span>
            <h2 className="text-base sm:text-lg font-semibold text-primary truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Share document"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close document"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Content - Native scrolling for iOS compatibility */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-8">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-border bg-muted/50 text-center flex-shrink-0 document-viewer-footer">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Prepared by Predictiv AI Inc. · For Informational Purposes Only
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
