import Hero from "@/components/Hero";
import MetricsBar from "@/components/MetricsBar";
import MarketData from "@/components/MarketData";
import PodcastPlayer from "@/components/PodcastPlayer";
import ResearchCards from "@/components/ResearchCards";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import CatalystTimeline from "@/components/CatalystTimeline";
import CompetitiveLandscape from "@/components/CompetitiveLandscape";
import Leadership from "@/components/Leadership";
import Divisions from "@/components/Divisions";
import NewsletterSignup from "@/components/NewsletterSignup";
import TrustSignals from "@/components/TrustSignals";
import Disclosures from "@/components/Disclosures";
import Footer from "@/components/Footer";
import { useStockQuotes } from "@/hooks/useStockQuotes";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { quotes, loading } = useStockQuotes();
  const otcPrice = quotes['BBLC']?.price;
  
  useAnalytics();

  return (
    <main className="min-h-screen bg-background">
      <Hero currentPrice={otcPrice} priceLoading={loading} />
      <MetricsBar />
      <MarketData quotes={quotes} quotesLoading={loading} />
      <PodcastPlayer />
      <ResearchCards />
      <InvestmentHighlights />
      <CatalystTimeline />
      <CompetitiveLandscape />
      <Leadership />
      <Divisions />
      <NewsletterSignup />
      <TrustSignals />
      <Disclosures />
      <Footer />
    </main>
  );
};

export default Index;
