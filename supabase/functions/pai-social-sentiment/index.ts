// PAI Media Sentiment — aggregates Google News RSS and deterministically scores
// each headline. Scoring is rule-based (not AI) so the number does NOT
// fluctuate between refreshes.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Post = {
  source: "news";
  id: string;
  author?: string;
  text: string;
  url: string;
  created_at: string;
};

type ScoredPost = Post & {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
};

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const BLOCKLIST = ["agoracom"];

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml: string, idPrefix: string, defaultPublisher?: string): Post[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 30);
  const posts: Post[] = [];
  for (const m of items) {
    const block = m[1];
    const grab = (tag: string) => {
      const mm = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      if (!mm) return "";
      return mm[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
    };
    const title = stripHtml(grab("title"));
    if (!title) continue;
    const linkRaw = grab("link");
    const pubDate = grab("pubDate");
    const desc = stripHtml(grab("description"));
    const srcMatch = block.match(/<source[^>]*url="([^"]+)"/);
    const link = srcMatch?.[1] || linkRaw;
    const publisher = stripHtml(grab("source")) || defaultPublisher;

    const lower = (title + " " + desc).toLowerCase();
    if (BLOCKLIST.some((b) => lower.includes(b))) continue;
    if (!/predictiv|cse:?pai|pcivf|cloudrep|shiftmatics/i.test(title + " " + desc)) continue;

    posts.push({
      source: "news",
      id: `${idPrefix}-${(link || title).slice(0, 80)}`,
      author: publisher || undefined,
      text: title,
      url: link,
      created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }
  return posts;
}

async function tryFetch(url: string, label: string): Promise<string | null> {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!r.ok) { console.log(`${label}: HTTP ${r.status}`); return null; }
    return await r.text();
  } catch (e) {
    console.error(`${label} error`, e);
    return null;
  }
}

async function fetchGoogleNews(): Promise<Post[]> {
  const posts: Post[] = [];
  const seen = new Set<string>();
  const addAll = (items: Post[]) => {
    for (const p of items) {
      const key = p.text.toLowerCase().slice(0, 60);
      if (!seen.has(key)) { posts.push(p); seen.add(key); }
    }
  };

  const yahooTickers = ["PCIVF", "PAI.CN", "7IT.F", "7IT.DE"];
  for (const t of yahooTickers) {
    const xml = await tryFetch(
      `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${t}&region=US&lang=en-US`,
      `Yahoo:${t}`
    );
    if (xml) addAll(parseRssItems(xml, `yh-${t.toLowerCase()}`, "Yahoo Finance"));
  }

  const yahooSearch = await tryFetch(
    `https://feeds.finance.yahoo.com/rss/2.0/category-stocks?s=${encodeURIComponent("Predictiv AI")}`,
    "Yahoo:search"
  );
  if (yahooSearch) addAll(parseRssItems(yahooSearch, "yh-s", "Yahoo Finance"));

  const bing = await tryFetch(
    `https://www.bing.com/news/search?q=${encodeURIComponent('"Predictiv AI" OR "CloudRep" OR "Shiftmatics" OR "PCIVF" OR "CSE:PAI"')}&format=rss`,
    "Bing"
  );
  if (bing) addAll(parseRssItems(bing, "bn"));

  const q = encodeURIComponent('"Predictiv AI" OR "CSE:PAI" OR "PCIVF" OR "CloudRep" OR "Shiftmatics"');
  const gn = await tryFetch(
    `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`,
    "Google"
  );
  if (gn) addAll(parseRssItems(gn, "gn"));

  return posts;
}

