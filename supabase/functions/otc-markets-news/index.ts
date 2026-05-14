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

// Fallback / featured Predictiv AI press releases
const fallbackNews: NewsItem[] = [
  {
    title: "Predictiv AI's Shift Technologies Enters Strategic Joint Venture with Arcasia Holdings (Pvt) Ltd. to Deploy AI-Powered Logistics Platform Across Global First, Middle, and Last Mile Networks",
    source: "ACCESS Newswire",
    pubDate: "2026-04-28",
    link: "https://www.predictiv.ai/news",
    description: "TORONTO, ON — Predictiv AI Inc. (CSE: PAI)(FWB: 7IT) announced its subsidiary Shift Technologies has entered a 51/49 strategic joint venture with Arcasia Holdings, the family office of Sri Lankan cricket legend Aravinda De Silva, to deploy Shift's AI-powered logistics platform across South Asian and Middle Eastern operating networks."
  },
  {
    title: "Predictiv AI Inc. Begins Trading on the Frankfurt Stock Exchange Under the Symbol 7IT",
    source: "ACCESS Newswire",
    pubDate: "2026-02-12",
    link: "https://www.predictiv.ai/news",
    description: "TORONTO, ON — Predictiv AI Inc. (CSE: PAI) is pleased to announce that its common shares have commenced trading on the Frankfurt Stock Exchange under the trading symbol '7IT', dual-listing the Company alongside its existing CSE listing and opening access to European institutional investors."
  },
  {
    title: "Predictiv AI Inc. Lists on the Canadian Securities Exchange Under the Symbol PAI",
    source: "ACCESS Newswire",
    pubDate: "2025-12-22",
    link: "https://www.predictiv.ai/news",
    description: "TORONTO, ON — Predictiv AI Inc. announced that its common shares have begun trading on the Canadian Securities Exchange under the symbol 'PAI'. The Company operates six vertical AI product lines spanning fleet telematics, voice/chat automation, and real estate intelligence."
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // CSE does not provide a public RSS feed for issuers; use curated fallback list of Predictiv AI releases.
    const rssUrl = '';
    if (!rssUrl) {
      return new Response(JSON.stringify({ news: fallbackNews }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
