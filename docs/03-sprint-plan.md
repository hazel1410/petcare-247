# PetCare 24/7 — Sprint Plan & Backlog

## Document Control

| Field | Value |
|---|---|
| Document | PetCare 24/7 — Sprint Plan & Backlog |
| File | `/Users/ipsitaghosh/petcare-247/docs/03-sprint-plan.md` |
| Owner | PM / Delivery Lead |
| Status | **Draft v1** |
| Date | 2026-06-28 |
| Predecessor | `01-requirements.md` (PRD, BA) |
| Related | `02-architecture.md`, `04-interface-contracts.md`, `05-test-strategy.md` |
| Sprint cadence | 2-week sprints |
| Approval gate | Founder sign-off after Sprint 1 prototype before Phase 2 production code begins |

---

## 1. Capacity Assumptions & Velocity Caveat

### Team Composition (virtual specialist agents, founder-led)
| Role | FTE Equivalent | Primary Sprint Contribution |
|---|---|---|
| Solutions Architect / CTO | 1.0 | Architecture, seam contracts, code review, infra |
| Backend Engineer | 1.0 | APIs, Supabase, Edge Functions, RLS, services |
| Frontend Engineer | 1.0 | Expo/RN screens, navigation, component wiring |
| Payments Engineer | 0.5 | Stripe, Wise, payment abstraction, ledger |
| UX Designer | 0.5 | Flows, wireframes, annotations |
| UI Designer | 0.5 | Design system, component specs, prototypes |
| QA / Test Lead | 0.5 | Test plans, automation harness, adversarial suite |
| Compliance Specialist | 0.25 | Consent flows, disclaimers, residency checks |
| BA (support) | 0.25 | Story refinement, AC clarification |

**Effective team velocity: ~60 story points per 2-week sprint** (conservative; assumes async collaboration, code review overhead, and founder approval cycles). Points use a Fibonacci-adjacent scale: 1, 2, 3, 5, 8, 13.

### Velocity Caveat
These estimates are planning-grade, not contract. Actual velocity will be calibrated after Sprint 0 and Sprint 1. The #1 existential risk (D2 — vet recruitment) is non-code and must begin in parallel from day one; slippage there shifts the launch date independent of engineering velocity. Sprints are time-boxed; scope is pulled from the backlog top when capacity allows, not padded in.

---

## 2. Phase-to-Sprint Mapping

| Phase | Label | Sprints | Theme |
|---|---|---|---|
| Phase 0 | Scaffold & Frozen Seams | Sprint 0 | Monorepo, CI, RLS schema, frozen interface contracts, design system tokens, feature-flag system, payment + chat-transport abstractions |
| Phase 1 | Clickable Prototype | Sprint 1 | Full anchor flow end-to-end with mock data — approval gate with Founder before Phase 2 code begins |
| Phase 2 | MVP Core | Sprints 2–7 | Auth + profiles, triage, matching, ER fallback, vet verification, wallet/payments, consult chat, ratings; merge-blocking tests active from Sprint 2 |
| Phase 3 | Remaining Launch Features | Sprints 8–11 | Symptom checker, toxic lookup, records, reminders, telehealth booking, services finder, places map, community, lost-pet QR, notifications hardening |
| Phase 4 | Hardening & Launch Prep | Sprint 12 | Load test, pen test, adversarial AI suite (100% pass), RLS sweep, compliance E2E, coming-soon stubs audit, app-store submission |

**Total sprints: 13 (Sprint 0 through Sprint 12) = 26 calendar weeks from kick-off to launch submission.**

---

## 3. Epic-to-Phase Backlog Overview

| Epic | Title | Phase | Sprint(s) |
|---|---|---|---|
| E1 | Onboarding & Auth | Phase 2 | Sprint 2 |
| E2 | Owner & Pet Profiles | Phase 2 | Sprint 3 |
| E3 | Emergency Triage (anchor) | Phase 2 | Sprints 4–5 |
| E4 | Vet Matching & Routing | Phase 2 | Sprint 5 |
| E5 | Consult Chat + Ratings | Phase 2 | Sprints 5–6 |
| E6 | Vet Onboarding & Verification | Phase 2 | Sprint 4 |
| E7 | Vet Earnings & Payments / Wallet | Phase 2 | Sprints 5–6 |
| E8 | Symptom Checker | Phase 3 | Sprint 8 |
| E9 | Toxic-Food / Poison Lookup | Phase 3 | Sprint 8 |
| E10 | ER Vet Finder | Phase 2 | Sprint 4 (core) + Sprint 7 (polish) |
| E11 | Medical Records & Vaccines | Phase 3 | Sprint 9 |
| E12 | Reminders (med/feeding, multi-caregiver) | Phase 3 | Sprint 9 |
| E13 | Telehealth Booking | Phase 3 | Sprint 10 |
| E14 | Local Services Finder | Phase 3 | Sprint 10 |
| E15 | Pet-Friendly Places Map | Phase 3 | Sprint 11 |
| E16 | Community Board | Phase 3 | Sprint 11 |
| E17 | Lost-Pet QR Tag | Phase 3 | Sprint 11 |
| E18 | Admin / Back-office | Phase 2 + 3 | Sprint 7 (core) + Sprint 11 (full) |
| E19 | Compliance & Data Rights | Phase 2 + 4 | Sprint 6 (core) + Sprint 12 (E2E) |
| E20 | Feature Flags & Coming-Soon Stubs | Phase 0 + 4 | Sprint 0 (system) + Sprint 12 (audit) |
| E21 | Notifications | Phase 2 + 3 | Sprint 5 (OTP/routing) + Sprint 10 (full) |

---

## 4. Sprint Detail

---

### Sprint 0 — Scaffold & Frozen Seams

