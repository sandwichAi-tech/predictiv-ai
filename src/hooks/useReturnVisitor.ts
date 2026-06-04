import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getSubscriberId, getVisitorId } from "@/lib/visitorIdentity";

const COOKIE_NAME = "_pai_vid";
const COOKIE_DAYS = 30;

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export function useReturnVisitor() {
  useEffect(() => {
    const existingCookie = getCookie(COOKIE_NAME);
    const vid = existingCookie || getVisitorId();
    if (!localStorage.getItem("_vid")) localStorage.setItem("_vid", vid);

    if (existingCookie && existingCookie === vid) {
      supabase
        .from("analytics_events")
        .insert([{
          event_type: "return_visit",
          visitor_id: vid,
          session_id: getSessionId(),
          subscriber_id: getSubscriberId(),
          page_url: window.location.href,
          event_data: { cookie: "_pai_vid" },
        }])
        .then(() => {}, (e) => console.error("return_visit insert", e));
    }

    setCookie(COOKIE_NAME, vid, COOKIE_DAYS);
  }, []);
}
