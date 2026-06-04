import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Eye, Mail, FileText, MessageSquare, TrendingUp, Activity, Send, Download, CalendarIcon, BarChart3, RefreshCw, UserPlus, Repeat, Newspaper, Headphones, Trophy, Target, Zap, MousePointerClick, ArrowDownToLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast as popToast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell, ComposedChart, Line, Legend } from 'recharts';
import { Globe, MessageCircle } from 'lucide-react';
import SocialPulse from '@/components/admin/SocialPulse';
import AdminChat from '@/components/admin/AdminChat';

interface TrendData { date: string; dateLabel: string; pageviews: number; visitors: number; }
interface CountryData { country: string; countryCode: string | null; visitors: number; percentage: number; }
interface BreakdownItem { label: string; value: number; percentage: number; }
interface DashboardStats {
  liveVisitors: number; totalVisitors: number; totalHits: number;
  newVisitors: number; returningVisitors: number; totalRevisits: number;
  totalPageviews: number; totalSubscribers: number; smsSubscribers: number;
  emailsSent: number; emailsOpened: number; emailsClicked: number;
  reportViews: number; reportShares: number; tearsheetViews: number; tearsheetShares: number;
  podcastPlays: number; podcastCompletes: number;
}
interface LiveVisitor {
  id: string; session_id: string; visitor_id: string | null; subscriber_id: string | null;
  device_type: string; utm_source: string | null; country: string | null;
  city: string | null; region: string | null; ip_address: string | null; last_seen: string;
  subscriber?: { first_name: string; email: string } | null;
}
interface Subscriber {
  id: string; first_name: string; email: string; phone: string | null;
  sms_opted_in: boolean; utm_source: string | null; created_at: string;
  hasViewedReport?: boolean; hasViewedTearsheet?: boolean;
}