**Duration:** Weeks 1–2
**Sprint Goal:** Stand up the monorepo, CI/CD, and all frozen interface contracts so every specialist agent can build in parallel against stable seams from Sprint 1 onward.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| INFRA-01 | Initialise Expo + RN monorepo (`apps/mobile`, `apps/web`); shared `packages/` for design tokens, api-client, utils | 5 |
| INFRA-02 | Supabase project creation — two regional projects: `us-east-1` (US/CA) and `ap-south-1` (India); Cloudflare Workers gateway skeleton routing by `region` claim | 5 |
| INFRA-03 | Base RLS schema: `users`, `roles`, `pets`, `consults`, `messages`, `wallet_ledger`, `payment_events`, `vet_profiles`, `audit_log` — all rows carry `user_id`/`role_context_id`; wallet/payment tables Edge-Function-write-only | 8 |
| INFRA-04 | CI pipeline (GitHub Actions): lint, type-check, unit test, RLS multi-user negative-assertion suite — all merge-blocking; secrets management (Doppler or equivalent); no secrets in client bundles | 5 |
| **E20-US1** | Feature-flag system: `feature_flags` table, `<IfEnabled>` wrapper component, runtime toggle, "Coming Soon" card fallback component | 5 |
| **E20-US3** | Compliance carve-out: EMERGENCY keyword hard-rule is NOT wrapped in any flag (documented in contract) | 2 |
| **E20-US4** | Five-tab nav shell: Home / My Pets / Services / Community / Account — placeholder screens only; floating "Ask a Vet Now" amber button wired to `#` | 3 |
| CONTRACT-01 | Frozen `ChatTransport` interface (Supabase Realtime adapter + stub); Postgres permanent-store schema for messages | 3 |
| CONTRACT-02 | Frozen payment-provider abstraction: `PaymentRail` interface (Stripe adapter + stub), `credits_ledger` Edge Function skeleton | 3 |
| CONTRACT-03 | Frozen vet-response structured-form schema (urgency verdict / general guidance / questions-to-ask — required fields defined; no free diagnosis field) | 2 |
| CONTRACT-04 | Frozen keyword hard-rule list (`seizure`, `breathing trouble`, `collapse`, `bleeding`, `toxin`) as a standalone server-side module (not AI-path-dependent) | 2 |
| CONTRACT-05 | Server-side content-filter skeleton (regex: drug+dose, "diagnosed with X") — wired to return P1 event type; test harness seeded | 3 |
| DESIGN-01 | Design system: color tokens (urgency palette — color + text + icon triples to satisfy NFR-A2), typography scale (body ≥ 16sp, 1.5 line height), tap-target spec (≥ 48px), spacing grid | 5 |
| DESIGN-02 | "Paw Pulse" signature vector illustration commissioned / placeholder slot defined (D7) | 2 |
| CONTRACT-06 | AI audit log schema: append-only table (`triage_audit_log`) with prompt, model version, output, timestamp; access-controlled; no UPDATE/DELETE RLS | 3 |
| DOC-01 | `04-interface-contracts.md` written and frozen: all seam signatures, table schemas, flag API, transport interface, payment interface, content-filter contract | 5 |

**Sprint 0 Total: ~61 points**

#### Demo / Clickable URL Deliverable
A working Expo app (Expo Go / web browser) showing the five-tab shell with placeholder screens, the "Ask a Vet Now" amber button, and the "Coming Soon" card component firing for any tapped stub — no dead ends. CI badge green on a clean `main` branch.

#### Exit Criteria
- [ ] Monorepo boots cleanly; Expo Go QR scannable
- [ ] Both Supabase regional projects online; gateway routes correctly by region header
- [ ] RLS schema migrated; multi-user negative-assertion tests pass in CI
- [ ] Feature-flag system operational; `<IfEnabled>` renders "Coming Soon" card when flag is off
- [ ] All five frozen contracts (`ChatTransport`, `PaymentRail`, keyword module, content filter, audit log schema) committed and code-reviewed
- [ ] CI pipeline green (lint + type-check + RLS suite)
- [ ] `04-interface-contracts.md` published
- [ ] No secrets in client bundles (automated check passes)
- [ ] Design tokens merged into `packages/design-tokens`

---

### Sprint 1 — Clickable Prototype (Anchor Flow) — Approval Gate

**Duration:** Weeks 3–4
**Sprint Goal:** Ship a fully clickable, end-to-end prototype of the anchor triage flow — open app → describe symptoms → AI pre-screen → urgency score → matched vet reply → ER fallback → rate — using realistic mock data, so the Founder can approve before production code begins.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E3-US1** | "Ask a Vet Now" amber button visible on all non-chat screens; taps immediately to triage entry (mock flow) | 3 |
| **E3-US2** | Triage chat screen: symptom description → mock AI pre-screen questions → urgency 1–5 score displayed via fixed-template phrasing + color + text + icon (NFR-A2); AI disclosure banner | 8 |
| **E3-US3** | Content-filter mock: demo intercept of a "diagnosed with X" / drug+dose response and P1 event alert in UI | 3 |
| **E3-US4** | Keyword hard-rule demo: entering "seizure" / "bleeding" / "toxin" immediately forces EMERGENCY card + ER Finder screen before any AI text; no flag can suppress this | 5 |
| **E3-US6** | No-vet fallback demo: mock SLA timer → ER finder shown; "X vets online now" counter on Home | 3 |
| **E3-US8** | End-to-end mock flow working (no dead ends); every screen has a clear next action | 5 |
| **E4-US1** | Vet-matching screen: mock "connected to Dr. Anand" → matched vet card with avatar/credentials (mock data) | 3 |
| **E5-US1** | Consult chat screen: mock realtime exchange; messages rendered chronologically; vet-side and owner-side views | 5 |
| **E5-US2** | Vet reply structured form (prototype): urgency verdict / general guidance / "questions to ask your own vet" (required) — submission blocked if questions field empty | 5 |
| **E5-US4** | Post-consult rating screen: 1–5 stars; "Thank you" confirmation (mock submit) | 3 |
| **E10-US1** | ER Finder screen: Google Maps embed (API key stubbed) showing mock nearby ER pins; call and directions CTAs | 5 |
| **E1-US7** | Triage entry does NOT require signup (screen shows inline prompt only at decision point) | 2 |
| **E19-US5** | Disclaimer banner on triage and result screens ("triage only, not a diagnosis or prescription") — never a signup wall | 2 |
| UX-01 | Full UX flow doc (annotated screens for all prototype screens) delivered for Founder review | 3 |
| UI-01 | Design system applied to all prototype screens (colors, typography, icons, urgency palette) | 5 |

**Sprint 1 Total: ~60 points**

#### Demo / Clickable URL Deliverable
**Live Expo Go link + web URL** — complete mock triage flow walkable in < 5 minutes: Home → "Ask a Vet Now" → symptom entry → AI urgency pre-screen → matched vet card → structured consult reply → rate consult → ER finder (via keyword path and SLA-timeout path). Zero dead ends. Founder approval is the formal exit gate before Sprint 2.

#### Exit Criteria
- [ ] Full triage anchor flow walkable end-to-end (all 8 screens/states) with no dead ends
- [ ] Keyword hard-rule fires before AI text on all five trigger words
- [ ] Vet structured form blocks submission when "questions to ask your own vet" is empty
- [ ] Urgency score shown via color + text + icon (never color alone)
- [ ] AI disclosure banner present on all AI-output screens
- [ ] Disclaimer shown on triage result; not used as a signup wall
- [ ] Expo Go link and web URL shared with Founder
- [ ] **Founder approval received in writing before Sprint 2 begins**

---

### Sprint 2 — Auth & Onboarding

**Duration:** Weeks 5–6
**Sprint Goal:** Ship production-grade unified OTP auth (phone + email), RBAC, region-selection, and data residency routing so every subsequent sprint can build on a real authenticated session.

