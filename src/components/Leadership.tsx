import sumanImg from "@/assets/suman-pushparajah-matched.png";
import sanaImg from "@/assets/sana-srithas.png";

const team = [
  {
    name: "Suman Pushparajah",
    role: "Chief Executive Officer & Director",
    description: "Seasoned public-company executive with 15+ years building and scaling tech ventures. Leads strategy across Shift, Shiftmatics and CloudRep, and drives the Shift × Arcasia JV rollout.",
    image: sumanImg,
  },
  {
    name: "Sana Srithas",
    role: "Chief Operating Officer & Director",
    description: "Co-Founder of Shift and HouseStack. Former Chief of Staff to a Member of Parliament and Director of Operations at a TSX Venture-listed company, leading operations across Canada.",
    image: sanaImg,
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
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto ring-2 ring-primary/40 ring-offset-2 ring-offset-card">
                <img
                  src={member.image}
                  alt={`${member.name} — ${member.role}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
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
            <span className="text-primary font-semibold">Dual Listed</span> — CSE: PAI · FWB: 7IT · Investor Relations by Omnia Capital Partners
          </p>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
