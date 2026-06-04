import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail } from "@/lib/emailValidation";
import { getSessionId, getVisitorId } from "@/lib/visitorIdentity";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface DocumentGateProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  documentTitle: string;
}

const DocumentGate = ({ open, onClose, onUnlock, documentTitle }: DocumentGateProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateEmail(email);
    if (!v.valid) {
      toast({ title: "Invalid email", description: v.reason, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: email.trim().toLowerCase(),
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          source: `document_gate:${documentTitle}`,
        },
      });
      if (data?.subscriberId) localStorage.setItem("_sub_id", data.subscriberId);
      onUnlock();
    } catch (err) {
      console.error(err);
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-accent" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent">
              One Field · No Friction
            </span>
          </div>
          <DialogTitle className="font-serif text-2xl text-foreground leading-tight text-left">
            Enter your email to open the {documentTitle}.
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@firm.com"
            className="w-full px-4 py-3 bg-background border border-border rounded focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded transition-colors"
          >
            {loading ? "Opening…" : "Open Document"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            Document opens immediately in the same window. We add you to material-news alerts.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentGate;