> Note: From this sprint onward, **tests on auth are merge-blocking** (NFR-Q1).

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E1-US1** | Unified login/signup screen: phone OR email entry, "continue" sends OTP — same screen handles both new and returning users; no password field ever | 8 |
| **E1-US2** | OTP delivery: Twilio (SMS for phone) + Resend (email for email entries); code screen with resend + cooldown timer; single-use, ≤ 10-min expiry | 8 |
| **E1-US3** | Security: 5-failed-attempt invalidation; rate-limiting per identifier + per device; resend cooldown enforced | 5 |
| **E1-US4** | Optional Google/Apple social sign-in via Expo AuthSession; social never blocks OTP path | 3 |
| **E1-US5** | RBAC: JWT role claim (owner / vet / provider / admin) set on account creation; RLS auto-scopes all data to role; role changes admin-controlled + audit-logged | 8 |
| **E1-US6** | Region selection/confirmation at signup (US / Canada / India); `region` claim set in JWT; Cloudflare Workers gateway routes requests to correct regional Supabase project | 5 |
| **E1-US7** | "Ask a Vet Now" entry point bypasses signup wall; account prompt appears only at the match/charge decision point | 3 |
| AUTH-TEST-01 | Auth test suite: OTP happy path (phone + email), expiry, rate-limit, role-claim assertion, RLS multi-user negative-assertion — **all merge-blocking in CI** | 8 |
| AUTH-TEST-02 | Social sign-in integration test (stub-able in CI); region routing smoke test | 3 |

**Sprint 2 Total: ~51 points** *(lighter sprint to allow thorough auth quality)*

#### Demo / Clickable URL Deliverable
Live production auth flow: sign up via phone OTP, sign up via email OTP, return login, Google sign-in — all routes land on a region-appropriate session with correct JWT role. CI badge green including all auth merge-blocking tests.

#### Exit Criteria
- [ ] OTP via SMS and email functional in production (Twilio + Resend keys live)
- [ ] 5-attempt invalidation and rate-limiting verified by automated test
- [ ] JWT carries `role` and `region` claims; gateway routes to correct Supabase project
- [ ] RLS multi-user negative-assertion tests pass for `users` table
- [ ] Social sign-in does not block OTP path under any flag state
- [ ] Auth test suite 100% green and merge-blocking in CI
- [ ] No password field appears anywhere in the auth flow
- [ ] Triage entry reachable without account creation

---

### Sprint 3 — Owner & Pet Profiles

**Duration:** Weeks 7–8
**Sprint Goal:** Ship owner profile creation and multi-pet profile management (including the likes/dislikes engine seed and non-dog/cat species handling), so triage sessions have real pet context from Sprint 4 onward.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E2-US1** | Owner profile creation screen (name, address, phone, email; phone/email pre-fill from auth); validation; editable from Account tab | 5 |
| **E2-US2** | Multi-pet: add, list, select which pet a triage question is about | 5 |
| **E2-US3** | Pet profile fields: species picker (dog, cat, parrot, rabbit, + more), breed, color, weight, age, allergies (optional/"if known"); profile saves with missing optionals | 5 |
| **E2-US4** | Likes/dislikes field (optional, structured); stored to `pet_preferences` table for future product-suggestion engine; no live suggestions at MVP | 3 |
| **E2-US5** | Non-dog/cat species gate: creating profile succeeds; attempting triage for non-dog/cat shows clear message + offers ER finder + non-urgent booking (never a dead end) | 5 |
| **E2-US6** | Pet photo/avatar upload: stored in regional Supabase Storage; RLS-scoped to owner; circular avatar in UI | 3 |
| PROFILE-TEST-01 | Profile test suite: required fields validation, multi-pet isolation, RLS scoping (owner sees only own pets), species gate logic — merge-blocking | 5 |
| UX-02 | Account tab: owner profile view/edit, pet list, add pet CTA, logout | 3 |

**Sprint 3 Total: ~34 points** *(lighter; remaining capacity spent on sprint 4 pre-work and E10 maps integration investigation)*

#### Demo / Clickable URL Deliverable
Post-login owner creates a profile, adds two pets (one dog, one parrot), edits dog details including a photo, and sees the non-dog/cat triage gate with ER finder CTA when starting triage for the parrot — all on a real authenticated session with real Supabase writes.

#### Exit Criteria
- [ ] Owner profile CRUD working with validation
- [ ] Multiple pets creatable, independently editable, listed in My Pets tab
- [ ] Likes/dislikes persist to `pet_preferences` table
- [ ] Non-dog/cat species shows gate message + ER/non-urgent CTA (no dead end)
- [ ] Pet photos stored in correct regional bucket; RLS scope verified
- [ ] Profile test suite green and merge-blocking in CI

---

### Sprint 4 — Emergency Triage Core + ER Finder + Vet Onboarding

**Duration:** Weeks 9–10
**Sprint Goal:** Wire the production triage engine — Claude Sonnet pre-screen, server-side content filter, keyword hard-rules, AI audit log, and ER finder — plus vet onboarding submission flow, so the anchor is end-to-end real (safety rules enforced).

> Triage tests join auth tests as merge-blocking in CI from this sprint.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E3-US2** | Production Claude Sonnet pre-screen: API integration, 1–5 urgency score returned into fixed templates; AI disclosure on every output; model version stamped in audit log | 8 |
| **E3-US3** | Server-side content filter production wiring: regex for drug+dose and "diagnosed with X" blocks output, raises P1 event, alert logged; 0 leaks required | 8 |
| **E3-US4** | Keyword hard-rule production module: `seizure`, `breathing trouble`, `collapse`, `bleeding`, `toxin` → EMERGENCY force, ER finder before AI text, parallel human routing fire; no flag disables this (NFR-S7 / E20-US3) | 8 |
| **E3-US5** | AI audit log: every triage call writes prompt + model version + output + timestamp to `triage_audit_log` (append-only, no UPDATE/DELETE, access-controlled) | 5 |
| **E3-US7** | Non-dog/cat triage branch: keyword hard-rules + ER fallback still apply; AI triage gracefully declines non-covered species and offers alternatives | 3 |
| **E10-US1** | ER Vet Finder production: Google Maps/Places API integration; nearby emergency vets rendered; call (native dialer) + directions (native maps) in one tap; fires before AI text on EMERGENCY | 8 |
| **E10-US2** | Manual location fallback: denied/unavailable location → address/postal code entry; no results → national emergency line fallback (no dead end) | 3 |
| **E10-US3** | Region-correct results: US, Canada, India listings and phone formats localized | 3 |
| **E6-US1** | Vet onboarding flow: license number, ID, registry, region submission → status = `pending`; vet cannot receive cases while pending | 5 |
| **E6-US5** | India vet W-8BEN prerequisite screen shown as hard gate in onboarding; `w8ben_collected` field seeded false | 3 |
| TRIAGE-TEST-01 | Triage test suite (merge-blocking): content-filter blocks 100% of adversarial diagnosis/drug-dose prompts; keyword hard-rule fires on all 5 trigger words; audit log write verified; ER finder reachable on keyword + SLA paths | 13 |

