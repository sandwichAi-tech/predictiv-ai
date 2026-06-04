import { CalendarClock, Globe2, Layers } from "lucide-react";

const points = [
  {
    icon: CalendarClock,
    label: "Dated Catalyst",
    body: "Arcasia JV definitive agreements expected Q2 2026 — the catalyst is on the calendar, not theoretical.",
  },
  {
    icon: Globe2,
    label: "Three Channels",
    body: "Triple-listed CSE + OTC + Frankfurt opens North American retail, US, and European institutional channels simultaneously.",
  },
  {
    icon: Layers,
    label: "Three Products",
    body: "Three commercial vertical-AI products generating revenue today — not a one-product bet on a single roadmap.",
  },
];

const WhyNow = () => {
  return (
    <section className="bg-background py-14 md:py-20 px-5 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
            Why Now
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-10 max-w-2xl">
          Catalyst, channel, and product breadth.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {points.map(({ icon: Icon, label, body }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-md p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {label}
                </span>
              </div>
              <p className="font-serif text-lg leading-snug text-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNow;
