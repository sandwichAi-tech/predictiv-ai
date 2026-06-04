import { Check } from "lucide-react";

const signals = [
  "Issuer-Paid Communication",
  "Section 17(b) Disclosed",
  "No Investment Advice",
  "Full Risk Disclosure",
];

const TrustSignals = () => {
  return (
    <section className="bg-background py-6 px-5 border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {signals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">
                {signal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
