CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: get_daily_analytics(timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_daily_analytics(start_date timestamp with time zone, end_date timestamp with time zone) RETURNS TABLE(day date, pageviews bigint, unique_visitors bigint)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    DATE(created_at) as day,
    COUNT(*) as pageviews,
    COUNT(DISTINCT visitor_id) as unique_visitors
  FROM public.analytics_events
  WHERE created_at >= start_date AND created_at <= end_date
  GROUP BY DATE(created_at)
  ORDER BY day ASC;
$$;


--
-- Name: get_hot_leads(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_hot_leads() RETURNS TABLE(email text, first_name text, open_count bigint, click_count bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.email,
    s.first_name,
    COUNT(*) FILTER (WHERE e.event_type = 'opened') as open_count,
    COUNT(*) FILTER (WHERE e.event_type = 'clicked') as click_count
  FROM public.email_events e
  LEFT JOIN public.subscribers s ON s.email = e.email
  GROUP BY e.email, s.first_name
  HAVING COUNT(*) FILTER (WHERE e.event_type = 'opened') >= 2
  ORDER BY open_count DESC, click_count DESC
  LIMIT 50;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text,
    visitor_id text,
    event_type text NOT NULL,
    event_data jsonb,
    page_url text,
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    user_agent text,
    device_type text,
    created_at timestamp with time zone DEFAULT now(),
    ip_address text,
    country text,
    country_code text,
    city text,
    region text
);


--
-- Name: document_engagement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_engagement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text,
    visitor_id text,
    subscriber_id uuid,
    document_type text NOT NULL,
    action text NOT NULL,
    view_duration_seconds integer,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: drip_campaign_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drip_campaign_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    signup_id uuid NOT NULL,
    email_1_sent_at timestamp with time zone,
    email_2_sent_at timestamp with time zone,
    email_3_sent_at timestamp with time zone,
    email_4_sent_at timestamp with time zone,
    email_5_sent_at timestamp with time zone,
    unsubscribed boolean DEFAULT false,
    unsubscribed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subscriber_id uuid,
    email text NOT NULL,
    event_type text NOT NULL,
    campaign_id text,
    email_id text,
    link_url text,
    user_agent text,
    ip_address text,
    "timestamp" timestamp with time zone DEFAULT now()
);


--
-- Name: live_visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_visitors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    visitor_id text,
    page_url text,
    referrer text,
    utm_source text,
    device_type text,
    country text,
    last_seen timestamp with time zone DEFAULT now(),
    country_code text,
    city text,
    region text,
    ip_address text
);


--
-- Name: newsletter_signups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_signups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    email text NOT NULL,
    source text DEFAULT 'landing_page'::text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: outbound_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outbound_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    subject_a text NOT NULL,
    subject_b text,
    sent_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: outbound_email_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outbound_email_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    campaign_id uuid,
    email text NOT NULL,
    subject_variant text,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    mailgun_id text
);


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_address text NOT NULL,
    action text DEFAULT 'signup'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    email text NOT NULL,
    phone text,
    sms_opted_in boolean DEFAULT false,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    status text DEFAULT 'active'::text,
    source text DEFAULT 'landing_page'::text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: document_engagement document_engagement_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_engagement
    ADD CONSTRAINT document_engagement_pkey PRIMARY KEY (id);


--
-- Name: drip_campaign_status drip_campaign_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_campaign_status
    ADD CONSTRAINT drip_campaign_status_pkey PRIMARY KEY (id);


--
-- Name: email_events email_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_pkey PRIMARY KEY (id);


--
-- Name: live_visitors live_visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_visitors
    ADD CONSTRAINT live_visitors_pkey PRIMARY KEY (id);


--
-- Name: live_visitors live_visitors_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_visitors
    ADD CONSTRAINT live_visitors_session_id_key UNIQUE (session_id);


--
-- Name: newsletter_signups newsletter_signups_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_signups
    ADD CONSTRAINT newsletter_signups_email_key UNIQUE (email);


--
-- Name: newsletter_signups newsletter_signups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_signups
    ADD CONSTRAINT newsletter_signups_pkey PRIMARY KEY (id);


--
-- Name: outbound_campaigns outbound_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outbound_campaigns
    ADD CONSTRAINT outbound_campaigns_pkey PRIMARY KEY (id);


--
-- Name: outbound_email_log outbound_email_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outbound_email_log
    ADD CONSTRAINT outbound_email_log_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_email_key UNIQUE (email);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_analytics_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_created ON public.analytics_events USING btree (created_at);


--
-- Name: idx_analytics_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_session ON public.analytics_events USING btree (session_id);


