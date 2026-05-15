import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Radio, RefreshCw, ExternalLink, MessageCircle, Newspaper, TrendingUp, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Mention {
  source: 'StockTwits' | 'Reddit' | 'Google News' | 'Yahoo Finance';
  author?: string;
  title: string;
  body?: string;
  url: string;
  created_at: string;
  sentiment?: 'Bullish' | 'Bearish' | null;
}

interface Counts {
  stocktwits?: number;
  reddit?: number;
  google_news?: number;
  yahoo_finance?: number;
  total?: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const sourceIcon = (s: Mention['source']) => {
  if (s === 'StockTwits') return <TrendingUp className="h-3.5 w-3.5" />;
  if (s === 'Reddit') return <MessageCircle className="h-3.5 w-3.5" />;
  if (s === 'Yahoo Finance') return <Flame className="h-3.5 w-3.5" />;
  return <Newspaper className="h-3.5 w-3.5" />;
};

export const SocialWhisper = () => {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/social-whisper`);
      const j = await r.json();
      setMentions(j.mentions ?? []);
      setCounts(j.counts ?? {});
    } catch (e) {
      console.error('[SocialWhisper]', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = tab === 'All' ? mentions : mentions.filter(m => m.source === tab);

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary animate-pulse" />
          <CardTitle className="text-lg">Social Whisper · $PAI / Predictiv AI</CardTitle>
        </div>
        <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-5 w-full mb-3">
            <TabsTrigger value="All">All ({counts.total ?? 0})</TabsTrigger>
            <TabsTrigger value="StockTwits">StockTwits ({counts.stocktwits ?? 0})</TabsTrigger>
            <TabsTrigger value="Reddit">Reddit ({counts.reddit ?? 0})</TabsTrigger>
            <TabsTrigger value="Google News">News ({counts.google_news ?? 0})</TabsTrigger>
            <TabsTrigger value="Yahoo Finance">Yahoo ({counts.yahoo_finance ?? 0})</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-0">
            <ScrollArea className="h-[480px] pr-3">
              {filtered.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No mentions yet. Will populate as the ticker gets traction.
                </p>
              )}
              <div className="space-y-2">
                {filtered.map((m, i) => (
                  <a
                    key={`${m.url}-${i}`}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-border/50 bg-background/40 p-3 hover:border-primary/50 hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 text-xs">
                          {sourceIcon(m.source)} {m.source}
                        </Badge>
                        {m.sentiment && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${m.sentiment === 'Bullish' ? 'text-green-400 border-green-400/40' : 'text-red-400 border-red-400/40'}`}
                          >
                            {m.sentiment}
                          </Badge>
                        )}
                        {m.author && (
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{m.author}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-snug line-clamp-2">{m.title}</p>
                    {m.body && m.body !== m.title && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.body}</p>
                    )}
                  </a>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