**Sprint 4 Total: ~67 points** *(highest-stakes sprint; QA embedded full-time)*

#### Demo / Clickable URL Deliverable
Real authenticated owner, real pet profile → types "my dog is having a seizure" → keyword hard-rule fires instantly → ER Finder with real nearby clinics before any AI text → human routing initiated. Separately: owner types symptom without keywords → real Claude Sonnet pre-screen → urgency 1–5 in fixed template → AI disclosure shown. Adversarial test run passes 100% on CI.

#### Exit Criteria
- [ ] Claude Sonnet integration live; urgency score in fixed template
- [ ] Server-side content filter blocks all adversarial drug+dose and diagnosis strings (CI adversarial suite 100% pass — merge-blocking)
- [ ] All 5 keyword hard-rules fire before AI text and cannot be disabled by any flag
- [ ] AI audit log append-only; verified no UPDATE/DELETE permitted by RLS
- [ ] ER Finder showing real clinics via Google Places; call + directions functional
- [ ] Manual location fallback with national emergency line (no dead end)
- [ ] Vet onboarding submission creates `pending` vet; no auto-approve path exists
- [ ] All triage merge-blocking tests green in CI

---

### Sprint 5 — Vet Matching, Consult Chat, Payments Foundation, Notifications (OTP + Routing)

**Duration:** Weeks 11–12
**Sprint Goal:** Connect online vets to routed cases in real time, open the consult chat, and stand up the payment-authorization flow and critical push notifications so the full end-to-end money + care path works.

> Payment tests join the merge-blocking suite from this sprint.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E4-US1** | Vet matching engine: only verified + online vets eligible; case offered on first acceptance; online status indexed; median routing supports < 3 min reply target | 8 |
| **E4-US2** | SLA timer: unaccepted case after 3 min → ER fallback fires (E3-US6); accepted-but-idle escalation logic | 5 |
| **E4-US3** | Cross-region PII-free matching payload: only urgency, species, language, region cross regions; message storage stays in owner's residency region | 5 |
| **E4-US4** | Language signal in routing; fallback to standard routing if no language match | 3 |
| **E4-US5** | Supply metrics: `vets_online` + `no_vet_available_rate` + time-to-first-reply tracked; Home "X vets online now" reflects real count | 3 |
| **E5-US1** | Realtime consult chat: Supabase Realtime via `ChatTransport` adapter; messages persist to Postgres; owner + vet views functional | 8 |
| **E5-US2** | Vet structured-form reply: urgency verdict + general guidance + "questions to ask your own vet" (required, blocks send if empty); no free diagnosis field | 5 |
| **E5-US3** | Server-side content filter applied to vet replies (same drug+dose / "diagnosed with X" block); blocked replies logged as P1 | 5 |
| **E5-US4** | Post-consult rating: owner prompted after close; verified owner only; rating updates vet public reputation; earnings stay private | 5 |
| **E6-US4** | Vet online/offline toggle: verified vet sets availability; counted in `vets_online`; no new cases while offline | 3 |
| **E7-US1** | First-question-free promo credit: one non-transferable credit granted on signup (user-level, 90-day expiry); consumed on first question; standard pricing thereafter | 5 |
| **E7-US2** | Credits ledger and pricing tiers: Quick $1.99 / Standard $3.99 / Extended $6.99 (admin-configurable); rail-agnostic ledger; PCI SAQ-A (no raw card data on server) | 8 |
| **E7-US3** | Authorize-then-capture: charge authorized at session start; captured on substantive vet reply; authorization released (never captured) on ER fallback after 5 min no-vet | 8 |
| **E21-US1** | Push notification to online vet on incoming case (Expo Push Notifications); SLA escalation proceeds if no response | 3 |
| **E21-US2** | Push + email/SMS fallback to owner when vet replies | 3 |
| PAYMENTS-TEST-01 | Payment test suite (merge-blocking): authorize-then-capture flow; no-vet auth release; promo credit consumption; ledger write-only (Edge Function only, no direct client write) | 8 |

**Sprint 5 Total: ~90 points** *(over nominal velocity — split if needed; matching + chat are the critical path)*

> **Split guidance if velocity is short:** Defer E4-US4 (language routing), E5-US5 (re-request), and E21-US1/US2 to Sprint 6; protect matching + chat + payments core.

#### Demo / Clickable URL Deliverable
Full money + care path live: authenticated owner starts paid consult → promo credit applied on first question → Stripe authorization placed → case routed to online verified vet → push notification fires → vet replies via structured form → capture triggered → owner rates consult → vet earnings dashboard shows new entry. SLA timeout path also demo-able: no vet accepts → auth released → ER finder shown.

#### Exit Criteria
- [ ] Vet matching only routes to verified + online vets; no pending/offline vet receives a case
- [ ] SLA timer fires ER fallback after 3 min; authorization released (no erroneous capture)
- [ ] Cross-region payload carries no PII (verified by test)
- [ ] `ChatTransport` Supabase Realtime adapter passes load/unit test; messages persist in Postgres
- [ ] Vet structured form blocks send with empty "questions to ask your own vet"
- [ ] Server-side filter applied to vet replies; P1 event logged on block
- [ ] Promo credit non-transferable; consumed exactly once per user
- [ ] Authorize-then-capture verified; no raw card data touches server
- [ ] Payment test suite 100% green and merge-blocking in CI
- [ ] "X vets online now" on Home reflects real count

---

### Sprint 6 — Vet Verification Admin + Wallet Payouts + Compliance Core

