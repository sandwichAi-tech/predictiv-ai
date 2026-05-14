import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

// Yahoo Finance symbols mapping
const symbolMap: Record<string, string> = {
  'PAI': 'PAI.CN',     // CSE
  '7IT': '7IT.F',      // Frankfurt
};

async function fetchYahooQuote(symbol: string): Promise<QuoteData | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    
    console.log(`Fetching quote for ${symbol} from Yahoo Finance`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo API error for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) {
      console.error(`No data found for ${symbol}`);
      return null;
    }
    
    const meta = result.meta;
    const indicators = result.indicators?.quote?.[0];
    
    // Get current price and previous close
    const currentPrice = meta.regularMarketPrice || 0;
    const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    
    // Get today's volume - sum of all volume data points or use regularMarketVolume
    let volume = meta.regularMarketVolume || 0;
    if (!volume && indicators?.volume) {
      volume = indicators.volume.reduce((sum: number, v: number | null) => sum + (v || 0), 0);
    }
    
    console.log(`${symbol}: price=${currentPrice}, volume=${volume}`);
    
    return {
      symbol,
      price: currentPrice,
      change,
      changePercent,
      volume
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const symbols = Object.keys(symbolMap);
    
    // Fetch all quotes in parallel
    const quotePromises = symbols.map(symbol => fetchYahooQuote(symbolMap[symbol]));
    const results = await Promise.all(quotePromises);
    
    // Build response object
    const quotes: Record<string, QuoteData | null> = {};
    symbols.forEach((symbol, index) => {
      quotes[symbol] = results[index];
    });
    
    console.log('Returning quotes:', JSON.stringify(quotes));
    
    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in stock-quote-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
