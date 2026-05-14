import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QuoteData {
  [key: string]: {
    price?: number;
    volume?: number;
  } | null;
}

export const useStockQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stock-quote-data');
        
        if (error) {
          console.error('Error fetching quote data:', error);
          return;
        }
        
        if (data?.quotes) {
          setQuotes(data.quotes);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuotes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { quotes, loading };
};