**Duration:** Weeks 13–14
**Sprint Goal:** Give admins the tools to approve vets (no auto-approve path), enable vet payouts on both rails, and implement the compliance consent + data-rights foundation so the app is legally operable.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E6-US2** | Admin vet verification queue: review license + ID + registry; approve/reject with reason; approval sets routing eligibility; no auto-approve path (verified by test) | 8 |
| **E6-US3** | Annual re-verification: `credential_expiry` date on vet profile; lapse blocks new case assignment; admin renewal queue | 5 |
| **E7-US4** | Vet earnings dashboard: completed consults, earnings, platform take (30–35%), payout status; earnings private to vet | 5 |
| **E7-US5** | Payout rails: Stripe Connect Express (US/CA vets); Wise Business (India vets); `w8ben_collected = false` DB-enforced blocks India payouts (non-bypassable, RLS-level) | 8 |
| **E7-US6** | Admin pricing config: tiers and take-rate changeable at runtime without deploy; changes audit-logged | 3 |
| **E7-US7** | Wallet/payment tables verified Edge-Function-write-only; RLS: users read own ledger rows only; tested in CI | 5 |
| **E5-US5** | Re-request a vet: owner can re-request a past vet; if online, case offered first; if offline, standard routing + ER fallback (no dead end) | 3 |
| **E5-US6** | Consult transcript: available in records after completion; includes disclaimers + "questions to ask your own vet"; exportable | 3 |
| **E19-US1** | Consent screen: no boxes pre-checked; India consent in English + Hindi; versioned + timestamped to `consent_log` | 5 |
| **E19-US2** | Data export + delete from Account: export queued within SLA; delete/anonymize per policy; audit log retained per legal basis (de-identified where required) | 8 |
| **E19-US3** | AI disclosure on every AI-assisted output (ADMT/CPRA); per-state compliance kill switch via feature flag (except safety hard-rule) | 3 |
| **E19-US4** | India experience: grievance officer contact in-app; named data fiduciary disclosed; India data stored in `ap-south-1` | 3 |
| **E19-US5** | Disclaimers at point of use (triage, symptom, toxic screens); never a signup wall | 2 |
| **E19-US6** | Gateway region routing enforced: region claim → correct Supabase project; PII-free cross-region payloads verified | 3 |
| VET-TEST-01 | Vet verification tests: no auto-approve path; W-8BEN India payout block non-bypassable; annual lapse logic | 5 |

**Sprint 6 Total: ~68 points**

#### Demo / Clickable URL Deliverable
Admin approves a pending vet (credential review screen), vet becomes routing-eligible, earns from a test consult, views earnings dashboard, initiates a Wise payout (India rail). Owner sees consent screen with no pre-checked boxes and can export their data from Account. India user sees Hindi consent + grievance officer contact.

#### Exit Criteria
- [ ] No path auto-approves a vet (verified by automated test)
- [ ] W-8BEN India payout block enforced at DB level (not bypassable by application code)
- [ ] Annual re-verification lapse blocks routing
- [ ] Pricing/tier changes apply at runtime without deploy; audit-logged
- [ ] Consent screen has zero pre-checked boxes; India Hindi consent present
- [ ] Data export and delete functional from Account
- [ ] AI disclosure present on all AI-output screens
- [ ] India grievance officer contact and data fiduciary disclosure present
- [ ] All vet verification + compliance tests green in CI

---

### Sprint 7 — Admin Dashboard + Ratings Hardening + Phase 2 Integration

**Duration:** Weeks 15–16
**Sprint Goal:** Complete the admin back-office (metrics, disputes/refunds, moderation queue, pricing config), harden the ratings flywheel, and close all Phase 2 integration gaps so the MVP core is feature-complete.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E18-US1** | Admin vet management: approve/reject (already in Sprint 6), plus suspend/reactivate; all actions audit-logged; no auto-approve verified | 3 |
| **E18-US2** | Admin metrics dashboard: `vets_online`, `no_vet_available_rate`, time-to-first-reply (median + P90), conversion (free → paid), P1 safety events — all real-time | 8 |
| **E18-US3** | Dispute/refund handling: disputed charge review, refund/credit action, audit-logged; reconciliation against credits ledger | 5 |
| **E18-US4** | Pricing + feature flag config in admin UI; runtime changes without deploy; audit-logged; keyword hard-rule cannot be disabled confirmed at UI level too | 5 |
| **E18-US5** | Community moderation queue (placeholder for Sprint 11 community feature); approve/reject framework in place | 3 |
| E5-US4 (harden) | Rating flow polished: completion-triggered prompt; 50% rated target metric instrumented; vet re-request flow from rating screen | 3 |
| INTEGRATION-01 | End-to-end Phase 2 integration test: new user → OTP → profile → pet → triage (keyword path + AI path) → vet match → consult → rate → admin sees metrics → vet sees earnings → payout initiated | 8 |
| INTEGRATION-02 | RLS sweep: all Phase 2 tables audited for correct multi-user isolation; negative-assertion tests expanded | 5 |
| INTEGRATION-03 | NFR-PF3/PF4 baseline: triage-path p95 latency measured; "X vets online" renders < 500ms; cold-start budget documented | 5 |
| INTEGRATION-04 | Sentry + PostHog + Checkly + PagerDuty instrumented on triage path; 99.9% uptime alert configured | 5 |
| **E21-US3** | Reminder and booking notification skeletons (push); wired to reminder scheduler introduced in Sprint 9 | 3 |
| **E21-US4** | Notification preferences in Account: channel preferences honored; transactional vs marketing split; marketing requires explicit opt-in | 3 |

**Sprint 7 Total: ~56 points**

#### Demo / Clickable URL Deliverable
Admin dashboard showing real metrics from test sessions; admin processes a test dispute/refund; pricing tier changed at runtime — active sessions immediately see new tier. Full integration test walkthrough recorded and linked in the sprint review.

#### Exit Criteria
- [ ] Admin dashboard shows all 5 required real-time metrics (G1–G13 instrumented)
- [ ] Dispute/refund flow end-to-end with ledger reconciliation
- [ ] Pricing/flag changes apply at runtime; keyword hard-rule cannot be disabled via admin UI
- [ ] Phase 2 integration test suite passes (new user → rating → admin metrics)
- [ ] RLS sweep: all Phase 2 tables pass multi-user negative-assertion tests
- [ ] Triage-path p95 latency measured and within budget
- [ ] PagerDuty alert on triage-path downtime configured
- [ ] No open P1 safety events from integration runs

---

### Sprint 8 — Symptom Checker + Toxic-Food Lookup

**Duration:** Weeks 17–18
**Sprint Goal:** Ship the symptom checker and toxic-food/poison lookup — both fully under the same safety rules as triage — giving owners two self-service tools that hand off naturally to the anchor.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E8-US1** | Symptom checker: species-aware (dog/cat) multi-select symptom list → urgency 1–5 rating (color + text + icon); red-flag symptom forces EMERGENCY + ER finder | 8 |
| **E8-US2** | Symptom checker safety: no disease conclusion, no drug+dose in any output; "Ask a Vet Now" CTA + disclaimer on result screen | 5 |
| **E8-US3** | Symptom-to-triage handoff: symptoms pre-fill triage context when user escalates to "Ask a Vet Now" | 3 |
| **E9-US1** | Toxic-food lookup: searchable substance/food database for dogs + cats; toxicity verdict + severity; clear next-step CTA (Ask a Vet Now / ER finder) shown on toxic result | 8 |
| **E9-US2** | Toxin escalation: high-severity result offers EMERGENCY + ER finder path before any AI text; no drug+dose treatment instruction in any result | 5 |
| **E9-US3** | Offline core toxic-food list: cached on-device; searchable with poor connectivity | 3 |
| SYMPTOM-TEST-01 | Symptom checker tests: urgency output never contains diagnosis/drug+dose (adversarial subset); red-flag symptom forces EMERGENCY; handoff carries pre-fill — merge-blocking | 5 |
| TOXIC-TEST-01 | Toxic lookup tests: high-severity toxin offers ER finder; no drug+dose in output; offline cache loads — merge-blocking | 5 |
| UX-03 | Symptom checker + toxic lookup UX polish; accessibility (color + text + icon); WCAG AA verified on both flows | 3 |

