import Hero2 from "@/components/Hero2";
import WhyNow from "@/components/WhyNow";
import PodcastPlayer from "@/components/PodcastPlayer";
import NewsletterSignup from "@/components/NewsletterSignup";
import MarketData from "@/components/MarketData";
import ResearchCards from "@/components/ResearchCards";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import CatalystTimeline from "@/components/CatalystTimeline";
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import Leadership from "@/components/Leadership";
import Divisions from "@/components/Divisions";
import RecentNews from "@/components/RecentNews";
import TrustSignals from "@/components/TrustSignals";
import Disclosures from "@/components/Disclosures";
import Footer from "@/components/Footer";
import ExitIntent from "@/components/ExitIntent";
import { useStockQuotes } from "@/hooks/useStockQuotes";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useReturnVisitor } from "@/hooks/useReturnVisitor";

const Hero2Preview = () => {
  const { quotes, loading } = useStockQuotes();
  const paiQuote = quotes["PAI"];

  useAnalytics();
  useReturnVisitor();

  return (
    <main className="min-h-screen bg-[hsl(220_65%_3%)]">
      <div className="max-w-[1080px] mx-auto bg-background border-x border-t border-border shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)]">
        {/* Preview banner */}
        <div className="bg-hot/10 border-b border-hot/40 px-4 py-2 text-center font-mono text-[10px] tracking-[0.22em] uppercase text-hot">
          /hero2 — Sticky Hero A/B Preview · Not Public
        </div>

        <Hero2 quote={paiQuote} priceLoading={loading} />

        <div className="border-t border-border">
          <MarketData quotes={quotes} quotesLoading={loading} />
        </div>

        <div id="newsletter" className="border-t border-border">
          <NewsletterSignup
            source="hero2_primary"
            eyebrow="Above the Fold"
            headline="Updates on PAI, delivered."
            subhead="One email. Material news, the full research report PDF, and dated catalyst updates."
          />
        </div>

        <div className="border-t border-border"><WhyNow /></div>
        <div className="border-t border-border"><PodcastPlayer /></div>

        <div className="border-t border-border">
          <NewsletterSignup
            source="hero2_post_podcast"
            compact
            ctaVariant="news"
            eyebrow="Stay on the Distribution"
            headline="Track PAI between releases."
            subhead="Material news, JV milestones, and triple-listing updates as they happen."
          />
        </div>

        <div id="research" className="border-t border-border"><ResearchCards /></div>
        <div className="border-t border-border"><InvestmentHighlights /></div>
        <div className="border-t border-border"><CatalystTimeline /></div>
        <div className="border-t border-border"><Divisions /></div>
        <div className="border-t border-border"><Leadership /></div>
        <div className="border-t border-border"><CompetitiveLandscape /></div>
        <div className="border-t border-border"><RecentNews /></div>
        <div className="border-t border-border"><TrustSignals /></div>
        <div className="border-t border-border"><Disclosures /></div>
        <div className="border-t border-border"><Footer /></div>
      </div>

      <ExitIntent />
    </main>
  );
};

export default Hero2Preview;
