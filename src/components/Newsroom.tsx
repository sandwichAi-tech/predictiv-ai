import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
}

const formatDate = (raw: string) => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const Newsroom = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("otc-markets-news");
        if (!cancelled && !error && data?.news) {
          setNews(data.news);
        }
      } catch (e) {
        console.error("Newsroom load error", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="newsroom" className="bg-background py-16 px-5 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-primary mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            Press Releases
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Newsroom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            The latest corporate announcements, press releases, and updates from Predictiv AI Inc. (CSE: PAI / FWB: 7IT).
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  try {
                    await supabase.from("analytics_events").insert({
                      event_type: "news_click",
                      visitor_id: localStorage.getItem("_vid"),
                      session_id: sessionStorage.getItem("_sid"),
                      page_url: window.location.href,
                      event_data: { title: item.title, link: item.link, source: item.source || null },
                    });
                  } catch (e) {
                    console.error("news_click track error", e);
                  }
                }}
                className="block bg-card border border-border rounded-lg p-5 md:p-6 hover:border-primary/60 transition-all group shadow-card hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.pubDate)}
                      </span>
                      {item.source && (
                        <>
                          <span className="opacity-50">·</span>
                          <span className="uppercase tracking-wider">{item.source}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Official company announcements from Predictiv AI Inc. For media inquiries, please contact AGORACOM Investor Relations.
        </p>
      </div>
    </section>
  );
};

export default Newsroom;