**Sprint 8 Total: ~45 points**

#### Demo / Clickable URL Deliverable
Owner selects "vomiting + seizure" in symptom checker → EMERGENCY fires, ER finder shown → taps "Ask a Vet Now" with symptoms pre-filled. Owner searches "chocolate" in toxic lookup → high-severity result with ER finder CTA, no drug advice. Both flows work offline (cached data).

#### Exit Criteria
- [ ] Symptom checker produces urgency 1–5 using color + text + icon; red-flag symptoms force EMERGENCY
- [ ] Toxic lookup covers dogs and cats; high-severity toxins surface ER finder before AI text
- [ ] No diagnosis, no disease conclusion, no drug+dose in any symptom or toxic output (adversarial tests pass)
- [ ] Symptom pre-fill carries into triage on handoff
- [ ] Offline toxic cache functional with no connectivity
- [ ] All merge-blocking tests green in CI

---

### Sprint 9 — Medical Records + Reminders

**Duration:** Weeks 19–20
**Sprint Goal:** Give owners a complete pet health record (vaccines + medical photos/documents) and a multi-caregiver reminder system so PetCare 24/7 is genuinely useful between emergencies.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E11-US1** | Vaccine records: add vaccine (name + date + optional due date); chronological list per pet; optional reminder hook (E12) | 5 |
| **E11-US2** | Medical record photos/documents: upload to regional Supabase Storage; RLS-scoped to owner; listed per pet | 5 |
| **E11-US3** | Export/share records: shareable summary including consult transcript (with disclaimers + "questions to ask your own vet"); PDF or share-sheet export | 5 |
| **E12-US1** | Med/feeding reminders: create reminder (time + recurrence) per pet; push notification at scheduled time; mark done / snooze | 5 |
| **E12-US2** | Multi-caregiver: invite caregiver by phone/email; accept flow; shared reminder list; one marks done → all see update; caregiver access scoped to that pet only | 8 |
| **E12-US3** | Reminder safety: app stores only what owner entered (name/amount they input); app never suggests a drug or dose | 3 |
| RECORDS-TEST-01 | Records tests: RLS scoping (owner sees only own pet records); regional storage routing; export includes disclaimers | 5 |
| REMINDER-TEST-01 | Reminder tests: notification fires at scheduled time; caregiver isolation (scoped to correct pet); no drug suggestion appears | 5 |

**Sprint 9 Total: ~41 points**

#### Demo / Clickable URL Deliverable
Owner adds a vaccine record, uploads a vet visit photo, creates a twice-daily medication reminder, invites a partner as caregiver — partner receives invite, sees shared reminders, marks one done. Owner shares medical records summary (with consult transcript).

#### Exit Criteria
- [ ] Vaccine records and medical photo/document upload functional with regional storage
- [ ] Caregiver invite, accept, and shared reminder flow end-to-end
- [ ] Caregiver RLS scoped to correct pet only (tested by automated suite)
- [ ] Reminder notifications fire at correct time in test environment
- [ ] App never suggests a drug or dose in any reminder context
- [ ] Export includes disclaimers and "questions to ask your own vet"
- [ ] All merge-blocking tests green in CI

---

### Sprint 10 — Telehealth Booking + Local Services + Notifications Full

**Duration:** Weeks 21–22
**Sprint Goal:** Ship non-urgent telehealth booking (jurisdiction-gated), the local services finder, and complete the notification system so all user-facing channels (push, email, SMS) are production-grade.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E13-US1** | Telehealth booking: availability calendar for verified vets; slot selection; booking confirmation + reminder notification; payment follows wallet/charge flow (E7) | 8 |
| **E13-US2** | Jurisdiction gate: flag-controlled off for provinces/states without standalone virtual VCPR; gated region offers triage + ER finder instead (no dead end) | 5 |
| **E13-US3** | Booking management: cancel/reschedule within policy; authorization handling on cancel | 3 |
| **E14-US1** | Local services finder: search by location + type (groomer, walker, sitter, trainer); listing detail view; direct contact link | 5 |
| **E14-US2** | Provider self-listing (Phase 2 stub): provider account type can create listing; in-app booking shows "Coming Soon" card; direct contact only | 3 |
| **E14-US3** | Service reviews: owner submits review; moderation per E16/E18 pipeline | 3 |
| **E21-US1** (complete) | Vet push notifications: incoming case + SLA escalation fully production-hardened | 2 |
| **E21-US2** (complete) | Owner push + email/SMS fallback for vet replies: fallback chain implemented (push fails → email → SMS) | 3 |
| **E21-US3** (complete) | Reminder + booking notifications: reminder scheduler integrated with notification pipeline; booking confirmation + reminder + cancellation | 3 |
| **E21-US4** (complete) | Notification preferences in Account: per-channel opt-in/out; transactional vs marketing; marketing explicit opt-in; TCPA/CASL/DLT compliance stubs | 5 |
| BOOKING-TEST-01 | Booking tests: jurisdiction gate fires correctly for gated provinces; auth release on cancel; double-booking prevention | 5 |
| NOTIF-TEST-01 | Notification tests: push → email → SMS fallback chain; preference opt-out honored; marketing requires explicit opt-in | 3 |

**Sprint 10 Total: ~48 points**

#### Demo / Clickable URL Deliverable
Owner books a non-urgent telehealth slot with a verified vet, receives booking confirmation (push + email), cancels it (authorization released). Owner finds a local groomer, views listing, contacts directly. Notification preference panel shows push/email/SMS controls with marketing explicitly opt-in.

#### Exit Criteria
- [ ] Telehealth booking end-to-end with payment authorization
- [ ] Jurisdiction gate fires correctly for configured provinces (no dead end in gated regions)
- [ ] Cancel/reschedule with correct auth release
- [ ] Local services search returns results by location + type
- [ ] Fallback notification chain (push → email → SMS) verified in test
- [ ] Marketing notifications require explicit opt-in
- [ ] All merge-blocking tests green in CI

---

### Sprint 11 — Community Board + Pet-Friendly Places + Lost-Pet QR + Admin Full + Coming-Soon Stubs

