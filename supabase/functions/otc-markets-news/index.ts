import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
}

// Fallback / featured BBLC press releases
const fallbackNews: NewsItem[] = [
  {
    title: "Blockchain Loyalty Corp. (BBLC) Announces Launch of Capistral - A Next-Generation Private Capital Platform Now Fully Operational",
    source: "ACCESS Newswire",
    pubDate: "2026-03-19",
    link: "https://www.otcmarkets.com/stock/BBLC/news",
    description: "PORTLAND, OR — Blockchain Loyalty Corp. (OTC: BBLC) today announced the official launch of Capistral, a fully developed and operational digital platform designed to connect private companies, investors, and shareholders through a streamlined capital engagement experience."
  },
  {
    title: "Blockchain Loyalty Corp. (OTC: BBLC) Provides Corporate Update On InfernoGrid AI Infrastructure Division And Koilink Fintech Platform",
    source: "ACCESS Newswire",
    pubDate: "2025-12-03",
    link: "https://www.otcmarkets.com/stock/BBLC/news",
    description: "PORTLAND, OR — Blockchain Loyalty Corp. (OTC:BBLC) is pleased to provide a corporate update on its technology strategy, highlighting progress on its AI infrastructure division, InfernoGrid, and its fintech platform, Koilink Technologies Inc."
  },
  {
    title: "Blockchain Loyalty Corp. Unveils InfernoGrid, A Bold New AI Infrastructure Division Creating a Global Marketplace for GPU Power",
    source: "ACCESS Newswire",
    pubDate: "2025-12-01",
    link: "https://www.otcmarkets.com/stock/BBLC/news",
    description: "PORTLAND, OR — Blockchain Loyalty Corp. (OTC:BBLC) announces the launch of InfernoGrid, a breakthrough AI Infrastructure Division designed to reshape how the world accesses GPU compute power. InfernoGrid introduces a first-of-its-kind global marketplace where nearly anyone can rent out unused GPU capacity, while AI developers gain instant access to the computing resources they urgently need."
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rssUrl = 'https://www.otcmarkets.com/stock/BBLC/news/rss';
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ news: fallbackNews }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const xmlText = await response.text();
    const newsItems: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s.exec(itemXml);
      const linkMatch = /<link>(.*?)<\/link>/s.exec(itemXml);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/s.exec(itemXml);
      const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s.exec(itemXml);

      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
      const link = linkMatch ? linkMatch[1].trim() : '';
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      const description = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';

      if (title) {
        newsItems.push({
          title,
          link,
          pubDate,
          description: description.substring(0, 240) + (description.length > 240 ? '...' : ''),
        });
      }
    }

    const finalNews = newsItems.length > 0 ? newsItems.slice(0, 12) : fallbackNews;
    return new Response(JSON.stringify({ news: finalNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage, news: fallbackNews }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