const POSITIVE_KEYWORDS: Array<[RegExp, number]> = [
  [/\b(joint venture|strategic partnership|partners with|enters? (into )?(a )?(strategic )?(joint venture|partnership|agreement))\b/i, 0.7],
  [/\b(expands?|expansion|scales?|scaling)\b/i, 0.5],
  [/\b(launches?|launching|introduces?|unveils?|rolls? out|debuts?)\b/i, 0.55],
  [/\b(acquires?|acquisition|merger)\b/i, 0.6],
  [/\b(record|milestone|breakthrough|first-ever|exclusive)\b/i, 0.55],
  [/\b(revenue|orders?|contract|customers?|deployment|deployments?)\b/i, 0.4],
  [/\b(patent|patents|files? (a )?patent|granted patent)\b/i, 0.5],
  [/\b(uplist|uplisting|listed on|cross[- ]listed|begins trading|commences trading)\b/i, 0.6],
  [/\b(financing|raises?|closes? (a )?(private placement|round|financing))\b/i, 0.45],
  [/\b(award|awarded|recognized|wins?)\b/i, 0.5],
];
const NEGATIVE_KEYWORDS: Array<[RegExp, number]> = [
  [/\b(halt|halts?|halted|suspension|suspended|cease trade)\b/i, -0.8],
  [/\b(delist|delisted|delisting)\b/i, -0.8],
  [/\b(investigation|lawsuit|sued|fraud|sec (charges|enforcement)|breach)\b/i, -0.75],
  [/\b(default|bankruptcy|insolvency|going concern)\b/i, -0.8],
  [/\b(loss|losses|declines?|drops?|falls?|plunges?)\b/i, -0.45],
  [/\b(dilution|reverse split|going private)\b/i, -0.55],
  [/\b(resign(s|ed|ation)?|departs?|steps? down|fired|terminated)\b/i, -0.5],
  [/\b(recall|defect|injury|safety)\b/i, -0.55],
];
const NEUTRAL_KEYWORDS: Array<[RegExp, number]> = [
  [/\b(grant of options|option grant|stock options|annual general meeting|agm|files? (an? )?(annual|interim|quarterly|financial) (statement|report|filing))\b/i, 0.05],
  [/\b(name change|rebrand|cusip)\b/i, 0],
];

function scoreHeadline(text: string): { sentiment: "positive" | "negative" | "neutral"; score: number } {
  let score = 0;
  let matched = false;
  for (const [re, w] of POSITIVE_KEYWORDS) if (re.test(text)) { score += w; matched = true; }
  for (const [re, w] of NEGATIVE_KEYWORDS) if (re.test(text)) { score += w; matched = true; }
  for (const [re, w] of NEUTRAL_KEYWORDS) if (re.test(text)) { score += w; matched = true; }
  score = Math.max(-1, Math.min(1, score));
  if (!matched) return { sentiment: "neutral", score: 0 };
  if (score >= 0.2) return { sentiment: "positive", score };
  if (score <= -0.2) return { sentiment: "negative", score };
  return { sentiment: "neutral", score };
}

let cache: { at: number; data: any } | null = null;
const CACHE_MS = 30 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    if (!force && cache && Date.now() - cache.at < CACHE_MS && cache.data?.counts?.total > 0) {
      return new Response(JSON.stringify({ ...cache.data, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gn = await fetchGoogleNews();
    const scored: ScoredPost[] = gn.map((p) => ({ ...p, ...scoreHeadline(p.text) }));

    const positive = scored.filter((p) => p.sentiment === "positive").length;
    const negative = scored.filter((p) => p.sentiment === "negative").length;
    const neutral = scored.filter((p) => p.sentiment === "neutral").length;
    const total = scored.length;
    const avgScore = total > 0 ? scored.reduce((s, p) => s + p.score, 0) / total : 0;
    const netSentiment = Math.round(avgScore * 100);

    const sorted = scored.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));

    const payload = {
      generated_at: new Date().toISOString(),
      sources: { stocktwits: 0, reddit: 0, news: gn.length },
      counts: { positive, negative, neutral, total },
      net_sentiment: netSentiment,
      avg_score: avgScore,
      posts: sorted.slice(0, 40),
      premium_note: "X / Twitter firehose, TikTok and Discord coverage available as a paid add-on ($400/mo).",
    };

    cache = { at: Date.now(), data: payload };
    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pai-social-sentiment error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
