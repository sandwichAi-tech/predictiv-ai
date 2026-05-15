import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Mention {
  source: 'StockTwits' | 'Reddit' | 'Google News' | 'Yahoo Finance';
  author?: string;
  title: string;
  body?: string;
  url: string;
  created_at: string; // ISO
  sentiment?: 'Bullish' | 'Bearish' | null;
}

const SYMBOL = 'PAI';
const COMPANY = 'Predictiv AI';
const UA = 'Mozilla/5.0 (compatible; SocialWhisperBot/1.0)';

async function fetchStockTwits(): Promise<Mention[]> {
  try {
    const r = await fetch(`https://api.stocktwits.com/api/2/streams/symbol/${SYMBOL}.json`, {
      headers: { 'User-Agent': UA },
    });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.messages ?? []).slice(0, 25).map((m: any) => ({
      source: 'StockTwits',
      author: m.user?.username,
      title: m.body?.slice(0, 140) ?? '',
      body: m.body,
      url: `https://stocktwits.com/${m.user?.username}/message/${m.id}`,
      created_at: m.created_at,
      sentiment: m.entities?.sentiment?.basic ?? null,
    }));
  } catch { return []; }
}

async function fetchReddit(): Promise<Mention[]> {
  const queries = [`%24${SYMBOL}`, `"${COMPANY}"`];
  const out: Mention[] = [];
  for (const q of queries) {
    try {
      const r = await fetch(
        `https://www.reddit.com/search.json?q=${q}&sort=new&limit=15&restrict_sr=&t=month`,
        { headers: { 'User-Agent': UA } },
      );
      if (!r.ok) continue;
      const j = await r.json();
      for (const c of j.data?.children ?? []) {
        const d = c.data;
        out.push({
          source: 'Reddit',
          author: `u/${d.author} · r/${d.subreddit}`,
          title: d.title,
          body: d.selftext?.slice(0, 280),
          url: `https://reddit.com${d.permalink}`,
          created_at: new Date(d.created_utc * 1000).toISOString(),
        });
      }
    } catch {}
  }
  // dedupe by url
  const seen = new Set<string>();
  return out.filter(m => (seen.has(m.url) ? false : (seen.add(m.url), true)));
}

function parseRss(xml: string, source: Mention['source']): Mention[] {
  const items: Mention[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const x = m[1];
    const get = (tag: string) => {
      const r = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`).exec(x);
      return r ? r[1].trim() : '';
    };
    const title = get('title').replace(/<[^>]+>/g, '');
    const link = get('link');
    const pub = get('pubDate');
    const desc = get('description').replace(/<[^>]+>/g, '').slice(0, 280);
    const src = get('source').replace(/<[^>]+>/g, '');
    if (title && link) {
      items.push({
        source,
        author: src || undefined,
        title,
        body: desc,
        url: link,
        created_at: pub ? new Date(pub).toISOString() : new Date().toISOString(),
      });
    }
  }
  return items;
}

async function fetchGoogleNews(): Promise<Mention[]> {
  try {
    const q = encodeURIComponent(`"${COMPANY}" OR "$${SYMBOL}" OR "CSE:PAI" OR "FWB:7IT"`);
    const r = await fetch(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`, {
      headers: { 'User-Agent': UA },
    });
    if (!r.ok) return [];
    return parseRss(await r.text(), 'Google News').slice(0, 20);
  } catch { return []; }
}

async function fetchYahooFinance(): Promise<Mention[]> {
  // Yahoo Finance per-symbol RSS (CSE listings appear as PAI.CN on Yahoo)
  const symbols = ['PAI.CN', '7IT.F'];
  const out: Mention[] = [];
  for (const s of symbols) {
    try {
      const r = await fetch(`https://feeds.finance.yahoo.com/rss/2.0/headline?s=${s}&region=US&lang=en-US`, {
        headers: { 'User-Agent': UA },
      });
      if (!r.ok) continue;
      out.push(...parseRss(await r.text(), 'Yahoo Finance').slice(0, 10).map(m => ({ ...m, author: s })));
    } catch {}
  }
  return out;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const [st, rd, gn, yf] = await Promise.all([
      fetchStockTwits(),
      fetchReddit(),
      fetchGoogleNews(),
      fetchYahooFinance(),
    ]);
    const mentions = [...st, ...rd, ...gn, ...yf]
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

    const counts = {
      stocktwits: st.length,
      reddit: rd.length,
      google_news: gn.length,
      yahoo_finance: yf.length,
      total: mentions.length,
    };

    return new Response(JSON.stringify({ counts, mentions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), mentions: [], counts: {} }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
