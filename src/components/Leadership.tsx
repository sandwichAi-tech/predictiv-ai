import { User, Briefcase } from "lucide-react";

const team = [
  {
    name: "Suman Pushparajah",
    role: "Chief Executive Officer & Director",
    description: "Leading product strategy across Shift, Shiftmatics and CloudRep, and driving the Shift × Arcasia JV rollout",
    icon: User,
  },
  {
    name: "Khurram Qureshi",
    role: "Finance & Capital Markets",
    description: "Capital strategy, public-markets stewardship and dual-listed (CSE/FWB) reporting oversight",
    icon: Briefcase,
  },
];

const shareStructure = [
  { label: "Shares Outstanding", value: "118.3M" },
  { label: "Market Cap", value: "~C$15.98M" },
  { label: "Listings", value: "CSE · FWB" },
  { label: "CSE Listing", value: "Dec 2025" },
];

const Leadership = () => {
  return (
    <section className="bg-card py-14 px-5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
          Leadership & Governance
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Experienced team executing across six vertical AI product lines
        </p>
        
        {/* Leadership Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10 max-w-2xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="leadership-card">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <member.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-center mb-1">{member.name}</h3>
              <p className="text-sm text-primary text-center mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground text-center">{member.description}</p>
            </div>
          ))}
        </div>
        
        {/* Share Structure */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground text-center mb-6">Share Structure</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shareStructure.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Alignment Note */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Dual Listed</span> — CSE: PAI · FWB: 7IT · Investor Relations by AGORACOM
          </p>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