--
-- Name: idx_analytics_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_type ON public.analytics_events USING btree (event_type);


--
-- Name: idx_analytics_visitor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_visitor ON public.analytics_events USING btree (visitor_id);


--
-- Name: idx_doc_engagement_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_doc_engagement_action ON public.document_engagement USING btree (action);


--
-- Name: idx_doc_engagement_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_doc_engagement_type ON public.document_engagement USING btree (document_type);


--
-- Name: idx_drip_campaign_signup; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_drip_campaign_signup ON public.drip_campaign_status USING btree (signup_id);


--
-- Name: idx_email_events_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_email ON public.email_events USING btree (email);


--
-- Name: idx_email_events_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_events_type ON public.email_events USING btree (event_type);


--
-- Name: idx_live_visitors_last_seen; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_live_visitors_last_seen ON public.live_visitors USING btree (last_seen);


--
-- Name: idx_live_visitors_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_live_visitors_session ON public.live_visitors USING btree (session_id);


--
-- Name: idx_newsletter_signups_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_signups_created_at ON public.newsletter_signups USING btree (created_at);


--
-- Name: idx_newsletter_signups_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_signups_email ON public.newsletter_signups USING btree (email);


--
-- Name: idx_rate_limits_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limits_created_at ON public.rate_limits USING btree (created_at);


--
-- Name: idx_rate_limits_ip_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limits_ip_action ON public.rate_limits USING btree (ip_address, action);


--
-- Name: subscribers update_subscribers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON public.subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: document_engagement document_engagement_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_engagement
    ADD CONSTRAINT document_engagement_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.subscribers(id);


--
-- Name: drip_campaign_status drip_campaign_status_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_campaign_status
    ADD CONSTRAINT drip_campaign_status_subscriber_id_fkey FOREIGN KEY (signup_id) REFERENCES public.subscribers(id) ON DELETE CASCADE;


--
-- Name: email_events email_events_subscriber_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_events
    ADD CONSTRAINT email_events_subscriber_id_fkey FOREIGN KEY (subscriber_id) REFERENCES public.subscribers(id);


--
-- Name: outbound_email_log outbound_email_log_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outbound_email_log
    ADD CONSTRAINT outbound_email_log_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.outbound_campaigns(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: subscribers Admins can update subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update subscribers" ON public.subscribers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: analytics_events Admins can view analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view analytics" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: document_engagement Admins can view document engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view document engagement" ON public.document_engagement FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: email_events Admins can view email events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view email events" ON public.email_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: live_visitors Admins can view live visitors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view live visitors" ON public.live_visitors FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: subscribers Admins can view subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: document_engagement Allow public insert for document engagement; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert for document engagement" ON public.document_engagement FOR INSERT WITH CHECK (true);


--
-- Name: live_visitors Anyone can register presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can register presence" ON public.live_visitors FOR INSERT WITH CHECK (true);


--
-- Name: subscribers Anyone can subscribe; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_signups Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_signups FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: analytics_events Anyone can track events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can track events" ON public.analytics_events FOR INSERT WITH CHECK (true);


--
-- Name: live_visitors Anyone can update their presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update their presence" ON public.live_visitors FOR UPDATE USING (true);


--
-- Name: live_visitors Authenticated can delete presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can delete presence" ON public.live_visitors FOR DELETE TO authenticated USING (true);


--
-- Name: live_visitors Authenticated can register presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can register presence" ON public.live_visitors FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: analytics_events Authenticated can track events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can track events" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: live_visitors Authenticated can update presence; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can update presence" ON public.live_visitors FOR UPDATE TO authenticated USING (true);


--
-- Name: drip_campaign_status No public access to drip status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public access to drip status" ON public.drip_campaign_status USING (false);


--
-- Name: outbound_email_log No public access to email log; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public access to email log" ON public.outbound_email_log USING (false);


--
-- Name: outbound_campaigns No public access to outbound campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public access to outbound campaigns" ON public.outbound_campaigns USING (false);


--
-- Name: rate_limits No public access to rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public access to rate limits" ON public.rate_limits USING (false);


--
-- Name: newsletter_signups No public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public read access" ON public.newsletter_signups FOR SELECT USING (false);


--
-- Name: analytics_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

--
-- Name: document_engagement; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document_engagement ENABLE ROW LEVEL SECURITY;

--
-- Name: drip_campaign_status; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.drip_campaign_status ENABLE ROW LEVEL SECURITY;

--
-- Name: email_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

--
-- Name: live_visitors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.live_visitors ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_signups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

--
-- Name: outbound_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.outbound_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: outbound_email_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.outbound_email_log ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;