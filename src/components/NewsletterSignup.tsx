import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail } from "@/lib/emailValidation";

const NewsletterSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptedIn, setSmsOptedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

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

      const phoneDigits = phone.replace(/\D/g, '');
      const formattedPhone = phoneDigits ? `+1${phoneDigits}` : null;

      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          firstName: firstName.trim(),
          email: email.trim().toLowerCase(),
          phone: formattedPhone,
          smsOptedIn: smsOptedIn && !!formattedPhone,
          source: "landing_page",
          utmSource,
          utmMedium,
          utmCampaign,
        },
      });

      if (error) {
        throw error;
      }

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

      if (data?.error) {
        throw new Error(data.message || "Signup failed");
      }

      if (data?.subscriberId) {
        localStorage.setItem('_sub_id', data.subscriberId);
      }
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="bg-card py-16 px-5 border-y border-border">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 glow-green">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            You're on the List
          </h2>
          <p className="text-muted-foreground">
            Watch your inbox for research updates and alerts.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card py-16 px-5 border-y border-border">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Stay Updated
          </h2>
          <p className="text-muted-foreground text-lg">
            Get research alerts, material news, and portfolio updates delivered directly.
          </p>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-background border border-border rounded-lg p-6 md:p-8"
        >
          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full px-4 py-3 bg-card border border-border rounded focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-muted-foreground text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 bg-card border border-border rounded focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Row 2: Phone */}
          <div className="mb-4">
            <label className="block text-muted-foreground text-sm font-medium mb-2">
              Mobile Number <span className="text-muted-foreground/50">(Optional - for SMS alerts)</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-card border border-r-0 border-border rounded-l text-muted-foreground font-medium">
                +1
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 123-4567"
                maxLength={14}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-r focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* SMS Opt-in Checkbox */}
          {phone && (
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={smsOptedIn}
                    onChange={(e) => setSmsOptedIn(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-colors ${
                    smsOptedIn 
                      ? 'bg-primary border-primary' 
                      : 'bg-card border-border group-hover:border-muted-foreground'
                  }`}>
                    {smsOptedIn && (
                      <svg className="w-full h-full text-primary-foreground p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-muted-foreground text-sm leading-tight">
                  Yes, send me SMS alerts for breaking news and time-sensitive updates.
                  <span className="text-muted-foreground/50"> Message & data rates may apply. Reply STOP to unsubscribe.</span>
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary hover:bg-green-light disabled:bg-muted text-primary-foreground font-bold rounded transition-colors text-lg glow-green"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Subscribing...
              </span>
            ) : (
              'Get Research Alerts'
            )}
          </button>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-primary" />
              Secure & Encrypted
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              No Spam, Ever
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-primary" />
              Unsubscribe Anytime
            </span>
          </div>
        </form>

        {/* Regulatory Fine Print */}
        <p className="text-center text-muted-foreground/40 text-xs mt-6 max-w-lg mx-auto">
          By subscribing, you agree to receive research communications from Omnia Capital Partners Ltd. 
          Your information will not be sold or shared with third parties.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
