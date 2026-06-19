import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface CountryVisitor {
  country: string;
  country_code: string | null;
  visitors: number;
}

const getCountryFlag = (countryCode: string | null): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode.toUpperCase().split('').map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const LiveVisitorCountries = () => {
  const [countries, setCountries] = useState<CountryVisitor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchLive = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/live-visitors-public`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setCountries(data.countries || []);
          setTotal(data.total || 0);
          setLoading(false);
        }
      } catch {
        // Silently fail — this is decorative live data
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading || total === 0) return null;

  return (
    <section className="border-b border-border bg-background/50">
      <div className="max-w-4xl mx-auto py-3 px-5">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              Live Visitors
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {countries.map((c) => (
              <div
                key={c.country}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1"
                title={`${c.country}: ${c.visitors} visitor${c.visitors !== 1 ? 's' : ''}`}
              >
                <span className="text-sm leading-none">{getCountryFlag(c.country_code)}</span>
                <span className="text-[11px] font-medium text-foreground tabular-nums">{c.visitors}</span>
              </div>
            ))}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-1.5 shrink-0">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
              {total} total
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveVisitorCountries;
