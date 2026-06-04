// Returns daily $PAI combined trading volume + close across all three listings:
// CSE (PAI.CN), OTC (PCIVF), Frankfurt (7IT.F). Aggregated by date.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Bar { date: string; volume: number; close: number; }
interface ExchangeBars { symbol: string; exchange: string; bars: Bar[]; total: number; error?: string; }

const LISTINGS = [
  { symbol: 'PAI.CN', exchange: 'CSE' },
  { symbol: 'PCIVF', exchange: 'OTC' },
  { symbol: '7IT.F', exchange: 'FWB' },
];

async function fetchListing(symbol: string, exchange: string, range: string): Promise<ExchangeBars> {
  try {
    const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`;
    const res = await fetch(yUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!res.ok) return { symbol, exchange, bars: [], total: 0, error: `HTTP ${res.status}` };
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) return { symbol, exchange, bars: [], total: 0, error: 'no chart data' };
    const ts: number[] = result.timestamp || [];
    const q = result.indicators?.quote?.[0] || {};
    const vols: (number | null)[] = q.volume || [];
    const closes: (number | null)[] = q.close || [];
    const bars: Bar[] = ts.map((t, i) => ({
      date: new Date(t * 1000).toISOString().slice(0, 10),
      volume: vols[i] ?? 0,
      close: closes[i] ?? 0,
    })).filter(b => b.volume > 0);
    const total = bars.reduce((s, b) => s + b.volume, 0);
    return { symbol, exchange, bars, total };
  } catch (e) {
    return { symbol, exchange, bars: [], total: 0, error: e instanceof Error ? e.message : 'unknown' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    let days = parseInt(url.searchParams.get('days') || '30', 10);
    if (!Number.isFinite(days) || days < 1) days = 30;
    if (days > 365) days = 365;

    const range =
      days <= 5 ? '5d' :
      days <= 30 ? '1mo' :
      days <= 90 ? '3mo' :
      days <= 180 ? '6mo' : '1y';

    const results = await Promise.all(LISTINGS.map(l => fetchListing(l.symbol, l.exchange, range)));

    const byDate = new Map<string, { volume: number; close: number; breakdown: Record<string, number> }>();
    for (const r of results) {
      for (const b of r.bars) {
        const existing = byDate.get(b.date) ?? { volume: 0, close: 0, breakdown: {} };
        existing.volume += b.volume;
        existing.breakdown[r.exchange] = (existing.breakdown[r.exchange] ?? 0) + b.volume;
        if (r.exchange === 'CSE') existing.close = b.close;
        else if (existing.close === 0) existing.close = b.close;
        byDate.set(b.date, existing);
      }
    }

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const merged = [...byDate.entries()]
      .map(([date, v]) => ({ date, volume: v.volume, close: v.close, breakdown: v.breakdown }))
      .filter(b => new Date(b.date).getTime() >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));

    return new Response(
      JSON.stringify({
        symbol: '$PAI (combined)',
        listings: results.map(r => ({ symbol: r.symbol, exchange: r.exchange, total: r.total, error: r.error })),
        bars: merged,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return new Response(JSON.stringify({ error: msg, bars: [], listings: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