**Duration:** Weeks 23–24
**Sprint Goal:** Complete all remaining MVP launch features — the moderated community board, pet-friendly places map, lost-pet QR tag, full admin capabilities — and place every excluded/coming-soon feature behind a proper stub with no dead ends.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| **E16-US1** | Community board: post submission → status `pending`; not publicly visible until approved; text-only at launch | 5 |
| **E16-US2** | Admin moderation queue: approve/reject with reason; post goes public on approval; actions audit-logged | 5 |
| **E16-US3** | Report/flag content: reported post enters moderation queue | 3 |
| **E16-US4** | Emergency-sounding community posts surface "Ask a Vet Now" / ER finder; community disclaimers present (not medical advice) | 3 |
| **E15-US1** | Pet-friendly places map: Google Places integration; type filters (parks, cafes, hotels); directions CTA | 5 |
| **E15-US2** | Region-correct results; report-incorrect-entry mechanism | 3 |
| **E17-US1** | Lost-pet QR tag: unique scannable code per pet (digital); public-safe scan page shows owner-chosen fields + contact path | 5 |
| **E17-US2** | QR privacy control: owner selects which fields to expose; full address never shown unless explicit opt-in | 3 |
| **E17-US3** | Lost/found status toggle on pet; scan page reflects status; links to community post | 2 |
| **E18-US1** (full) | Admin vet management complete (suspend/reactivate/re-verify queue) | 2 |
| **E18-US5** (full) | Community moderation queue fully wired to E16 approval pipeline | 2 |
| **E20-US1** (full) | Feature-flag runtime toggle tested for all Phase 3 features | 2 |
| **E20-US2** | All excluded/coming-soon features (`dating`, `chores`, `creator tools`, `travel`, `treat box`, `grief support`, `AR games`, `non-dog/cat triage expansion`) stubbed as "Coming Soon" cards; tapping explains the feature, never errors | 5 |
| QR-TEST-01 | QR tests: scan page exposes only opted-in fields; full address suppressed by default; lost/found status reflects correctly | 3 |
| COMMUNITY-TEST-01 | Community tests: pending posts not publicly visible; moderation approve/reject logged; emergency-sounding post surfaces triage CTA | 3 |

**Sprint 11 Total: ~51 points**

#### Demo / Clickable URL Deliverable
Owner posts a "dog lost in Toronto" notice → pending → admin approves → post visible in community with "Ask a Vet Now" disclaimer footer. Owner generates QR tag for their dog → finder scans it → sees name + general area (no full address) + contact path. Pet-friendly places map shows local parks filtered by type. All "Coming Soon" stubs navigable with explanatory cards and no dead ends.

#### Exit Criteria
- [ ] Community posts go through pending → approved flow; not public while pending
- [ ] Admin moderation queue approve/reject with audit log
- [ ] Emergency-sounding post surfaces triage CTA + disclaimer
- [ ] Pet-friendly places map loads by location with type filters
- [ ] Lost-pet QR generates scannable code; scan page shows only opted-in fields; full address suppressed by default
- [ ] All excluded features stubbed as "Coming Soon" cards — zero dead-end buttons anywhere in the app
- [ ] Feature-flag system tested for all Phase 3 features
- [ ] All merge-blocking tests green in CI

---

### Sprint 12 — Hardening, Pen Test, Adversarial AI Suite, RLS Sweep, Compliance E2E, App Store Submission

**Duration:** Weeks 25–26
**Sprint Goal:** Achieve launch confidence: pass the adversarial AI safety suite 100%, complete the pen test with no open High/Critical findings, sweep every RLS policy, validate all compliance flows end-to-end, load-test the triage path to 5,000 concurrent sessions, and submit to both app stores.

#### Committed Work

| Story / Task | Description | Points |
|---|---|---|
| HARD-01 | **Adversarial AI suite (100% pass required):** diagnosis strings, drug+dose strings, "you don't need a vet" strings — full permutation battery against content filter + vet structured form + symptom checker; zero leaks = ship gate | 13 |
| HARD-02 | **Pen test (OWASP Mobile + API):** external or internal red-team; no open High/Critical findings before launch; secrets-in-client-bundle scan | 8 |
| HARD-03 | **RLS sweep:** all tables in both Supabase projects audited; multi-user negative-assertion test coverage ≥ 100% of tables; cross-tenant isolation verified | 8 |
| HARD-04 | **Load test triage path:** `ChatTransport` + matching + AI pre-screen to 5,000 concurrent (NFR-SC2); p95 latency within budget; ER fallback under load | 8 |
| HARD-05 | **Compliance E2E:** data export (US/CA/India) within SLA; delete/anonymize (audit log retained, de-identified); consent versioning verified; India Hindi consent + grievance officer reachable; ADMT AI disclosure present on all AI screens | 8 |
| HARD-06 | **Accessibility audit:** WCAG AAA triage flow audit; AA app-wide audit; urgency color-only check; tap-target sweep (≥ 48px); reduced-motion; screen-reader pass on anchor path; 20%-brightness triage test | 5 |
| HARD-07 | **Feature-flag final audit:** every "Coming Soon" stub navigable with explanatory card; EMERGENCY keyword hard-rule confirmed indestructible via all flag states; no sixth tab | 3 |
| HARD-08 | **Backup verification:** automated Postgres backup both regions; restore tested; transcript durability confirmed | 3 |
| HARD-09 | **Monitoring final check:** PagerDuty alert tested; Sentry/PostHog/Checkly on triage path; `no_vet_available_rate` < 5% under test load | 3 |
| HARD-10 | **App store submission:** iOS (App Store) + Android (Google Play) submission; metadata, screenshots, privacy label, app review notes prepared | 5 |
| HARD-11 | **Web PWA launch:** PWA manifest, service worker, canonical URL, basic SSR/SEO for vet profiles and community (per Q10) | 5 |
| HARD-12 | **Open questions resolved:** Q1–Q10 decisions documented in PRD addendum; any last-minute scope changes gated by Founder sign-off | 3 |
| HARD-13 | **Launch runbook:** deployment steps, rollback plan, on-call rotation, vet supply check (≥ 20 vets online overnight per G6), DNS/CDN final | 5 |

**Sprint 12 Total: ~77 points** *(extended QA sprint; no new feature work)*

#### Demo / Clickable URL Deliverable
Adversarial test run recorded and all 100% pass. Load test report showing triage path stable at 5,000 concurrent. Pen test close-out report with no open High/Critical. App Store and Play Store submission confirmation. Live PWA URL. Final compliance walkthrough (export, delete, consent) recorded.

