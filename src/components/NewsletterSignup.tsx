import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Shield, FileText, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail } from "@/lib/emailValidation";
import { getSessionId, getVisitorId } from "@/lib/visitorIdentity";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type CTAVariant = "report" | "news" | "coverage";

interface NewsletterSignupProps {
  ctaVariant?: CTAVariant;
  compact?: boolean;
  source?: string;
  eyebrow?: string;
  headline?: string;
  subhead?: string;
}

const CTA_COPY: Record<CTAVariant, string> = {
  report: "Send Me the Full Research Report",
  news: "Track PAI · Get Material News First",
  coverage: "Access Institutional Coverage on PAI",
};

const NewsletterSignup = ({
  ctaVariant,
  compact = false,
  source = "landing_page",
  eyebrow = "Conversion",
  headline = "Institutional coverage on PAI, delivered.",
  subhead = "One email. Material news, the full research report PDF, and catalyst updates as the Arcasia JV develops.",
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [variant, setVariant] = useState<CTAVariant>("report");
  const { toast } = useToast();

  useEffect(() => {
    if (ctaVariant) {
      setVariant(ctaVariant);
      return;
    }
    const vid = localStorage.getItem("_vid") || "";
    const seed = Array.from(vid).reduce((a, c) => a + c.charCodeAt(0), 0);
    const variants: CTAVariant[] = ["report", "news", "coverage"];
    setVariant(variants[seed % 3]);
  }, [ctaVariant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      toast({
        title: "Invalid email",
        description: emailValidation.reason,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source");
      const utmMedium = urlParams.get("utm_medium");
      const utmCampaign = urlParams.get("utm_campaign");

      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: email.trim().toLowerCase(),
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          source,
          ctaVariant: variant,
          utmSource,
          utmMedium,
          utmCampaign,
        },
      });

      if (error) throw error;

      if (data?.error === "rate_limited") {
        toast({
          title: "Too many attempts",
          description: "Please wait an hour before trying again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data?.error === "duplicate") {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data?.error) throw new Error(data.message || "Signup failed");

      if (data?.subscriberId) {
        localStorage.setItem("_sub_id", data.subscriberId);
      }

      setSubmittedEmail(email.trim().toLowerCase());
      setIsSuccess(true);
      setShowConfirm(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sectionPad = compact ? "py-10 md:py-14" : "py-16 md:py-20";

  if (isSuccess) {
    return (
      <section className={`bg-card text-foreground ${sectionPad} px-5 border-y border-border/30`}>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-accent-foreground" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            You've been added.
          </h2>
          <p className="text-foreground/70">
            You're on the PAI institutional coverage list. Material news and catalyst updates will be sent here as they happen.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-card text-foreground ${sectionPad} px-5 border-y border-border/30 relative`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-accent block mb-3">
            {eyebrow}
          </span>
          <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-3 leading-tight">
            {headline}
          </h2>
          <p className="text-foreground/70 text-base md:text-lg max-w-xl mx-auto">
            {subhead}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@firm.com"
            required
            aria-label="Email address"
            className="flex-1 px-4 py-4 bg-secondary border border-border rounded focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-foreground placeholder:text-muted-foreground font-mono text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-4 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold rounded transition-colors whitespace-nowrap uppercase tracking-wider text-sm"
          >
            {isLoading ? "Sending…" : CTA_COPY[variant]}
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 text-foreground/60 text-xs">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-accent" />
            Email only · No phone required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            No spam, ever
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent" />
            Unsubscribe anytime
          </span>
        </div>

        <p className="text-center text-foreground/40 text-[11px] mt-5 max-w-lg mx-auto">
          By subscribing you agree to receive research communications from Predictiv AI Inc.
          Your information will not be sold or shared with third parties.
        </p>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md bg-card border border-accent/40">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <DialogTitle className="font-serif text-2xl text-foreground leading-tight">
              You're confirmed.
            </DialogTitle>
            <DialogDescription className="text-foreground/70 pt-1">
              We've added <span className="font-mono text-accent">{submittedEmail}</span> to the PAI institutional coverage list.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded border border-border bg-background/40">
              <FileText className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-0.5">
                  Research material
                </div>
                <div className="text-sm text-foreground/90">
                  The full PAI research report PDF will arrive in your inbox shortly.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded border border-border bg-background/40">
              <Newspaper className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-0.5">
                  Material news
                </div>
                <div className="text-sm text-foreground/90">
                  You'll be alerted to every CSE / FWB filing and Arcasia JV catalyst as they happen.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(false)}
            className="w-full mt-4 px-4 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded transition-colors uppercase tracking-wider text-sm"
          >
            Got it
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsletterSignup;
