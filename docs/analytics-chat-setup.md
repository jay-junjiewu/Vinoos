# Analytics + AI Chat — setup & operations

This site has three porting targets from the `junjiewu.com` handoff:

| Feature | Status in this repo |
|---|---|
| **A. Path/visitor analytics** | **Added** — `/api/track`, `/api/stats`, client trackers, `/stats` dashboard |
| **B. AI chat (concierge)** | **Added** — `/api/chat` (Gemini via Genkit), grounded prompt, `ChatWidget` |
| **C. SEO** | **Already native** — see "SEO audit" below; nothing new required |

All analytics/chat code is **fail-open**: if the env vars below are missing, DB writes
silently no-op and the chat still answers. Nothing here can break a page render.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production +
Preview), and in a local `.env.local` for testing. (`.env*` is git-ignored, so there
is no committed example file — this table is the source of truth.)

| Var | Used by | Notes |
|---|---|---|
| `SUPABASE_URL` | analytics + chat | e.g. `https://kdbmcsdqyebekzmliqgh.supabase.co`. **Server-only.** |
| `SUPABASE_SERVICE_ROLE_KEY` | analytics + chat | Service-role key — **server-only, never in the browser.** Bypasses RLS. |
| `GEMINI_API_KEY` | chat | Google AI Studio key. (`GOOGLE_API_KEY` also works — Genkit reads either.) |
| `CHAT_DAILY_LIMIT` | chat | Optional per-IP/day cap. Defaults to `30`. |
| `STATS_SECRET` | stats dashboard | Long random string; gate for `/api/stats` and the `/stats` page. |

> The Supabase project here is currently used only for **image storage**. The analytics
> tables live in the **same project** unless you point `SUPABASE_URL` elsewhere. The new
> tables (`visits`, `chat_messages`, `chat_usage`) don't collide with storage.

---

## 2. Database schema (run once)

Open the Supabase **SQL Editor** for the project that `SUPABASE_URL` points to and run
[`supabase/schema.sql`](../supabase/schema.sql). It is idempotent (safe to re-run) and
creates:

- `visits` — one row per page load + an engagement update on exit
- `chat_messages` — full chat transcript
- `chat_usage` — per-IP/day counter
- `increment_chat_usage(p_ip)` — atomic rate-limit RPC
- `decrement_chat_usage(p_ip)` — refunds a slot when chat generation fails

RLS is **enabled with no policies on purpose**: only the service-role key (server-side)
can read/write; the public/anon key sees zero rows. Don't add policies or disable RLS
unless you intend client-side reads.

---

## 3. How it fits together

```
Browser ─POST /api/track (insert)──▶ visits row            (VisitTracker → lib/track.ts)
Browser ─POST /api/track (engage)──▶ visits row UPDATE      (lib/engagement.ts, on exit)
Browser ─POST /api/chat ───────────▶ Gemini + chat_messages (ChatWidget → /api/chat)
Owner   ─GET  /api/stats (x-stats-key)──▶ dashboard JSON     (/stats page)
```

- **`session_id`** is the join key between a `visits` row and its `chat_messages`. The
  client generates it once per page load (`getSessionId()` in `lib/engagement.ts`) before
  the chat widget reads it.
- The chat model is pinned in one constant: `CHAT_MODEL` in
  [`src/app/api/chat/route.ts`](../src/app/api/chat/route.ts) (`googleai/gemini-3.1-flash-lite`,
  matching `src/ai/genkit.ts`). Swap there if quota/cost changes.
- The chat's grounding comes from the site's own data via
  [`src/lib/chatPrompt.ts`](../src/lib/chatPrompt.ts) (business info, services, portfolio,
  equipment, FAQ). Update the source data, not the prompt scaffold.

---

## 4. Verifying

1. Local: `npm run dev`, open the site → a `visits` row should appear; background the
   tab → the row gets `dwell_ms`/`clicks`. Open the chat, ask a question → a reply +
   a `chat_messages` row.
2. `/stats` → enter `STATS_SECRET` → dashboard. (This route is excluded from tracking.)
3. Rate limit: send more than `CHAT_DAILY_LIMIT` messages from one IP in a day → `429`.

---

## 5. SEO audit (Feature C — already satisfied)

This site is **server-rendered Next.js**, so the SPA-specific SEO scaffolding from the
handoff (crawler/no-JS fallback, runtime DOM meta mutation, a prebuild sitemap script)
is **unnecessary** — Next already ships real HTML to crawlers. Equivalents already in place:

| Handoff item | This repo |
|---|---|
| Static `<head>` title/description/canonical/OG/Twitter | `src/app/layout.tsx` `metadata` + per-page `metadata` |
| JSON-LD graph | `src/lib/seo.ts` + `src/components/seo/JsonLd.tsx` (LocalBusiness, WebSite, Breadcrumb, ItemList, FAQPage) |
| OG/Twitter images | `src/app/opengraph-image.tsx`, `twitter-image.tsx` (dynamic `next/og`) |
| Sitemap (derived from data) | `src/app/sitemap.ts` (dynamic; never drifts) |
| robots | `src/app/robots.ts` |
| Per-route metadata | Next `metadata` export per `page.tsx` |
| Crawler/no-JS fallback | N/A — SSR renders content server-side |

Only addition: `/stats` is marked `noindex` and is not in the sitemap.
