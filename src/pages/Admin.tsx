import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Eye, Mail, FileText, MessageSquare, TrendingUp, Activity, Send, Download, CalendarIcon, BarChart3, RefreshCw, UserPlus, Repeat, Newspaper, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Globe } from 'lucide-react';

interface TrendData {
  date: string;
  dateLabel: string;
  pageviews: number;
  visitors: number;
}

interface CountryData {
  country: string;
  countryCode: string | null;
  visitors: number;
  percentage: number;
}

interface BreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

interface DashboardStats {
  liveVisitors: number;
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  totalRevisits: number;
  totalPageviews: number;
  totalSubscribers: number;
  smsSubscribers: number;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  reportViews: number;
  reportShares: number;
  tearsheetViews: number;
  tearsheetShares: number;
  podcastPlays: number;
  podcastCompletes: number;
}

interface LiveVisitor {
  id: string;
  session_id: string;
  device_type: string;
  utm_source: string | null;
  country: string | null;
  last_seen: string;
}

interface Subscriber {
  id: string;
  first_name: string;
  email: string;
  phone: string | null;
  sms_opted_in: boolean;
  utm_source: string | null;
  created_at: string;
  hasViewedReport?: boolean;
  hasViewedTearsheet?: boolean;
}

// Convert country code to flag emoji
const getCountryFlag = (countryCode: string | null): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) => (
  <div className="bg-card rounded-xl border p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  </div>
);