#### Exit Criteria
- [ ] Adversarial AI suite: 100% of diagnosis/prescription/drug-dose attempts blocked (hard ship gate — G4)
- [ ] Pen test: no open High or Critical findings
- [ ] RLS sweep: 100% table coverage; all multi-user negative-assertion tests green
- [ ] Load test: triage path stable at 5,000 concurrent; p95 within budget; ER fallback fires correctly under load
- [ ] Compliance E2E: export + delete within SLA for all three markets; Hindi consent present; grievance officer reachable
- [ ] WCAG AAA on triage flow; AA app-wide; no urgency-by-color-only instance remaining
- [ ] All "Coming Soon" stubs: zero dead-end buttons
- [ ] EMERGENCY keyword hard-rule confirmed active under all flag states
- [ ] Automated backups tested for restore in both regions
- [ ] iOS App Store + Google Play Store submission completed
- [ ] PWA live at canonical URL
- [ ] Launch runbook signed off; ≥ 20 verified vets online overnight (G6 supply gate)

---

## 5. Sprint Summary Table

| Sprint | Phase | Weeks | Theme | Stories / Tasks | Est. Points | Key Exit Gate |
|---|---|---|---|---|---|---|
| Sprint 0 | Phase 0 | 1–2 | Scaffold & Frozen Seams | INFRA-01–06, E20-US1/US3/US4, CONTRACT-01–06, DESIGN-01–02, DOC-01 | 61 | CI green; all contracts frozen; five-tab shell boots |
| Sprint 1 | Phase 1 | 3–4 | Anchor Prototype (Approval Gate) | E3-US1/2/3/4/6/8, E4-US1, E5-US1/2/4, E10-US1, E1-US7, E19-US5 | 60 | **Founder approval** — full mock flow zero dead-ends |
| Sprint 2 | Phase 2 | 5–6 | Auth & Onboarding | E1-US1–7, AUTH-TEST-01/02 | 51 | Auth merge-blocking tests green; OTP + RBAC live |
| Sprint 3 | Phase 2 | 7–8 | Owner & Pet Profiles | E2-US1–6, PROFILE-TEST-01 | 34 | Multi-pet CRUD live; species gate + RLS verified |
| Sprint 4 | Phase 2 | 9–10 | Triage Core + ER Finder + Vet Onboarding | E3-US2/3/4/5/7, E10-US1/2/3, E6-US1/5, TRIAGE-TEST-01 | 67 | Adversarial suite 100% pass; keyword rules indestructible |
| Sprint 5 | Phase 2 | 11–12 | Matching + Chat + Payments + Routing Notifs | E4-US1–5, E5-US1/2/3/4, E6-US4, E7-US1/2/3, E21-US1/2, PAYMENTS-TEST-01 | 90 | Authorize-then-capture live; full care + money path |
| Sprint 6 | Phase 2 | 13–14 | Vet Verification Admin + Payouts + Compliance Core | E6-US2/3, E7-US4/5/6/7, E5-US5/6, E19-US1–6, VET-TEST-01 | 68 | No auto-approve; W-8BEN DB block; consent + data rights live |
| Sprint 7 | Phase 2 | 15–16 | Admin Dashboard + Integration Hardening | E18-US1–5, E5-US4 harden, INTEGRATION-01–04, E21-US3/4 | 56 | Phase 2 integration test suite passes; metrics dashboard live |
| Sprint 8 | Phase 3 | 17–18 | Symptom Checker + Toxic Lookup | E8-US1/2/3, E9-US1/2/3, SYMPTOM-TEST-01, TOXIC-TEST-01 | 45 | Adversarial subset passes; offline toxic cache |
| Sprint 9 | Phase 3 | 19–20 | Medical Records + Reminders | E11-US1/2/3, E12-US1/2/3, RECORDS-TEST-01, REMINDER-TEST-01 | 41 | Multi-caregiver records + reminders live; RLS scoped |
| Sprint 10 | Phase 3 | 21–22 | Telehealth + Services + Notifications Full | E13-US1/2/3, E14-US1/2/3, E21-US1–4 (complete) | 48 | Jurisdiction gate live; full notification chain |
| Sprint 11 | Phase 3 | 23–24 | Community + Places + QR + Coming-Soon Stubs | E16-US1–4, E15-US1/2, E17-US1/2/3, E18-US1/5 full, E20-US1/2 | 51 | Zero dead-end buttons; all stubs navigable |
| Sprint 12 | Phase 4 | 25–26 | Hardening + Pen Test + App Store Submission | HARD-01–13 | 77 | 100% adversarial pass; no open High/Critical pen test findings; stores submitted |

**Total: 13 sprints (Sprint 0–12) | 26 calendar weeks | ~749 story points**

---

## 6. Merge-Blocking Test Matrix

Tests that must be green before any PR merges to `main` (from the sprint they are introduced):

| Test Suite | Introduced | Covers |
|---|---|---|
| RLS multi-user negative-assertion | Sprint 0 | All tables — present from scaffold |
| Auth suite | Sprint 2 | OTP expiry, rate-limit, role claims, RLS on `users` |
| Triage adversarial suite | Sprint 4 | Content filter 100% block; keyword hard-rules all 5 triggers; audit log write |
| Payment suite | Sprint 5 | Authorize-then-capture; no-vet auth release; ledger write-only |
| Vet verification suite | Sprint 6 | No auto-approve; W-8BEN DB block; annual lapse |
| Symptom/toxic safety subset | Sprint 8 | No diagnosis/drug+dose output from checker or lookup |
| Booking + notification suite | Sprint 10 | Jurisdiction gate; fallback chain; opt-in enforcement |
| Community/QR suite | Sprint 11 | Pending-post visibility; QR field privacy |
| Full adversarial AI suite (extended) | Sprint 12 | All channels + all AI output surfaces — ship gate |

---

## 7. Non-Code Critical Path (Founder / Ops — must run in parallel)

These are not engineering tasks but will block launch if not started immediately:

| Item | PRD Ref | Owner | Must Complete By |
|---|---|---|---|
| Vet recruitment: 40–60 verified India vets, contractual minimum online hours | D2 | Founder/Ops | Sprint 7 (to test routing with real vets) |
| Legal review: disclaimer + structured-response templates, all 3 markets | D3 | Founder + Counsel | Sprint 4 (before triage goes live) |
| Indian CA opinion on TDS/GST + India payout structuring | D4 | Founder + CA | Sprint 6 (before payouts configured) |
| Named India grievance officer + data fiduciary disclosure | D5 | Founder | Sprint 6 |
| Stripe-India eligibility confirmation + Wise Business setup | D6 | Founder/Ops | Sprint 5 |
| App store accounts (Apple + Google) | D8 | Founder/Ops | Sprint 10 (review lead time) |
| Open questions Q1–Q10 resolved by Founder | PRD §9 | Founder | Sprint 2 (pricing/SLA), Sprint 4 (data retention), Sprint 6 (QR privacy, community photos) |

---

*End of Sprint Plan — Draft v1. Sprint IDs (Sprint 0–12) and story IDs (E1-US1 … E21-US4) are stable references for architecture, test strategy, and specialist build agents.*