const getCountryFlag = (countryCode: string | null): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const StatCard = ({ label, value, icon: Icon, description, accent, suffix }: { label: string; value: number | string; icon: React.ElementType; description?: string; accent?: 'default' | 'gold' | 'green'; suffix?: string }) => {
  const accentCls =
    accent === 'gold' ? 'bg-amber-500/10 text-amber-500' :
    accent === 'green' ? 'bg-emerald-500/10 text-emerald-500' :
    'bg-primary/10 text-primary';
  const valueCls =
    accent === 'gold' ? 'text-amber-500' :
    accent === 'green' ? 'text-emerald-500' : 'text-foreground';
  const display = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <div className="bg-card rounded-xl border p-4" title={description}>
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", accentCls)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className={cn("text-2xl font-bold", valueCls)}>{display}{suffix}</div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
          {description && (
            <div className="text-[11px] text-muted-foreground/70 mt-1 leading-snug">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const pearson = (xs: number[], ys: number[]): number => {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;
  const mx = xs.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const my = ys.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
};

const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    '\uFEFF' + headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return String(val);
      }).join(',')
    )
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [recentSignups, setRecentSignups] = useState<Subscriber[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [sourceData, setSourceData] = useState<BreakdownItem[]>([]);
  const [deviceData, setDeviceData] = useState<BreakdownItem[]>([]);
  const [topPages, setTopPages] = useState<BreakdownItem[]>([]);
  const [recentEvents, setRecentEvents] = useState<Array<{ id: string; event_type: string; page_url: string | null; country: string | null; device_type: string | null; created_at: string }>>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [onlineAdmins, setOnlineAdmins] = useState<Array<{ email: string; online_at: string }>>([]);
  const [engagementFeed, setEngagementFeed] = useState<Array<{
    id: string;
    kind: 'news' | 'research' | 'podcast' | 'click' | 'scroll';
    label: string; detail: string; who: string;
    visitor_id: string | null; country: string | null; created_at: string;
  }>>([]);
  const [viewMode, setViewMode] = useState<'issuer' | 'ops'>('issuer');
  const [paiVolume, setPaiVolume] = useState<Array<{ date: string; volume: number; close: number; breakdown?: Record<string, number> }>>([]);
  const { toast } = useToast();
  const lastStatsFetchRef = useRef<number>(0);
  const statsPendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventsFetchRef = useRef<number>(0);
  const eventsPendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLiveFetchRef = useRef<number>(0);
  const livePendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useAnalytics();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email || '');
        setCurrentUserId(session.user.id);
        const { data: roles } = await supabase
          .from('user_roles').select('role')
          .eq('user_id', session.user.id).eq('role', 'admin');
        setIsAdmin(roles && roles.length > 0);
      }
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setCurrentUserEmail(session?.user.email || '');
      setCurrentUserId(session?.user.id || '');
      if (session) {
        setTimeout(async () => {
          const { data: roles } = await supabase
            .from('user_roles').select('role')
            .eq('user_id', session.user.id).eq('role', 'admin');
          setIsAdmin(roles && roles.length > 0);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getDateRange = () => {
    if (dateRange?.from && dateRange?.to) return { from: dateRange.from, to: dateRange.to };
    const now = new Date();
    const ranges: Record<string, Date> = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      'all': new Date(0),
    };
    return { from: ranges[timeRange] || ranges['7d'], to: now };
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    fetchStats();
    fetchTrendData();
    fetchCountryData();
    fetchBreakdowns();
    fetchLiveVisitors();
    fetchRecentSignups();
    fetchRecentEvents();
    fetchEngagementFeed();
    fetchPaiVolume();

    const channel = supabase
      .channel('live_visitors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_visitors' }, () => {
        throttledFetchLiveVisitors();
      })
      .subscribe();

    const eventsChannel = supabase
      .channel('analytics_events_pops')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        (payload) => {
          const row = payload.new as { event_type?: string; country?: string | null; device_type?: string | null; page_url?: string | null };
          const country = row.country || 'Unknown';
          const device = row.device_type === 'mobile' ? '📱' : row.device_type === 'tablet' ? '📲' : '💻';
          if (row.event_type === 'pageview') {
            popToast(`${device} New visitor — ${country}`, {
              description: row.page_url ? new URL(row.page_url).pathname : undefined,
              duration: 3500,
            });
          } else if (row.event_type === 'return_visit') {
            popToast.success(`🔁 Returning investor — ${country}`, { description: 'Came back to the lander', duration: 4500 });
          } else if (row.event_type === 'podcast_play') {
            popToast(`🎧 Podcast play — ${country}`, { duration: 3500 });
          } else if (row.event_type === 'podcast_complete') {
            popToast.success(`🏆 Podcast COMPLETED — ${country}`, { duration: 5000 });
          }
          throttledFetchStats();
          throttledFetchRecentEvents();
        })
      .subscribe();

    const interval = setInterval(() => {
      fetchStats();
      setTimeout(() => fetchEngagementFeed(), 1500);
      setTimeout(() => fetchRecentEvents(), 3000);
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(eventsChannel);
      clearInterval(interval);
      if (statsPendingRef.current) clearTimeout(statsPendingRef.current);
      if (eventsPendingRef.current) clearTimeout(eventsPendingRef.current);
      if (livePendingRef.current) clearTimeout(livePendingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin, timeRange, dateRange]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !currentUserEmail) return;
    const presenceChannel = supabase.channel('admin_presence', {
      config: { presence: { key: currentUserEmail } },
    });
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState<{ email: string; online_at: string }>();
        const admins = Object.values(state).flat().map((p) => ({ email: p.email, online_at: p.online_at }));
        setOnlineAdmins(admins);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ email: currentUserEmail, online_at: new Date().toISOString() });
        }
      });
    return () => { supabase.removeChannel(presenceChannel); };
  }, [isAuthenticated, isAdmin, currentUserEmail]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) { setAuthError('Please enter an email address.'); return; }
    if (password !== '$pai') { setAuthError('Invalid password. Use $pai.'); return; }
    const derivedPassword = `pai-admin::${normalizedEmail}::v1-static-key`;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail, password: derivedPassword,
    });
    if (!signInError) return;

    const { error: resetErr } = await supabase.functions.invoke('admin-reset-password', {
      body: { email: normalizedEmail, gate: '$pai' },
    });
    if (resetErr) { setAuthError(resetErr.message || 'Unable to reset admin password.'); return; }

    const { error: retryErr } = await supabase.auth.signInWithPassword({
      email: normalizedEmail, password: derivedPassword,
    });
    if (retryErr) setAuthError(retryErr.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const fetchStats = async () => {
    const { from, to } = getDateRange();
    const since = from.toISOString();
    const until = to.toISOString();
    const liveSince = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data, error } = await supabase.rpc('get_admin_analytics_summary', {
      start_date: since, end_date: until, live_since: liveSince,
    });

    if (error || !data?.[0]) { console.error('[fetchStats] summary RPC error:', error); return; }
    const summary = data[0];
    setStats((prev) => {
      const keep = <T,>(next: T | null | undefined, fallback: T): T =>
        next === null || next === undefined ? fallback : next;
      return {
        liveVisitors: keep(Number(summary.live_visitors), prev?.liveVisitors ?? 0),
        totalVisitors: keep(Number(summary.total_visitors), prev?.totalVisitors ?? 0),
        totalHits: keep(Number(summary.total_hits), prev?.totalHits ?? 0),
        newVisitors: keep(Number(summary.new_visitors), prev?.newVisitors ?? 0),
        returningVisitors: keep(Number(summary.returning_visitors), prev?.returningVisitors ?? 0),
        totalRevisits: keep(Number(summary.total_revisits), prev?.totalRevisits ?? 0),
        totalPageviews: keep(Number(summary.total_pageviews), prev?.totalPageviews ?? 0),
        totalSubscribers: keep(Number(summary.total_subscribers), prev?.totalSubscribers ?? 0),
        smsSubscribers: keep(Number(summary.sms_subscribers), prev?.smsSubscribers ?? 0),
        emailsSent: keep(Number(summary.emails_sent), prev?.emailsSent ?? 0),
        emailsOpened: keep(Number(summary.emails_opened), prev?.emailsOpened ?? 0),
        emailsClicked: keep(Number(summary.emails_clicked), prev?.emailsClicked ?? 0),
        reportViews: keep(Number(summary.report_views), prev?.reportViews ?? 0),
        reportShares: keep(Number(summary.report_shares), prev?.reportShares ?? 0),
        tearsheetViews: keep(Number(summary.tearsheet_views), prev?.tearsheetViews ?? 0),
        tearsheetShares: keep(Number(summary.tearsheet_shares), prev?.tearsheetShares ?? 0),
        podcastPlays: keep(Number(summary.podcast_plays), prev?.podcastPlays ?? 0),
        podcastCompletes: keep(Number(summary.podcast_completes), prev?.podcastCompletes ?? 0),
      };
    });
  };

  const throttledFetchStats = () => {
    const now = Date.now();
    const elapsed = now - lastStatsFetchRef.current;
    const MIN_GAP = 20000;
    if (elapsed >= MIN_GAP) { lastStatsFetchRef.current = now; fetchStats(); }
    else if (!statsPendingRef.current) {
      statsPendingRef.current = setTimeout(() => {
        statsPendingRef.current = null;
        lastStatsFetchRef.current = Date.now();
        fetchStats();
      }, MIN_GAP - elapsed);
    }
  };

  const throttledFetchRecentEvents = () => {
    const now = Date.now();
    const elapsed = now - lastEventsFetchRef.current;
    const MIN_GAP = 8000;
    if (elapsed >= MIN_GAP) { lastEventsFetchRef.current = now; fetchRecentEvents(); }
    else if (!eventsPendingRef.current) {
      eventsPendingRef.current = setTimeout(() => {
        eventsPendingRef.current = null;
        lastEventsFetchRef.current = Date.now();
        fetchRecentEvents();
      }, MIN_GAP - elapsed);
    }
  };

  const refreshLiveCountOnly = async () => {
    const { count, error } = await supabase
      .from('live_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', new Date(Date.now() - 10 * 60 * 1000).toISOString());
    if (error || count === null || count === undefined) return;
    setStats((prev) => (prev ? { ...prev, liveVisitors: count } : prev));
  };

  const throttledFetchLiveVisitors = () => {
    const now = Date.now();
    const elapsed = now - lastLiveFetchRef.current;
    const MIN_GAP = 5000;
    if (elapsed >= MIN_GAP) { lastLiveFetchRef.current = now; fetchLiveVisitors(); }
    else if (!livePendingRef.current) {
      livePendingRef.current = setTimeout(() => {
        livePendingRef.current = null;
        lastLiveFetchRef.current = Date.now();
        fetchLiveVisitors();
      }, MIN_GAP - elapsed);
    }
    refreshLiveCountOnly();
  };

  const fetchTrendData = async () => {
    const { from, to } = getDateRange();
    const { data, error } = await supabase.rpc('get_daily_analytics', {
      start_date: from.toISOString(), end_date: to.toISOString()
    });
    if (error || !data) { console.error('Error fetching trend data:', error); setTrendData([]); return; }
    const days = eachDayOfInterval({ start: from, end: to });
    const dailyData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const match = data.find((d: { day: string; pageviews: number; unique_visitors: number }) => d.day === dayStr);
      return {
        date: dayStr,
        dateLabel: format(day, 'MMM d'),
        pageviews: match?.pageviews || 0,
        visitors: match?.unique_visitors || 0,
      };
    });
    setTrendData(dailyData);
  };

  const fetchCountryData = async () => {
    const { from, to } = getDateRange();
    const { data, error } = await supabase.rpc('get_country_breakdown', {
      start_date: from.toISOString(), end_date: to.toISOString(), max_rows: 25,
    });
    if (error) { console.error('[fetchCountryData] RPC error:', error); return; }
    if (!data || data.length === 0) { setCountryData([]); return; }
    const totalVisitors = Number((data[0] as { total_visitors: number }).total_visitors) || 0;
    const countryStats: CountryData[] = (data as Array<{ country: string; country_code: string | null; visitors: number }>)
      .map((row) => ({
        country: row.country,
        countryCode: row.country_code,
        visitors: Number(row.visitors),
        percentage: totalVisitors > 0 ? Math.round((Number(row.visitors) / totalVisitors) * 100) : 0,
      }))
      .slice(0, 10);
    setCountryData(countryStats);
  };

  const fetchBreakdowns = async () => {
    const { from, to } = getDateRange();
    const { data, error } = await supabase.rpc('get_traffic_breakdowns', {
      start_date: from.toISOString(), end_date: to.toISOString(), max_rows: 8,
    });
    if (error || !data) { console.error('[fetchBreakdowns] RPC error:', error); return; }
    const rows = data as Array<{ dimension: string; label: string; visitors: number }>;
    const toItems = (dim: string): BreakdownItem[] => {
      const subset = rows.filter((r) => r.dimension === dim);
      const total = subset.reduce((s, r) => s + Number(r.visitors), 0) || 1;
      return subset.map((r) => ({
        label: r.label || 'Unknown',
        value: Number(r.visitors),
        percentage: Math.round((Number(r.visitors) / total) * 100),
      }));
    };
    setSourceData(toItems('source'));
    setDeviceData(toItems('device'));
    setTopPages(toItems('page'));
  };

  const fetchRecentEvents = async () => {
    const { data } = await supabase
      .from('analytics_events')
      .select('id, event_type, page_url, country, device_type, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setRecentEvents(data || []);
  };

  const fetchPaiVolume = async () => {
    const { from, to } = getDateRange();
    const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)));
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pai-volume-history?days=${days}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string },
      });
      const json = await res.json();
      setPaiVolume(json.bars || []);
    } catch (e) {
      console.error('pai-volume-history', e);
      setPaiVolume([]);
    }
  };

  const fetchEngagementFeed = async () => {
    const { from, to } = getDateRange();
    const since = from.toISOString();
    const until = to.toISOString();

    const { data: actionEvents } = await supabase
      .from('analytics_events')
      .select('id, event_type, event_data, country, visitor_id, created_at')
      .in('event_type', ['news_click', 'podcast_play', 'podcast_complete', 'click', 'scroll_depth', 'report_view', 'tearsheet_view', 'report_download', 'tearsheet_download'])
      .gte('created_at', since).lte('created_at', until)
      .order('created_at', { ascending: false }).limit(250);

    const { data: docEvents } = await supabase
      .from('document_engagement')
      .select('id, document_type, action, visitor_id, subscriber_id, created_at')
      .eq('action', 'view')
      .gte('created_at', since).lte('created_at', until)
      .order('created_at', { ascending: false }).limit(100);

    const visitorIds = new Set<string>();
    const subscriberIds = new Set<string>();
    (actionEvents || []).forEach((e) => { if (e.visitor_id) visitorIds.add(e.visitor_id); });
    (docEvents || []).forEach((e) => {
      if (e.visitor_id) visitorIds.add(e.visitor_id);
      if (e.subscriber_id) subscriberIds.add(e.subscriber_id);
    });

    const visitorToSubscriber = new Map<string, { name: string; email: string }>();
    if (subscriberIds.size > 0) {
      const { data: directSubs } = await supabase
        .from('subscribers').select('id, first_name, email')
        .in('id', Array.from(subscriberIds));
      (directSubs || []).forEach((s) => {
        visitorToSubscriber.set(`sub:${s.id}`, { name: s.first_name, email: s.email });
      });
    }
    if (visitorIds.size > 0) {
      const { data: linked } = await supabase
        .from('document_engagement').select('visitor_id, subscriber_id')
        .in('visitor_id', Array.from(visitorIds)).not('subscriber_id', 'is', null);
      const linkedMap = new Map<string, string>();
      (linked || []).forEach((row) => {
        if (row.visitor_id && row.subscriber_id) linkedMap.set(row.visitor_id, row.subscriber_id);
      });
      const linkedSubIds = Array.from(new Set(linkedMap.values()));
      if (linkedSubIds.length > 0) {
        const { data: subs } = await supabase
          .from('subscribers').select('id, first_name, email').in('id', linkedSubIds);
        const subMap = new Map((subs || []).map((s) => [s.id, s]));
        linkedMap.forEach((subId, vId) => {
          const s = subMap.get(subId);
          if (s) visitorToSubscriber.set(`vid:${vId}`, { name: s.first_name, email: s.email });
        });
      }
    }

    const labelFor = (visitorId: string | null, subscriberId: string | null) => {
      if (subscriberId) {
        const s = visitorToSubscriber.get(`sub:${subscriberId}`);
        if (s) return `${s.name} · ${s.email}`;
      }
      if (visitorId) {
        const s = visitorToSubscriber.get(`vid:${visitorId}`);
        if (s) return `${s.name} · ${s.email}`;
        return `Anonymous · ${visitorId.slice(0, 8)}`;
      }
      return 'Anonymous visitor';
    };

    const docTypeLabel: Record<string, string> = {
      report: 'Full Research Report',
      tearsheet: 'Executive Tear Sheet',
      pressrelease: 'Press Release (Research)',
      press_release: 'Press Release (Predictiv AI)',
      about: 'About the Company',
    };

    const newsItems = (actionEvents || []).filter((e) => e.event_type === 'news_click').map((e) => {
      const data = (e.event_data as { title?: string; source?: string } | null) || {};
      return {
        id: e.id, kind: 'news' as const,
        label: 'Clicked news article', detail: data.title || 'News article',
        who: labelFor(e.visitor_id, null),
        visitor_id: e.visitor_id, country: e.country, created_at: e.created_at!,
      };
    });

    const podcastItems = (actionEvents || []).filter((e) => e.event_type.startsWith('podcast')).map((e) => ({
      id: e.id, kind: 'podcast' as const,
      label: e.event_type === 'podcast_complete' ? 'Finished podcast' : 'Played podcast',
      detail: 'Wall Street Deal Room — Predictiv AI',
      who: labelFor(e.visitor_id, null),
      visitor_id: e.visitor_id, country: e.country, created_at: e.created_at!,
    }));

    const docItems = (docEvents || []).map((e) => ({
      id: e.id, kind: 'research' as const,
      label: 'Viewed research doc',
      detail: docTypeLabel[e.document_type] || e.document_type,
      who: labelFor(e.visitor_id, e.subscriber_id),
      visitor_id: e.visitor_id, country: null, created_at: e.created_at!,
    }));

    const clickItems = (actionEvents || []).filter((e) => e.event_type === 'click').map((e) => {
      const data = (e.event_data as { text?: string; href?: string } | null) || {};
      return {
        id: e.id, kind: 'click' as const,
        label: 'Clicked element', detail: data.text || data.href || 'Interactive element',
        who: labelFor(e.visitor_id, null),
        visitor_id: e.visitor_id, country: e.country, created_at: e.created_at!,
      };
    });

    const scrollItems = (actionEvents || [])
      .filter((e) => e.event_type === 'scroll_depth')
      .map((e) => {
        const data = (e.event_data as { percent?: number } | null) || {};
        return {
          id: e.id, kind: 'scroll' as const,
          label: 'Scrolled the page', detail: `Reached ${data.percent ?? 0}% depth`,
          who: labelFor(e.visitor_id, null),
          visitor_id: e.visitor_id, country: e.country, created_at: e.created_at!,
        };
      })
      .reduce((acc: any[], item) => {
        const existing = acc.find((x) => x.visitor_id === item.visitor_id);
        if (!existing) acc.push(item);
        return acc;
      }, []);

    const merged = [...newsItems, ...podcastItems, ...docItems, ...clickItems, ...scrollItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 100);

    setEngagementFeed(merged);
  };

  const fetchLiveVisitors = async () => {
    const { data } = await supabase
      .from('live_visitors').select('*')
      .gte('last_seen', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order('last_seen', { ascending: false });

    const rows = (data as LiveVisitor[]) || [];
    const subscriberIds = Array.from(new Set(rows.map((row) => row.subscriber_id).filter(Boolean))) as string[];
    if (subscriberIds.length === 0) { setLiveVisitors(rows); return; }

    const { data: subscribers } = await supabase
      .from('subscribers').select('id, first_name, email').in('id', subscriberIds);
    const subscriberMap = new Map((subscribers || []).map((sub) => [sub.id, sub]));
    setLiveVisitors(rows.map((row) => ({ ...row, subscriber: row.subscriber_id ? subscriberMap.get(row.subscriber_id) || null : null })));
  };

  const fetchRecentSignups = async () => {
    const { data: subs } = await supabase
      .from('subscribers').select('*')
      .order('created_at', { ascending: false }).limit(10);
    if (!subs || subs.length === 0) { setRecentSignups([]); return; }
    const subIds = subs.map(s => s.id);
    const { data: engagement } = await supabase
      .from('document_engagement').select('subscriber_id, document_type').in('subscriber_id', subIds);
    const enrichedSignups = subs.map(s => ({
      ...s,
      hasViewedReport: engagement?.some(e => e.subscriber_id === s.id && e.document_type === 'report'),
      hasViewedTearsheet: engagement?.some(e => e.subscriber_id === s.id && e.document_type === 'tearsheet'),
    })) as Subscriber[];
    setRecentSignups(enrichedSignups);
  };

  const sendSmsAlert = async () => {
    if (!smsMessage.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" });
      return;
    }
    setSendingSms(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-digest', { body: { message: smsMessage } });
      if (error) throw error;
      toast({ title: "SMS Alert Sent", description: `Sent to ${data.sent} subscribers (${data.failed} failed)` });
      setSmsMessage('');
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message || "Unknown error", variant: "destructive" });
    } finally {
      setSendingSms(false);
    }
  };

  const exportSubscribers = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('subscribers')
        .select('first_name, email, phone, sms_opted_in, source, utm_source, utm_medium, utm_campaign, created_at')
        .gte('created_at', from.toISOString()).lte('created_at', to.toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(s => ({
        ...s,
        created_at: format(new Date(s.created_at!), 'yyyy-MM-dd HH:mm:ss'),
        sms_opted_in: s.sms_opted_in ? 'Yes' : 'No'
      }));
      const filename = `subscribers_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} subscribers exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  const exportEmailEvents = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('email_events').select('email, event_type, campaign_id, email_id, timestamp')
        .gte('timestamp', from.toISOString()).lte('timestamp', to.toISOString())
        .order('timestamp', { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(e => ({ ...e, timestamp: format(new Date(e.timestamp!), 'yyyy-MM-dd HH:mm:ss') }));
      const filename = `email_events_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} email events exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  const exportDocumentEngagement = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('document_engagement').select('document_type, action, visitor_id, session_id, created_at')
        .gte('created_at', from.toISOString()).lte('created_at', to.toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      const formatted = (data || []).map(d => ({ ...d, created_at: format(new Date(d.created_at!), 'yyyy-MM-dd HH:mm:ss') }));
      const filename = `document_engagement_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} engagement records exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  const exportAnalyticsSummary = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('analytics_events').select('event_type, created_at, device_type, utm_source')
        .gte('created_at', from.toISOString()).lte('created_at', to.toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      const dailyStats: Record<string, { date: string; pageviews: number; visitors: Set<string>; mobile: number; desktop: number }> = {};
      (data || []).forEach(e => {
        const day = format(new Date(e.created_at!), 'yyyy-MM-dd');
        if (!dailyStats[day]) dailyStats[day] = { date: day, pageviews: 0, visitors: new Set(), mobile: 0, desktop: 0 };
        dailyStats[day].pageviews++;
        if (e.device_type === 'mobile') dailyStats[day].mobile++;
        else dailyStats[day].desktop++;
      });
      const formatted = Object.values(dailyStats).map(d => ({
        date: d.date, pageviews: d.pageviews, mobile_views: d.mobile, desktop_views: d.desktop
      })).sort((a, b) => b.date.localeCompare(a.date));
      const filename = `analytics_summary_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} days of analytics exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally { setExporting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl border p-6">
            <h1 className="text-xl font-bold text-foreground mb-1 text-center">
              Predictiv AI IR Dashboard
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your email and password to go straight in
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input type="email" placeholder="Email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Input type="password" placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button type="submit" className="w-full">Enter Dashboard</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const engagementScore = stats
    ? stats.returningVisitors * 3
      + (stats.reportViews + stats.tearsheetViews) * 5
      + stats.podcastCompletes * 8
      + stats.totalSubscribers * 10
    : 0;
  const countriesReached = countryData.length;
  const avgSessionsPerReturning = stats && stats.returningVisitors > 0
    ? (stats.totalRevisits / stats.returningVisitors).toFixed(1) : '0';

  const CSE_TO_CONSOLIDATED = 1 / 0.6966;
  const consolidatedBarVolume = (bar?: { volume: number; breakdown?: Record<string, number> }) => {
    if (!bar) return 0;
    if (bar.breakdown) {
      const cse = bar.breakdown.CSE ?? 0;
      const otc = bar.breakdown.OTC ?? 0;
      const fwb = bar.breakdown.FWB ?? 0;
      return Math.round(cse * CSE_TO_CONSOLIDATED) + otc + fwb;
    }
    return Math.round(bar.volume * CSE_TO_CONSOLIDATED);
  };
  const combinedTrend = trendData.map((d) => {
    const bar = paiVolume.find((v) => v.date === d.date);
    return { ...d, paiVolume: consolidatedBarVolume(bar), paiClose: bar?.close || 0 };
  });
  const visitorsSeries = combinedTrend.filter((d) => d.paiVolume > 0).map((d) => d.visitors);
  const volumeSeries = combinedTrend.filter((d) => d.paiVolume > 0).map((d) => d.paiVolume);
  const corr = pearson(visitorsSeries, volumeSeries);
  const corrLabel =
    visitorsSeries.length < 3 ? 'Need more data' :
    corr >= 0.6 ? 'Strong positive' :
    corr >= 0.3 ? 'Moderate positive' :
    corr > -0.3 ? 'Weak / independent' :
    corr > -0.6 ? 'Moderate negative' : 'Strong negative';
  const corrColor =
    corr >= 0.3 ? 'text-emerald-500' :
    corr <= -0.3 ? 'text-red-500' : 'text-muted-foreground';
  const totalPaiVolume = paiVolume.reduce((s, b) => s + consolidatedBarVolume(b), 0);

  const volumeSpikes = (() => {
    if (combinedTrend.length < 2) return [] as Array<{ date: string; dateLabel: string; volume: number; visitorsSameDay: number; visitorsPriorDay: number; vsMedian: number }>;
    const vols = combinedTrend.map((d) => d.paiVolume).filter((v) => v > 0).sort((a, b) => a - b);
    const median = vols.length ? vols[Math.floor(vols.length / 2)] : 0;
    return [...combinedTrend]
      .map((d, i) => ({
        date: d.date, dateLabel: d.dateLabel, volume: d.paiVolume,
        visitorsSameDay: d.visitors,
        visitorsPriorDay: i > 0 ? combinedTrend[i - 1].visitors : 0,
        vsMedian: median > 0 ? d.paiVolume / median : 0,
      }))
      .filter((d) => d.volume > 0)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 3);
  })();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Predictiv AI IR Command Center</h1>
            <p className="text-primary-foreground/70 text-sm">Predictiv AI Inc. (CSE: PAI · FWB: 7IT) · Real-time investor traffic & engagement</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 mr-2 border border-white/20 rounded-md p-0.5">
              {[
                { key: 'issuer', label: 'Issuer View' },
                { key: 'ops', label: 'Operational' },
              ].map(({ key, label }) => (
                <Button key={key} variant="ghost" size="sm"
                  className={cn("text-primary-foreground hover:bg-white/20 h-7 px-3 text-xs", viewMode === key && "bg-white/20")}
                  onClick={() => setViewMode(key as 'issuer' | 'ops')}>
                  {label}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {[
                { key: '24h', label: '24h' },
                { key: '7d', label: '7d' },
                { key: '30d', label: '30d' },
                { key: 'all', label: 'All' },
              ].map(({ key, label }) => (
                <Button key={key}
                  variant={timeRange === key && !dateRange ? 'secondary' : 'ghost'} size="sm"
                  className={cn("text-primary-foreground hover:bg-white/20", timeRange === key && !dateRange && "bg-white/20")}
                  onClick={() => { setTimeRange(key); setDateRange(undefined); }}>
                  {label}
                </Button>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={dateRange ? 'secondary' : 'ghost'} size="sm"
                  className={cn("text-primary-foreground hover:bg-white/20 gap-2", dateRange && "bg-white/20")}>
                  <CalendarIcon className="w-4 h-4" />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                    : 'Custom'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                <Calendar mode="range" selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.from && range?.to) setTimeRange('custom');
                  }}
                  numberOfMonths={2} className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20 gap-2"
              onClick={() => {
                fetchStats(); fetchTrendData(); fetchCountryData();
                fetchLiveVisitors(); fetchRecentSignups(); fetchRecentEvents(); fetchEngagementFeed();
                toast({ title: "Refreshed", description: "Dashboard data updated" });
              }}>
              <RefreshCw className="w-4 h-4" />Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20 gap-2" disabled={exporting}>
                  <Download className="w-4 h-4" />{exporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportAnalyticsSummary}>Analytics Summary (Daily)</DropdownMenuItem>
                <DropdownMenuItem onClick={exportSubscribers}>Subscriber List</DropdownMenuItem>
                <DropdownMenuItem onClick={exportEmailEvents}>Email Events</DropdownMenuItem>
                <DropdownMenuItem onClick={exportDocumentEngagement}>Document Engagement</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="secondary" size="sm" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-emerald-500/10 via-card to-amber-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 border-r border-border/40 pr-4">
              <div className="relative shrink-0">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-500 font-mono">Live Now</div>
                <div className="text-2xl font-bold font-mono text-emerald-500 tabular-nums">
                  {stats?.liveVisitors || 0}<span className="text-xs font-normal text-muted-foreground ml-1">on site</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-r border-border/40 pr-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-mono">Pageviews</div>
                <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
                  {(stats?.totalPageviews || 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-r border-border/40 pr-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-amber-500 font-mono">All Events</div>
                <div className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
                  {(stats?.totalHits || 0).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-500 font-mono">Repeats</div>
                <div className="text-2xl font-bold font-mono text-emerald-500 tabular-nums">
                  {(stats?.totalRevisits || 0).toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground ml-1">visit-days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Team Online</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {onlineAdmins.length} viewing now
              </span>
            </div>
            <button onClick={() => window.dispatchEvent(new CustomEvent('admin-chat:open'))}
              className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="w-3.5 h-3.5" />Open Team Chat
            </button>
          </div>
          {onlineAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground">Just you so far.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {onlineAdmins.map((admin) => (
                <div key={admin.email} className="flex items-center gap-2 bg-background border rounded-full px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-sm text-foreground">
                    {admin.email}
                    {admin.email === currentUserEmail && <span className="text-muted-foreground ml-1">(you)</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {stats && viewMode === 'issuer' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard label="Engagement Score" value={engagementScore} icon={Trophy} accent="gold" />
              <StatCard label="Unique Investors Reached" value={stats.totalVisitors} icon={Users} />
              <StatCard label="Countries Reached" value={countriesReached} icon={Globe} />
              <StatCard label="Returning Investors" value={stats.returningVisitors} icon={Repeat} accent="green" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Avg Sessions / Returning" value={avgSessionsPerReturning} icon={Zap} />
              <StatCard label="Research Docs Opened" value={stats.reportViews + stats.tearsheetViews} icon={FileText} />
              <StatCard label="Podcast Completed" value={stats.podcastCompletes} icon={Headphones} accent="green" />
              <StatCard label="Email Subscribers" value={stats.totalSubscribers} icon={Mail} accent="gold" />
            </div>
          </>
        )}

        {stats && viewMode === 'ops' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <StatCard label="Unique Visitors" value={stats.totalVisitors} icon={Users} description="Distinct people in range." />
              <StatCard label="Pageviews" value={stats.totalPageviews} icon={Eye} description="Total pageview events." />
              <StatCard label="All Events (raw)" value={stats.totalHits} icon={Activity} description="Every analytics event." />
              <StatCard label="Subscribers" value={stats.totalSubscribers} icon={Mail} description="Email opt-ins captured in range." />
              <StatCard label="SMS Opted-In" value={stats.smsSubscribers} icon={MessageSquare} description="Subscribers with SMS consent." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard label="New Visitors" value={stats.newVisitors} icon={UserPlus} />
              <StatCard label="Returning Visitors" value={stats.returningVisitors} icon={Repeat} />
              <StatCard label="Total Repeat Visit-Days" value={stats.totalRevisits} icon={Activity} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <StatCard label="Podcast Plays" value={stats.podcastPlays} icon={Headphones} />
              <StatCard label="Podcast Completed" value={stats.podcastCompletes} icon={Headphones} />
            </div>
          </>
        )}

        {combinedTrend.length > 0 && paiVolume.length > 0 && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Site Traffic ↔ $PAI Combined Volume (CSE · OTC · FWB)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Daily unique investors overlaid with $PAI combined trading volume across all three listings.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Combined Volume</div>
                  <div className="text-xl font-bold font-mono text-amber-500">{totalPaiVolume.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">CSE + OTC + FWB</div>
                </div>
                {viewMode === 'ops' && (
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pearson r</div>
                    <div className={cn("text-xl font-bold font-mono", corrColor)}>{corr.toFixed(2)}</div>
                    <div className={cn("text-[10px]", corrColor)}>{corrLabel}</div>
                  </div>
                )}
              </div>
            </div>
            <ChartContainer
              config={{
                visitors: { label: 'Unique Visitors', color: 'hsl(142.1 76.2% 36.3%)' },
                paiVolume: { label: '$PAI Volume', color: 'hsl(38 92% 50%)' },
              }}
              className="h-[320px] w-full">
              <ComposedChart data={combinedTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="right" dataKey="paiVolume" fill="hsl(38 92% 50%)" fillOpacity={0.55} name="$PAI Combined Volume" />
                <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth={2.5} dot={false} name="Unique Visitors" />
              </ComposedChart>
            </ChartContainer>
          </div>
        )}

        {volumeSpikes.length > 0 && (
          <div className="bg-card rounded-xl border border-amber-500/30 p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Volume Spikes — Tape Reacted to Exposure
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  The biggest $PAI volume days paired with lander traffic day-of and prior.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {volumeSpikes.map((s, i) => (
                <div key={s.date} className="bg-background/40 rounded-lg border border-amber-500/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-amber-500">#{i + 1} Spike</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.dateLabel}</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-500">{s.volume.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                    shares · {s.vsMedian >= 1 ? `${s.vsMedian.toFixed(1)}× median` : 'below median'}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs border-t border-border/40 pt-2">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Prior-day visitors</div>
                      <div className="font-mono font-bold text-emerald-500">{s.visitorsPriorDay}</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Day-of visitors</div>
                      <div className="font-mono font-bold text-emerald-500">{s.visitorsSameDay}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <SocialPulse viewMode={viewMode} />

        <div className="bg-card rounded-xl border border-emerald-500/20 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Who's Engaging Right Now
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live feed: news clicks · research opens · podcast plays. Names appear once a visitor signs up.
              </p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-emerald-500">● LIVE</span>
          </div>
          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {engagementFeed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No engagement yet in this date range.</p>
            ) : engagementFeed.map((e, idx) => {
              const kindStyles: Record<string, string> = {
                news: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                research: 'bg-primary/10 text-primary border-primary/30',
                podcast: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
                click: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
                scroll: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
              };
              const kindIcon: Record<string, JSX.Element> = {
                news: <Newspaper className="w-3.5 h-3.5" />,
                research: <FileText className="w-3.5 h-3.5" />,
                podcast: <Headphones className="w-3.5 h-3.5" />,
                click: <MousePointerClick className="w-3.5 h-3.5" />,
                scroll: <ArrowDownToLine className="w-3.5 h-3.5" />,
              };
              const kindLabel: Record<string, string> = {
                news: 'News', research: 'Research', podcast: 'Podcast', click: 'Click', scroll: 'Scroll',
              };
              return (
                <div key={`${e.kind}-${e.id}`}
                  className={cn('flex items-center gap-3 p-2.5 rounded text-sm border border-transparent hover:border-border hover:bg-muted/50 transition-colors',
                    idx === 0 && 'bg-emerald-500/5 border-emerald-500/20 animate-fade-in')}>
                  <span className={cn('flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium shrink-0', kindStyles[e.kind])}>
                    {kindIcon[e.kind]}{kindLabel[e.kind]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{e.who}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {e.label}: <span className="text-foreground/80">{e.detail}</span>
                    </div>
                  </div>
                  {e.country && <span className="text-xs text-muted-foreground hidden md:inline">{e.country}</span>}
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(e.created_at).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {trendData.length > 0 && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />Visitor Trends
            </h2>
            <ChartContainer
              config={{
                pageviews: { label: "Pageviews", color: "hsl(var(--primary))" },
                visitors: { label: "Unique Visitors", color: "hsl(142.1 76.2% 36.3%)" }
              }}
              className="h-[300px] w-full">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="pageviews" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorPageviews)" />
                <Area type="monotone" dataKey="visitors" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth={2} fill="url(#colorVisitors)" />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {countryData.length > 0 && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />Visitor Locations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer config={{ visitors: { label: "Visitors", color: "hsl(var(--primary))" } }} className="h-[300px] w-full">
                <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" width={75} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                    {countryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fillOpacity={1 - (index * 0.08)} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>

              <div className="space-y-2">
                {countryData.map((c, i) => (
                  <div key={c.country} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-muted-foreground w-6">{i + 1}</span>
                      <span className="text-2xl">{getCountryFlag(c.countryCode)}</span>
                      <span className="font-medium text-foreground">{c.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{c.visitors}</div>
                      <div className="text-xs text-muted-foreground">{c.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stats && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />Investor Conversion Funnel
            </h2>
            {(() => {
              const steps = [
                { label: 'Visitors', value: stats.totalVisitors, color: 'bg-primary' },
                { label: 'Document Views', value: stats.reportViews + stats.tearsheetViews, color: 'bg-blue-500' },
                { label: 'Email Subscribers', value: stats.totalSubscribers, color: 'bg-green-500' },
                { label: 'SMS Opted-In', value: stats.smsSubscribers, color: 'bg-purple-500' },
              ];
              const max = Math.max(...steps.map(s => s.value), 1);
              return (
                <div className="space-y-3">
                  {steps.map((s, i) => {
                    const pct = (s.value / max) * 100;
                    const conv = i > 0 && steps[0].value > 0 ? ((s.value / steps[0].value) * 100).toFixed(1) : null;
                    return (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="font-medium text-foreground">{s.label}</span>
                          <span className="text-muted-foreground">
                            <span className="font-bold text-foreground">{s.value.toLocaleString()}</span>
                            {conv && <span className="ml-2 text-xs">({conv}% of visitors)</span>}
                          </span>
                        </div>
                        <div className="h-8 bg-muted rounded-md overflow-hidden">
                          <div className={cn("h-full transition-all", s.color)} style={{ width: `${Math.max(pct, 2)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Traffic Sources', icon: Globe, data: sourceData },
            { title: 'Device Mix', icon: Activity, data: deviceData },
            { title: 'Top Pages', icon: FileText, data: topPages },
          ].map(({ title, icon: Icon, data }) => (
            <div key={title} className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5" />{title}
              </h2>
              <div className="space-y-2">
                {data.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                ) : data.map((item, i) => (
                  <div key={item.label + i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground truncate max-w-[70%]" title={item.label}>{item.label}</span>
                      <span className="text-muted-foreground font-mono text-xs">
                        <span className="font-bold text-foreground">{item.value}</span> · {item.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {stats && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />Send SMS Alert
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {stats.smsSubscribers} opted-in subscribers
              </span>
            </h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your investor alert message…"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="min-h-[100px]" maxLength={160} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {smsMessage.length}/160 characters • "Reply STOP" will be auto-appended
                </span>
                <Button onClick={sendSmsAlert}
                  disabled={sendingSms || !smsMessage.trim() || stats.smsSubscribers === 0}
                  className="gap-2">
                  <Send className="w-4 h-4" />
                  {sendingSms ? 'Sending...' : `Send to ${stats.smsSubscribers} Subscribers`}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />Live Visitors
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {liveVisitors.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active visitors</p>
              ) : liveVisitors.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{v.device_type === 'mobile' ? '📱' : '💻'}</span>
                    <div>
                      <div className="text-sm font-medium">{v.subscriber ? `${v.subscriber.first_name} · ${v.subscriber.email}` : (v.country || 'Unknown')}</div>
                      <div className="text-xs text-muted-foreground">
                        {[v.city || v.country, v.ip_address, v.utm_source || 'Direct'].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(v.last_seen).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />Recent Signups
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentSignups.length === 0 ? (
                <p className="text-muted-foreground text-sm">No signups yet</p>
              ) : recentSignups.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{sub.first_name}</div>
                    <div className="text-xs text-muted-foreground">{sub.email}</div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      {sub.hasViewedReport && <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">📄 Report</span>}
                      {sub.hasViewedTearsheet && <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">📋 Tearsheet</span>}
                      {sub.sms_opted_in && <span className="px-2 py-0.5 bg-green-500/20 text-green-600 rounded text-xs">SMS</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />Live Activity Feed
            <span className="ml-auto text-xs font-normal text-muted-foreground">Last 20 events</span>
          </h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : recentEvents.map(e => (
              <div key={e.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded text-sm">
                <span className="text-lg">{e.device_type === 'mobile' ? '📱' : e.device_type === 'tablet' ? '📲' : '💻'}</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">{e.event_type}</span>
                <span className="text-muted-foreground truncate flex-1" title={e.page_url || ''}>
                  {(() => { try { return new URL(e.page_url || '').pathname; } catch { return e.page_url || '/'; } })()}
                </span>
                <span className="text-xs text-muted-foreground">{e.country || '—'}</span>
                <span className="text-xs text-muted-foreground font-mono">{new Date(e.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      {isAdmin && currentUserId && currentUserEmail && (
        <AdminChat currentUserId={currentUserId} currentUserEmail={currentUserEmail} />
      )}
    </div>
  );
}
