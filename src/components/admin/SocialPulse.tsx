import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, MessageSquare, Newspaper, Hash, Lock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Post = {
  source: "stocktwits" | "reddit" | "news";
  id: string;
  author?: string;
  text: string;
  url: string;
  created_at: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
};

type Payload = {
  generated_at: string;
  sources: { stocktwits: number; reddit: number; news: number };
  counts: { positive: number; negative: number; neutral: number; total: number };
  net_sentiment: number;
  avg_score: number;
  posts: Post[];
  premium_note: string;
  cached?: boolean;
};

const sourceIcon = { stocktwits: Hash, reddit: MessageSquare, news: Newspaper } as const;
const sourceLabel = { stocktwits: "StockTwits", reddit: "Reddit", news: "News" } as const;

export default function SocialPulse({ viewMode }: { viewMode: "issuer" | "ops" }) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: d, error: e } = await supabase.functions.invoke("pai-social-sentiment");
      if (e) throw e;
      setData(d as Payload);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load sentiment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const net = data?.net_sentiment ?? 0;
  const netColor = net >= 25 ? "text-emerald-500" : net <= -25 ? "text-red-500" : "text-amber-500";
  const netLabel =
    net >= 50 ? "Strongly Bullish" :
    net >= 25 ? "Bullish" :
    net > -25 ? "Mixed / Neutral" :
    net > -50 ? "Bearish" : "Strongly Bearish";

  const filteredPosts = (data?.posts ?? []).filter((p) => filter === "all" ? true : p.sentiment === filter);

  return (
    <div className="bg-card rounded-xl border border-cyan-500/30 p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            $PAI Media Sentiment
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Press & news coverage from <strong>Google News</strong> · deterministic rule-based scoring · cached 30 min.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-500 hover:text-cyan-400 disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          {loading ? "Loading" : "Refresh"}
        </button>
      </div>

      {viewMode === "issuer" && (
        <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] text-amber-200/90">
            <strong className="text-amber-400">Premium add-on — $400/mo:</strong> Add X (Twitter) firehose, StockTwits, Reddit, TikTok, and Discord coverage. Contact IR to upgrade.
          </span>
        </div>
      )}

      {error && <div className="text-sm text-red-500 mb-4">Error: {error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="bg-background/40 rounded-lg border border-cyan-500/20 p-3 col-span-2 md:col-span-1">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Net Sentiment</div>
          <div className={cn("text-3xl font-bold font-mono", netColor)}>{net > 0 ? "+" : ""}{net}</div>
          <div className={cn("text-[10px] uppercase tracking-wider", netColor)}>{netLabel}</div>
        </div>
        <div className="bg-background/40 rounded-lg border p-3">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Total Mentions</div>
          <div className="text-2xl font-bold font-mono text-foreground">{data?.counts.total ?? 0}</div>
          <div className="text-[10px] text-muted-foreground">last ~24-48h</div>
        </div>
        <button
          onClick={() => setFilter(filter === "positive" ? "all" : "positive")}
          className={cn("bg-background/40 rounded-lg border p-3 text-left transition-colors",
            filter === "positive" ? "border-emerald-500" : "border-emerald-500/20 hover:border-emerald-500/50")}
        >
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Positive
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-500">{data?.counts.positive ?? 0}</div>
        </button>
        <button
          onClick={() => setFilter(filter === "negative" ? "all" : "negative")}
          className={cn("bg-background/40 rounded-lg border p-3 text-left transition-colors",
            filter === "negative" ? "border-red-500" : "border-red-500/20 hover:border-red-500/50")}
        >
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-500" /> Negative
          </div>
          <div className="text-2xl font-bold font-mono text-red-500">{data?.counts.negative ?? 0}</div>
        </button>
        <button
          onClick={() => setFilter(filter === "neutral" ? "all" : "neutral")}
          className={cn("bg-background/40 rounded-lg border p-3 text-left transition-colors",
            filter === "neutral" ? "border-muted-foreground" : "border-border hover:border-muted-foreground/50")}
        >
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Minus className="w-3 h-3" /> Neutral
          </div>
          <div className="text-2xl font-bold font-mono text-muted-foreground">{data?.counts.neutral ?? 0}</div>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>Sources:</span>
        <span className="flex items-center gap-1"><Newspaper className="w-3 h-3" /> News {data?.sources.news ?? 0}</span>
        {data?.cached && <span className="text-cyan-500">● cached</span>}
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {loading && !data && <p className="text-sm text-muted-foreground">Loading worldwide chatter…</p>}
        {!loading && filteredPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} mentions found. For a micro-cap, sparse chatter is normal — and that's part of the "early/undiscovered" narrative.
          </p>
        )}
        {filteredPosts.map((p) => {
          const Icon = sourceIcon[p.source];
          const sentColor =
            p.sentiment === "positive" ? "border-emerald-500/40 bg-emerald-500/5" :
            p.sentiment === "negative" ? "border-red-500/40 bg-red-500/5" :
            "border-border bg-background/30";
          const sentBadge =
            p.sentiment === "positive" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
            p.sentiment === "negative" ? "bg-red-500/20 text-red-400 border-red-500/30" :
            "bg-muted/30 text-muted-foreground border-border";
          return (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("block rounded-md border p-2.5 hover:bg-background/60 transition-colors", sentColor)}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <Icon className="w-3 h-3" />
                  <span>{sourceLabel[p.source]}</span>
                  {p.author && <span className="text-foreground/70">@{p.author}</span>}
                  <span>·</span>
                  <span>{new Date(p.created_at).toLocaleString()}</span>
                </div>
                <span className={cn("text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border", sentBadge)}>
                  {p.sentiment} {p.score !== 0 && `(${p.score > 0 ? "+" : ""}${p.score.toFixed(2)})`}
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-snug">{p.text}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
