# opencode work order — Backend lane (PetCare 24/7)

> **Coordination:** Claude Code is the lead/integrator and owns the frontend, design system,
> shared contracts, and the clickable prototype. **You (opencode) own the BACKEND only.**
> We run in parallel — **do not overlap.** Paste this file's intent into opencode, or tell it:
> "Read and follow /Users/ipsitaghosh/petcare-247/OPENCODE_TASKS.md."

## HARD BOUNDARY — where you may write
✅ You may create/edit files **only under `packages/api/`**.
🚫 Do **NOT** touch: `apps/web`, `packages/mobile`, `packages/ui`, `packages/shared`,
   `prototype/`, `docs/`, or root config files (`package.json`, `turbo.json`, `pnpm-workspace.yaml`).
   If you think you need a change in `packages/shared` (shared Zod types), **STOP and leave a note
   in `packages/api/NEEDS-FROM-LEAD.md`** — the lead owns shared contracts. Do not edit shared yourself.

## Source of truth
- Requirements: `docs/01-requirements.md` (epics E1–E21, story IDs).
- Plan/architecture: `docs/02-project-plan.md`, and the master plan referenced therein.
- Architecture is a **modular monolith** (Fastify + tRPC now; Supabase Postgres + RLS). Keep hard
  module boundaries inside `packages/api/src/modules/<module>/` — no cross-module direct DB access.

## Your build tasks (complex backend — good fit for a dedicated worker)
Build these inside `packages/api`, each as its own module, with typed tRPC routers and a clear
service layer. Stub external calls (Supabase/Stripe/Wise/Claude) behind interfaces; return typed
mock data where a real credential isn't available yet, but make the **shapes** correct.

1. **Database schema + RLS** (`src/db/schema.sql`, `src/db/functions.sql`):
   tables for identity/users+roles, owners, pets (incl. `likes`, `dislikes`, broad `species`),
   triage_sessions, ai_audit_log (immutable), matches, consults, messages, ratings, vets,
   vet_credentials, wallet_credits, transactions, payouts, records, reminders, community_posts,
   lost_pet_tags, feature_flags. Every table multi-tenant (`user_id`/role scoping) with **RLS
   policies** keyed to the JWT role claim. Wallet/payment tables = service-write-only.
2. **Vet-matching algorithm** (`src/modules/matching/`): timezone-aware routing to a currently-online,
   qualified vet; SLA timer; reputation weighting; and the **"no vet in N minutes → ER fallback"**
   path. Pure, unit-testable functions + a tRPC entry point.
3. **Payment-rail abstraction** (`src/modules/payments/`): a `PaymentRail` interface with adapters
   for Stripe Connect (US/CA) and Wise (India) — stubbed — plus a rail-agnostic wallet/credits
   ledger and **authorize-then-capture** logic, first-question-free, configurable pricing tiers.
4. **Triage safety services** (`src/modules/triage/`): the AI pre-screen endpoint contract (Claude
   Sonnet, stubbed), a **server-side content filter** (regex blocking drug+dose and "diagnosed with X"),
   **keyword hard-rules** (seizure/breathing/collapse/bleeding/toxin → forced EMERGENCY), and the
   immutable audit-log writer. These are safety-critical — write unit tests.
5. **tRPC API surface** (`src/routes/index.ts`): compose the module routers into `appRouter` and keep
   `src/types.ts` exporting `AppRouter` for the frontend.

## Rules
- Add tests under `packages/api` for matching, payments capture, and the triage content-filter/keyword rules.
- Commit your own work with clear messages **scoped to `packages/api`** (`feat(api): …`). Do not commit other lanes' files.
- When a task is done, append a one-line status to `packages/api/PROGRESS.md` so the lead can integrate.
