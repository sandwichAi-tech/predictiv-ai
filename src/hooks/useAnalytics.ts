import { useEffect, useRef, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('_vid');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('_vid', visitorId);
  }
  return visitorId;
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('_sid');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('_sid', sessionId);
  }
  return sessionId;
};

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
};

const trackViaEdgeFunction = async (payload: Record<string, unknown>) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/track-analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error('[Analytics] Edge function error:', await response.text());
    } else {
      console.log('[Analytics] Event tracked via edge function');
    }
  } catch (err) {
    console.error('[Analytics] Edge function exception:', err);
  }
};

export function useAnalytics() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const utm = getUTMParams();

    // Track pageview via edge function (includes IP geolocation)
    trackViaEdgeFunction({
      event_type: 'pageview',
      session_id: sessionId,
      visitor_id: visitorId,
      page_url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      ...utm,
    });

    // Presence update interval
    const updatePresence = () => {
      trackViaEdgeFunction({
        event_type: 'presence',
        session_id: sessionId,
        visitor_id: visitorId,
        page_url: window.location.href,
        referrer: document.referrer || null,
        device_type: getDeviceType(),
        utm_source: utm.utm_source,
      });
    };

    const interval = setInterval(updatePresence, 30000); // Update every 30s

    return () => {
      clearInterval(interval);
    };
  }, []);

  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, unknown>) => {
    const utm = getUTMParams();
    await trackViaEdgeFunction({
      event_type: eventType,
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      page_url: window.location.href,
      device_type: getDeviceType(),
      event_data: eventData || null,
      ...utm,
    });
  }, []);

  const trackDocumentEngagement = useCallback(async (
    documentType: 'report' | 'tearsheet',
    action: 'view' | 'download'
  ) => {
    // Track via edge function for location data
    await trackEvent(`${documentType}_${action}`);
  }, [trackEvent]);

  return { trackEvent, trackDocumentEngagement };
}
