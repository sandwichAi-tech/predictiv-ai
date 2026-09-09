import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, MousePointerClick, Timer, Users, ArrowDownWideNarrow, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface BriefEvent {
  event_type: string;
  visitor_id: string | null;
  session_id: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  country: string | null;
  device_type: string | null;
  referrer: string | null;
  event_data: unknown;
  created_at: string | null;
}

interface Props {
  from: Date;
  to: Date;
}

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const BriefTraffic = ({ from, to }: Props) => {
  const [events, setEvents] = useState<BriefEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type, visitor_id, session_id, utm_source, utm_campaign, country, device_type, referrer, event_data, created_at')
      .ilike('page_url', '%/brief%')
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .order('created_at', { ascending: false })
      .limit(5000);
    if (error) console.error('[BriefTraffic]', error);
    setEvents((data as BriefEvent[]) || []);
    setLoading(false);
  }, [from, to]);

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load]);

  const views = events.filter((e) => e.event_type === 'pageview');
  const clicks = events.filter((e) => e.event_type === 'brief_click');
  const ctaClicks = clicks.filter((e) => asRecord(e.event_data).cta === true);
  const releaseOpens = events.filter((e) => e.event_type === 'brief_release_open');
  const dwells = events.filter((e) => e.event_type === 'brief_dwell');
  const scrolls = events.filter((e) => e.event_type === 'brief_scroll_depth');

  const uniqueVisitors = new Set(views.map((e) => e.visitor_id).filter(Boolean)).size;
  const dwellSeconds = dwells
    .map((e) => Number(asRecord(e.event_data).seconds) || 0)
    .filter((n) => n > 0 && n < 3600);
  const avgDwell = dwellSeconds.length
    ? Math.round(dwellSeconds.reduce((a, b) => a + b, 0) / dwellSeconds.length)
    : 0;

  const depthCount = (m: number) =>
    new Set(
      scrolls
        .filter((e) => Number(asRecord(e.event_data).depth) >= m)
        .map((e) => e.visitor_id || e.session_id)
    ).size;

  const scrollFunnel = [25, 50, 75, 100].map((m) => ({ depth: m, visitors: depthCount(m) }));

  const daily = (() => {
    const map: Record<string, { day: string; views: number; visitors: Set<string> }> = {};
    views.forEach((e) => {
      if (!e.created_at) return;
      const day = format(new Date(e.created_at), 'MMM d');
      if (!map[day]) map[day] = { day, views: 0, visitors: new Set() };
      map[day].views += 1;
      if (e.visitor_id) map[day].visitors.add(e.visitor_id);
    });
    return Object.values(map)
      .map((d) => ({ day: d.day, views: d.views, visitors: d.visitors.size }))
      .reverse();
  })();

  const rank = (items: string[], limit = 6) => {
    const counts: Record<string, number> = {};
    items.forEach((i) => {
      const key = i || 'Direct';
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = items.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([label, value]) => ({ label, value, percentage: Math.round((value / total) * 100) }));
  };

  const sources = rank(
    views.map((e) => {
      if (e.utm_source) return e.utm_source;
      if (!e.referrer) return 'Direct';
      try {
        return new URL(e.referrer).hostname.replace(/^www\./, '');
      } catch {
        return 'Direct';
      }
    })
  );
  const countries = rank(views.map((e) => e.country || 'Unknown'));
  const topLinks = rank(
    clicks.map((e) => {
      const d = asRecord(e.event_data);
      return String(d.label || d.href || 'Link');
    }),
    8
  );

  const clickRate = views.length ? Math.round((clicks.length / views.length) * 100) : 0;
  const openRate = views.length ? Math.round((releaseOpens.length / views.length) * 100) : 0;

  const kpis = [
    { label: 'Brief Views', value: views.length, icon: FileText },
    { label: 'Unique Readers', value: uniqueVisitors, icon: Users },
    { label: 'Link Clicks', value: clicks.length, sub: `${clickRate}% of views`, icon: MousePointerClick },
    { label: 'CTA Clicks', value: ctaClicks.length, icon: MousePointerClick },
    { label: 'Release Opens', value: releaseOpens.length, sub: `${openRate}% of views`, icon: FileText },
    { label: 'Avg. Time', value: avgDwell ? `${avgDwell}s` : '—', icon: Timer },
  ];

  const Bars = ({ title, data }: { title: string; data: { label: string; value: number; percentage: number }[] }) => (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet</p>
        ) : (
          data.map((item, i) => (
            <div key={item.label + i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-foreground truncate max-w-[70%]" title={item.label}>{item.label}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  <span className="font-bold text-foreground">{item.value}</span> · {item.percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.max(item.percentage, 2)}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-bold text-foreground">Investor Brief Traffic — /brief</h2>
        <button
          onClick={load}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-lg border bg-background/60 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
            <div className="text-xl font-bold text-foreground">{value}</div>
            {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
          </div>
        ))}
      </div>

      <div className="h-56 mb-6">
        {daily.length === 0 ? (
          <p className="text-sm text-muted-foreground">No brief traffic in this date range yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.18} name="Views" />
              <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.12} name="Unique readers" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Bars title="Where brief readers came from" data={sources} />
        <Bars title="Countries" data={countries} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bars title="Most clicked links on the brief" data={topLinks} />
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <ArrowDownWideNarrow className="w-4 h-4" />How far they scroll
          </h3>
          <div className="space-y-2">
            {scrollFunnel.map((s) => {
              const pct = uniqueVisitors ? Math.round((s.visitors / uniqueVisitors) * 100) : 0;
              return (
                <div key={s.depth}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{s.depth}% of page</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      <span className="font-bold text-foreground">{s.visitors}</span> · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefTraffic;
