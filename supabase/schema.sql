-- Vinoos analytics + AI chat schema.
-- Run once in the Supabase SQL Editor (project kdbmcsdqyebekzmliqgh, or wherever
-- SUPABASE_URL points). Idempotent: safe to re-run. RLS is enabled with NO
-- policies on purpose, so only the service-role key (server-side) can read/write;
-- the public/anon key sees zero rows.

-- ── Per-visit analytics log ──
create table if not exists public.visits (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  ip           text,
  country      text, region text, city text,
  latitude     text, longitude text, postal_code text,
  user_agent   text, browser text, os text, device_type text,
  referrer     text, path text, is_returning boolean, screen text,
  language     text, languages text,
  -- device/browser fingerprint (client-reported)
  timezone text, viewport text, pixel_ratio real, color_depth integer,
  cpu_cores integer, device_memory real, touch_points integer,
  gpu text, gpu_vendor text, color_scheme text, platform text,
  device_model text, os_version text, cpu_arch text,
  connection_type text, downlink real, rtt integer,
  -- network intelligence (server-side ipwho.is + UA heuristics)
  isp text, org text, asn text, is_hosting boolean, is_bot boolean,
  -- identity + traffic source
  visitor_id text, session_id text, visit_count integer,
  utm_source text, utm_medium text, utm_campaign text, query_string text,
  -- engagement (second beacon on exit)
  dwell_ms integer, sections_viewed text, chat_used boolean, clicks integer
);
create index if not exists visits_created_at_idx on public.visits (created_at desc);
create index if not exists visits_session_id_idx on public.visits (session_id);

-- ── Full AI chat transcript ──
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ip text, session_id text, question text, answer text, model text
);
create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at desc);

-- ── Per-IP daily message counter (chat rate limit) ──
create table if not exists public.chat_usage (
  ip text not null, day date not null, count integer not null default 0,
  primary key (ip, day)
);

-- Atomic increment-and-read for the rate limiter (avoids read-then-write race:
-- N concurrent requests from one IP would each read the same count otherwise).
create or replace function public.increment_chat_usage(p_ip text)
returns integer language plpgsql as $$
declare new_count integer;
begin
  insert into public.chat_usage (ip, day, count) values (p_ip, current_date, 1)
  on conflict (ip, day) do update set count = public.chat_usage.count + 1
  returning count into new_count;
  return new_count;
end; $$;

-- Refund one message (used when generation fails after the slot was charged).
-- Never drops below zero; returns the resulting count (0 if no row exists yet).
create or replace function public.decrement_chat_usage(p_ip text)
returns integer language plpgsql as $$
declare new_count integer;
begin
  update public.chat_usage
     set count = greatest(count - 1, 0)
   where ip = p_ip and day = current_date
  returning count into new_count;
  return coalesce(new_count, 0);
end; $$;

-- Lock everything to service-role only.
alter table public.visits        enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_usage    enable row level security;
-- (No policies on purpose -> anon/public key gets zero rows.)