// CSV Export helper
const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    '\uFEFF' + headers.join(','), // UTF-8 BOM for Excel
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
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
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
  const [onlineAdmins, setOnlineAdmins] = useState<Array<{ email: string; online_at: string }>>([]);
  const [engagementFeed, setEngagementFeed] = useState<Array<{
    id: string;
    kind: 'news' | 'research' | 'podcast';
    label: string;
    detail: string;
    who: string;
    visitor_id: string | null;
    country: string | null;
    created_at: string;
  }>>([]);
  const { toast } = useToast();
  
  // Track analytics on admin page
  useAnalytics();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email || '');
        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');
        
        setIsAdmin(roles && roles.length > 0);
      }
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setCurrentUserEmail(session?.user.email || '');
      if (session) {
        // Defer Supabase call to prevent deadlock
        setTimeout(async () => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin');
          setIsAdmin(roles && roles.length > 0);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Get date range based on selection
  const getDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return { from: dateRange.from, to: dateRange.to };
    }
    const now = new Date();
    const ranges: Record<string, Date> = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      'all': new Date(0),
    };
    return { from: ranges[timeRange], to: now };
  };

  // Fetch data when authenticated as admin
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

    // Real-time live visitors
    const channel = supabase
      .channel('live_visitors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_visitors' }, () => {
        fetchLiveVisitors();
      })
      .subscribe();

    const interval = setInterval(() => {
      fetchStats();
      fetchEngagementFeed();
      fetchRecentEvents();
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [isAuthenticated, isAdmin, timeRange, dateRange]);

  // Realtime presence: track which admins are viewing the dashboard right now
  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !currentUserEmail) return;

    const presenceChannel = supabase.channel('admin_presence', {
      config: { presence: { key: currentUserEmail } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState<{ email: string; online_at: string }>();
        const admins = Object.values(state).flat().map((p) => ({
          email: p.email,
          online_at: p.online_at,
        }));
        setOnlineAdmins(admins);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            email: currentUserEmail,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [isAuthenticated, isAdmin, currentUserEmail]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const normalizedEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/admin`;
    const createAccountAndEnter = async () => supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: redirectTo }
    });
    const signInAndEnter = async () => supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    const { error: signupError } = await createAccountAndEnter();
    if (!signupError) return;

    const signupMessage = signupError.message.toLowerCase();
    if (signupMessage.includes('already') || signupMessage.includes('registered') || signupMessage.includes('exists')) {
      const { error: signInError } = await signInAndEnter();
      if (signInError) {
        setAuthError('That email already has an account. Use the same password you created before, or use a new email address.');
      }
      return;
    }

    if (authMode === 'login') {
      const { error: signInError } = await signInAndEnter();
      if (!signInError) return;
    }

    setAuthError(signupError.message);
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

    const [
      { count: liveCount },
      { count: visitorCount },
      { count: pageviewCount },
      { count: subscriberCount },
      { count: smsCount },
      { count: sentCount },
      { count: openedCount },
      { count: clickedCount },
      { count: reportViewCount },
      { count: reportShareCount },
      { count: tearsheetViewCount },
      { count: tearsheetShareCount },
      { count: podcastPlayCount },
      { count: podcastCompleteCount },
      { data: breakdownData },
    ] = await Promise.all([
      supabase.from('live_visitors').select('*', { count: 'exact', head: true })
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'pageview').gte('created_at', since).lte('created_at', until),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true })
        .gte('created_at', since).lte('created_at', until),
      supabase.from('subscribers').select('*', { count: 'exact', head: true })
        .gte('created_at', since).lte('created_at', until),
      supabase.from('subscribers').select('*', { count: 'exact', head: true })
        .eq('sms_opted_in', true).gte('created_at', since).lte('created_at', until),
      supabase.from('email_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'sent').gte('timestamp', since).lte('timestamp', until),
      supabase.from('email_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'opened').gte('timestamp', since).lte('timestamp', until),
      supabase.from('email_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'clicked').gte('timestamp', since).lte('timestamp', until),
      supabase.from('document_engagement').select('*', { count: 'exact', head: true })
        .eq('document_type', 'report').eq('action', 'view').gte('created_at', since).lte('created_at', until),
      supabase.from('document_engagement').select('*', { count: 'exact', head: true })
        .eq('document_type', 'report').eq('action', 'share').gte('created_at', since).lte('created_at', until),
      supabase.from('document_engagement').select('*', { count: 'exact', head: true })
        .eq('document_type', 'tearsheet').eq('action', 'view').gte('created_at', since).lte('created_at', until),
      supabase.from('document_engagement').select('*', { count: 'exact', head: true })
        .eq('document_type', 'tearsheet').eq('action', 'share').gte('created_at', since).lte('created_at', until),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'podcast_play').gte('created_at', since).lte('created_at', until),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true })
        .eq('event_type', 'podcast_complete').gte('created_at', since).lte('created_at', until),
      supabase.rpc('get_visitor_breakdown', { start_date: since, end_date: until }),
    ]);

    const breakdown = Array.isArray(breakdownData) ? breakdownData[0] : null;

    setStats({
      liveVisitors: liveCount || 0,
      totalVisitors: visitorCount || 0,
      newVisitors: Number(breakdown?.new_visitors) || 0,
      returningVisitors: Number(breakdown?.returning_visitors) || 0,
      totalRevisits: Number(breakdown?.total_revisits) || 0,
      totalPageviews: pageviewCount || 0,
      totalSubscribers: subscriberCount || 0,
      smsSubscribers: smsCount || 0,
      emailsSent: sentCount || 0,
      emailsOpened: openedCount || 0,
      emailsClicked: clickedCount || 0,
      reportViews: reportViewCount || 0,
      reportShares: reportShareCount || 0,
      tearsheetViews: tearsheetViewCount || 0,
      tearsheetShares: tearsheetShareCount || 0,
      podcastPlays: podcastPlayCount || 0,
      podcastCompletes: podcastCompleteCount || 0,
    });
  };

  const fetchTrendData = async () => {
    const { from, to } = getDateRange();

    // Use RPC function to aggregate server-side (avoids 1000-row limit)
    const { data, error } = await supabase.rpc('get_daily_analytics', {
      start_date: from.toISOString(),
      end_date: to.toISOString()
    });

    if (error || !data) {
      console.error('Error fetching trend data:', error);
      setTrendData([]);
      return;
    }

    // Create an array of all days in range and map RPC results
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
    const since = from.toISOString();
    const until = to.toISOString();

    const { data } = await supabase
      .from('analytics_events')
      .select('country, country_code, visitor_id')
      .gte('created_at', since)
      .lte('created_at', until)
      .not('country', 'is', null);

    if (!data || data.length === 0) {
      setCountryData([]);
      return;
    }

    // Aggregate by country
    const countryMap: Record<string, { countryCode: string | null; visitors: Set<string> }> = {};
    data.forEach((e) => {
      const country = e.country || 'Unknown';
      if (!countryMap[country]) {
        countryMap[country] = { countryCode: e.country_code, visitors: new Set() };
      }
      if (e.visitor_id) {
        countryMap[country].visitors.add(e.visitor_id);
      }
    });

    const totalVisitors = new Set(data.map((e) => e.visitor_id).filter(Boolean)).size;

    const countryStats: CountryData[] = Object.entries(countryMap)
      .map(([country, info]) => ({
        country,
        countryCode: info.countryCode,
        visitors: info.visitors.size,
        percentage: totalVisitors > 0 ? Math.round((info.visitors.size / totalVisitors) * 100) : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10); // Top 10 countries

    setCountryData(countryStats);
  };

  const fetchBreakdowns = async () => {
    const { from, to } = getDateRange();
    const { data } = await supabase
      .from('analytics_events')
      .select('utm_source, referrer, device_type, page_url, visitor_id')
      .eq('event_type', 'pageview')
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .limit(1000);

    if (!data) return;

    const buildBreakdown = (key: (e: typeof data[0]) => string): BreakdownItem[] => {
      const map: Record<string, Set<string>> = {};
      data.forEach(e => {
        const k = key(e) || 'Unknown';
        if (!map[k]) map[k] = new Set();
        if (e.visitor_id) map[k].add(e.visitor_id);
      });
      const total = Object.values(map).reduce((s, v) => s + v.size, 0) || 1;
      return Object.entries(map)
        .map(([label, set]) => ({ label, value: set.size, percentage: Math.round((set.size / total) * 100) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    };

    setSourceData(buildBreakdown(e => {
      if (e.utm_source) return e.utm_source;
      if (e.referrer) {
        try { return new URL(e.referrer).hostname.replace('www.', ''); } catch { return 'Direct'; }
      }
      return 'Direct';
    }));
    setDeviceData(buildBreakdown(e => e.device_type || 'unknown'));
    setTopPages(buildBreakdown(e => {
      try { return new URL(e.page_url || '').pathname || '/'; } catch { return e.page_url || '/'; }
    }));
  };

  const fetchRecentEvents = async () => {
    const { data } = await supabase
      .from('analytics_events')
      .select('id, event_type, page_url, country, device_type, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setRecentEvents(data || []);
  };

  const fetchEngagementFeed = async () => {
    const { from, to } = getDateRange();
    const since = from.toISOString();
    const until = to.toISOString();

    const { data: actionEvents } = await supabase
      .from('analytics_events')
      .select('id, event_type, event_data, country, visitor_id, created_at')
      .in('event_type', ['news_click', 'podcast_play', 'podcast_complete'])
      .gte('created_at', since)
      .lte('created_at', until)
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: docEvents } = await supabase
      .from('document_engagement')
      .select('id, document_type, action, visitor_id, subscriber_id, created_at')
      .eq('action', 'view')
      .gte('created_at', since)
      .lte('created_at', until)
      .order('created_at', { ascending: false })
      .limit(100);

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
        .from('subscribers')
        .select('id, first_name, email')
        .in('id', Array.from(subscriberIds));
      (directSubs || []).forEach((s) => {
        visitorToSubscriber.set(`sub:${s.id}`, { name: s.first_name, email: s.email });
      });
    }

    if (visitorIds.size > 0) {
      const { data: linked } = await supabase
        .from('document_engagement')
        .select('visitor_id, subscriber_id')
        .in('visitor_id', Array.from(visitorIds))
        .not('subscriber_id', 'is', null);
      const linkedMap = new Map<string, string>();
      (linked || []).forEach((row) => {
        if (row.visitor_id && row.subscriber_id) linkedMap.set(row.visitor_id, row.subscriber_id);
      });
      const linkedSubIds = Array.from(new Set(linkedMap.values()));
      if (linkedSubIds.length > 0) {
        const { data: subs } = await supabase
          .from('subscribers')
          .select('id, first_name, email')
          .in('id', linkedSubIds);
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
      press_release: 'Press Release (BioVaxys)',
      about: 'About the Company',
    };

    const newsItems = (actionEvents || []).filter((e) => e.event_type === 'news_click').map((e) => {
      const data = (e.event_data as { title?: string; source?: string } | null) || {};
      return {
        id: e.id,
        kind: 'news' as const,
        label: 'Clicked news article',
        detail: data.title || 'News article',
        who: labelFor(e.visitor_id, null),
        visitor_id: e.visitor_id,
        country: e.country,
        created_at: e.created_at!,
      };
    });

    const podcastItems = (actionEvents || []).filter((e) => e.event_type.startsWith('podcast')).map((e) => ({
      id: e.id,
      kind: 'podcast' as const,
      label: e.event_type === 'podcast_complete' ? 'Finished podcast' : 'Played podcast',
      detail: 'Wall Street Deal Room — Predictiv AI',
      who: labelFor(e.visitor_id, null),
      visitor_id: e.visitor_id,
      country: e.country,
      created_at: e.created_at!,
    }));

    const docItems = (docEvents || []).map((e) => ({
      id: e.id,
      kind: 'research' as const,
      label: 'Viewed research doc',
      detail: docTypeLabel[e.document_type] || e.document_type,
      who: labelFor(e.visitor_id, e.subscriber_id),
      visitor_id: e.visitor_id,
      country: null,
      created_at: e.created_at!,
    }));

    const merged = [...newsItems, ...podcastItems, ...docItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 60);

    setEngagementFeed(merged);
  };


  const fetchLiveVisitors = async () => {
    const { data } = await supabase
      .from('live_visitors')
      .select('*')
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order('last_seen', { ascending: false });
    setLiveVisitors((data as LiveVisitor[]) || []);
  };

  const fetchRecentSignups = async () => {
    const { data: subs } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!subs || subs.length === 0) {
      setRecentSignups([]);
      return;
    }
    
    // Get engagement for these subscribers
    const subIds = subs.map(s => s.id);
    const { data: engagement } = await supabase
      .from('document_engagement')
      .select('subscriber_id, document_type')
      .in('subscriber_id', subIds);
    
    // Merge engagement into signups
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
      const { data, error } = await supabase.functions.invoke('send-sms-digest', {
        body: { message: smsMessage }
      });
      
      if (error) throw error;
      
      toast({ 
        title: "SMS Alert Sent", 
        description: `Sent to ${data.sent} subscribers (${data.failed} failed)` 
      });
      setSmsMessage('');
    } catch (err: any) {
      toast({ 
        title: "Failed to send", 
        description: err.message || "Unknown error", 
        variant: "destructive" 
      });
    } finally {
      setSendingSms(false);
    }
  };

  // Export functions
  const exportSubscribers = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('subscribers')
        .select('first_name, email, phone, sms_opted_in, source, utm_source, utm_medium, utm_campaign, created_at')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
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
    } finally {
      setExporting(false);
    }
  };

  const exportEmailEvents = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('email_events')
        .select('email, event_type, campaign_id, email_id, timestamp')
        .gte('timestamp', from.toISOString())
        .lte('timestamp', to.toISOString())
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      const formatted = (data || []).map(e => ({
        ...e,
        timestamp: format(new Date(e.timestamp!), 'yyyy-MM-dd HH:mm:ss')
      }));
      
      const filename = `email_events_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} email events exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const exportDocumentEngagement = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('document_engagement')
        .select('document_type, action, visitor_id, session_id, created_at')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formatted = (data || []).map(d => ({
        ...d,
        created_at: format(new Date(d.created_at!), 'yyyy-MM-dd HH:mm:ss')
      }));
      
      const filename = `document_engagement_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} engagement records exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const exportAnalyticsSummary = async () => {
    setExporting(true);
    try {
      const { from, to } = getDateRange();
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_type, created_at, device_type, utm_source')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Aggregate by day
      const dailyStats: Record<string, { date: string; pageviews: number; visitors: Set<string>; mobile: number; desktop: number }> = {};
      (data || []).forEach(e => {
        const day = format(new Date(e.created_at!), 'yyyy-MM-dd');
        if (!dailyStats[day]) {
          dailyStats[day] = { date: day, pageviews: 0, visitors: new Set(), mobile: 0, desktop: 0 };
        }
        dailyStats[day].pageviews++;
        if (e.device_type === 'mobile') dailyStats[day].mobile++;
        else dailyStats[day].desktop++;
      });
      
      const formatted = Object.values(dailyStats).map(d => ({
        date: d.date,
        pageviews: d.pageviews,
        mobile_views: d.mobile,
        desktop_views: d.desktop
      })).sort((a, b) => b.date.localeCompare(a.date));
      
      const filename = `analytics_summary_${format(from, 'yyyy-MM-dd')}_to_${format(to, 'yyyy-MM-dd')}.csv`;
      exportToCSV(formatted, filename);
      toast({ title: "Export complete", description: `${formatted.length} days of analytics exported` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Login/Signup form
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
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Enter Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Loading dashboard role/permissions
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const openRate = stats && stats.emailsSent > 0 ? ((stats.emailsOpened / stats.emailsSent) * 100).toFixed(1) : '0';
  const clickRate = stats && stats.emailsOpened > 0 ? ((stats.emailsClicked / stats.emailsOpened) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Predictiv AI IR Command Center</h1>
            <p className="text-primary-foreground/70 text-sm">Predictiv AI Inc. (CSE: PAI · FWB: 7IT) · Real-time investor traffic & engagement</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick presets */}
            <div className="flex gap-1">
              {[
                { key: '24h', label: '24h' },
                { key: '7d', label: '7d' },
                { key: '30d', label: '30d' },
                { key: 'all', label: 'All' },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={timeRange === key && !dateRange ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    "text-primary-foreground hover:bg-white/20",
                    timeRange === key && !dateRange && "bg-white/20"
                  )}
                  onClick={() => {
                    setTimeRange(key);
                    setDateRange(undefined);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            
            {/* Custom date range picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={dateRange ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    "text-primary-foreground hover:bg-white/20 gap-2",
                    dateRange && "bg-white/20"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                    : 'Custom'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.from && range?.to) {
                      setTimeRange('custom');
                    }
                  }}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {/* Refresh button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-white/20 gap-2"
              onClick={() => {
                fetchStats();
                fetchTrendData();
                fetchCountryData();
                fetchLiveVisitors();
                fetchRecentSignups();
                fetchRecentEvents();
                fetchEngagementFeed();
                toast({ title: "Refreshed", description: "Dashboard data updated" });
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-white/20 gap-2"
                  disabled={exporting}
                >
                  <Download className="w-4 h-4" />
                  {exporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportAnalyticsSummary}>
                  Analytics Summary (Daily)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportSubscribers}>
                  Subscriber List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportEmailEvents}>
                  Email Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportDocumentEngagement}>
                  Document Engagement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Live Visitors Alert */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="relative">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping" />
          </div>
          <div>
            <span className="text-3xl font-bold text-green-600">{stats?.liveVisitors || 0}</span>
            <span className="text-green-600 ml-2">visitors on site right now</span>
          </div>
        </div>

        {/* Team Online (admins viewing the dashboard) */}
        <div className="bg-card border rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Team Online</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {onlineAdmins.length} viewing now
              </span>
            </div>
          </div>
          {onlineAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground">Just you so far.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {onlineAdmins.map((admin) => (
                <div
                  key={admin.email}
                  className="flex items-center gap-2 bg-background border rounded-full px-3 py-1.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-sm text-foreground">
                    {admin.email}
                    {admin.email === currentUserEmail && (
                      <span className="text-muted-foreground ml-1">(you)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Stats Grid */}
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="Unique Visitors" value={stats.totalVisitors} icon={Users} />
              <StatCard label="All Events" value={stats.totalPageviews} icon={Eye} />
              <StatCard label="Subscribers" value={stats.totalSubscribers} icon={Mail} />
              <StatCard label="SMS Opted-In" value={stats.smsSubscribers} icon={MessageSquare} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard label="New Visitors (first time)" value={stats.newVisitors} icon={UserPlus} />
              <StatCard label="Returning Visitors" value={stats.returningVisitors} icon={Repeat} />
              <StatCard label="Total Repeat Visit-Days" value={stats.totalRevisits} icon={Activity} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <StatCard label="Podcast Plays (clicked listen)" value={stats.podcastPlays} icon={Headphones} />
              <StatCard label="Podcast Completed" value={stats.podcastCompletes} icon={Headphones} />
            </div>
          </>
        )}

        {/* Visitor Trend Chart */}
        {trendData.length > 0 && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Visitor Trends
            </h2>
            <ChartContainer
              config={{
                pageviews: {
                  label: "Pageviews",
                  color: "hsl(var(--primary))"
                },
                visitors: {
                  label: "Unique Visitors",
                  color: "hsl(142.1 76.2% 36.3%)" // green
                }
              }}
              className="h-[300px] w-full"
            >
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
                <XAxis 
                  dataKey="dateLabel" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorPageviews)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(142.1 76.2% 36.3%)"
                  strokeWidth={2}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {/* Country Breakdown Chart */}
        {countryData.length > 0 && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Visitor Locations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <ChartContainer
                config={{
                  visitors: {
                    label: "Visitors",
                    color: "hsl(var(--primary))"
                  }
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis 
                    type="category" 
                    dataKey="country" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={false} 
                    className="fill-muted-foreground"
                    width={75}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                    {countryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fillOpacity={1 - (index * 0.08)} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>

              {/* Country List */}
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

        {/* Conversion Funnel */}
        {stats && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Investor Conversion Funnel
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

        {/* Traffic Sources / Devices / Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Traffic Sources', icon: Globe, data: sourceData },
            { title: 'Device Mix', icon: Activity, data: deviceData },
            { title: 'Top Pages', icon: FileText, data: topPages },
          ].map(({ title, icon: Icon, data }) => (
            <div key={title} className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {title}
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
              <Mail className="w-5 h-5" />
              Email Campaign Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{stats.emailsSent}</div>
                <div className="text-sm text-muted-foreground">Sent</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.emailsOpened}</div>
                <div className="text-sm text-muted-foreground">Opened</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{openRate}%</div>
                <div className="text-sm text-muted-foreground">Open Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.emailsClicked}</div>
                <div className="text-sm text-muted-foreground">Clicked</div>
              </div>
              <div className="text-center p-4 bg-indigo-500/10 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{clickRate}%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* SMS Alert Broadcast */}
        {stats && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Send SMS Alert
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {stats.smsSubscribers} opted-in subscribers
              </span>
            </h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your investor alert message... (e.g., 'PAI ALERT: New PR out — Shift × Arcasia JV milestone. Visit predictiv-ai.lovable.app for details.')"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="min-h-[100px]"
                maxLength={160}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {smsMessage.length}/160 characters • "Reply STOP" will be auto-appended
                </span>
                <Button 
                  onClick={sendSmsAlert} 
                  disabled={sendingSms || !smsMessage.trim() || stats.smsSubscribers === 0}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sendingSms ? 'Sending...' : `Send to ${stats.smsSubscribers} Subscribers`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Document Engagement */}
        {stats && (
          <div className="bg-card rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Engagement
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.reportViews}</div>
                <div className="text-sm text-muted-foreground">Report Views</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.reportShares}</div>
                <div className="text-sm text-muted-foreground">Report Shares</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.tearsheetViews}</div>
                <div className="text-sm text-muted-foreground">Tear Sheet Views</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.tearsheetShares}</div>
                <div className="text-sm text-muted-foreground">Tear Sheet Shares</div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Visitors */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Live Visitors
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {liveVisitors.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active visitors</p>
              ) : (
                liveVisitors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{v.device_type === 'mobile' ? '📱' : '💻'}</span>
                      <div>
                        <div className="text-sm font-medium">{v.country || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{v.utm_source || 'Direct'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(v.last_seen).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Signups
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentSignups.length === 0 ? (
                <p className="text-muted-foreground text-sm">No signups yet</p>
              ) : (
                recentSignups.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">{sub.first_name}</div>
                      <div className="text-xs text-muted-foreground">{sub.email}</div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex gap-1">
                        {sub.hasViewedReport && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">📄 Report</span>
                        )}
                        {sub.hasViewedTearsheet && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">📋 Tearsheet</span>
                        )}
                        {sub.sms_opted_in && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-600 rounded text-xs">SMS</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Engagement: who clicked news, viewed research, played podcast */}
        <div className="bg-card rounded-xl border p-6 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Who Clicked What
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            News articles · Research docs · Podcast plays. Names appear once a visitor signs up.
          </p>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {engagementFeed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No engagement yet in this date range.</p>
            ) : engagementFeed.map((e) => {
              const kindStyles: Record<string, string> = {
                news: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                research: 'bg-primary/10 text-primary border-primary/30',
                podcast: 'bg-green-500/10 text-green-500 border-green-500/30',
              };
              const kindIcon: Record<string, JSX.Element> = {
                news: <Newspaper className="w-3.5 h-3.5" />,
                research: <FileText className="w-3.5 h-3.5" />,
                podcast: <Headphones className="w-3.5 h-3.5" />,
              };
              return (
                <div key={`${e.kind}-${e.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded text-sm border border-transparent hover:border-border">
                  <span className={cn('flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium', kindStyles[e.kind])}>
                    {kindIcon[e.kind]}
                    {e.kind === 'news' ? 'News' : e.kind === 'podcast' ? 'Podcast' : 'Research'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{e.who}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {e.label}: <span className="text-foreground/80">{e.detail}</span>
                    </div>
                  </div>
                  {e.country && (
                    <span className="text-xs text-muted-foreground hidden md:inline">{e.country}</span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-card rounded-xl border p-6 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live Activity Feed
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
    </div>
  );
}
