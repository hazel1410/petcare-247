# PetCare 24/7 — Project Plan

## 1. Document Control

| Field | Value |
|---|---|
| Document | PetCare 24/7 — Project Plan |
| File | `/Users/ipsitaghosh/petcare-247/docs/02-project-plan.md` |
| Owner | Project Manager (PM) |
| Status | **Draft v1** |
| Date | 2026-06-28 |
| Source of truth | Approved Master Build Plan (`/Users/ipsitaghosh/.claude/plans/enumerated-moseying-sifakis.md`) |
| PRD reference | `/Users/ipsitaghosh/petcare-247/docs/01-requirements.md` |
| Audience | Founder/Product, Solutions Architect/CTO, BA, UX, UI, Frontend, Backend, Payments, Compliance, QA/Test-Lead |
| Change control | PM owns edits; milestone date changes require Founder sign-off; epic-scope changes require BA + Founder sign-off. |

---

## 2. Delivery Approach

### Methodology
Agile delivery in **2-week sprints**. Each sprint produces a working, deployed, end-to-end slice — never a partial screen or a dead-end button. The standing rule is: *every increment ships a live clickable URL with the full flow working, mock data acceptable before backend is live.*

### Parallel-Agent Model
Specialist agents (Frontend, Backend, Payments, Compliance, QA, UX/UI) build in **parallel against frozen interface contracts** established in Phase 0. This means:

- Phase 0 freezes all seams: RLS schema, `ChatTransport` interface, payment-provider abstraction, feature-flag wrapper, and the vet structured-response template.
- Once seams are frozen, no agent waits on another — each builds to contract.
- Contracts change only via a formal contract-change request (CCR) signed off by the Architect/CTO and PM; all downstream agents are notified before merging.
- CI is the integration point. Merge-blocking tests (auth, payments, triage, RLS multi-user negative assertions, adversarial diagnosis/prescription suite) are the objective "done" signal, not verbal agreement.

### Sprint Cadence

| Ceremony | Frequency | Duration | Attendees |
|---|---|---|---|
| Sprint Planning | Every 2 weeks (Monday) | 2 hours | PM, Architect, all agents |
| Daily Standup | Daily | 15 min async (written) | All agents |
| Sprint Review / Demo | Every 2 weeks (Friday) | 1 hour | All agents + Founder |
| Sprint Retrospective | Every 2 weeks (Friday) | 45 min | All agents |
| Founder Approval Gate | At Phase 1 end + Phase 2 end | 90 min | Founder, PM, UX, Architect |
| Architecture Sync | Weekly | 30 min | Architect, PM, Backend, Frontend |
| Compliance Review | Bi-weekly | 30 min | Compliance, PM, Founder |

### Branching & Deployment
- `main` is always deployable; feature branches merge via PR.
- Merge-blocking CI runs on every PR from Phase 2 on (auth, payments, triage, RLS, adversarial suite).
- Preview URL generated per PR (Expo EAS Preview + web preview).
- Production deploys require PM + Architect sign-off; no Friday-afternoon deploys without explicit Founder waiver.

---

## 3. Milestones & Phases

### Phase 0 — Scaffold & Frozen Contracts
**Target duration:** 2 weeks (Sprint 0)

| Milestone | Definition of Done |
|---|---|
| M0.1 — Monorepo scaffold | Expo/RN + RN Web monorepo initialised; five-tab nav shell compiles and runs on iOS sim, Android emu, and web. No sixth tab. "Ask a Vet Now" floating button placeholder present. |
| M0.2 — Supabase dual-region | Two Supabase projects live (us-east-1, ap-south-1); Cloudflare Workers gateway routes by `region` claim; connection strings confirmed. |
| M0.3 — Frozen seams | RLS schema v1 merged and locked; `ChatTransport` interface defined and documented; payment-provider abstraction interface defined; feature-flag `<IfEnabled>` wrapper defined; vet structured-response template locked; keyword hard-rule list locked. All seam documents in `/docs/04-interface-contracts.md`. |
| M0.4 — CI skeleton | GitHub Actions pipeline runs lint + type-check on every PR. Merge-blocking test stubs (auth, payments, triage, RLS) exist and are marked `TODO: implement` — they fail red so Phase 2 cannot skip them. |
| M0.5 — Payment abstraction | Stripe (US/CA) and Wise Business (India) provider stubs wired to abstraction; no live keys yet; SAQ-A posture confirmed (no raw card data path). |
| M0.6 — Ops tooling baseline | Sentry, PostHog, Checkly, PagerDuty projects created; error budgets and SLA alert thresholds configured (triage-path uptime >= 99.9%). |

**Phase 0 Exit Criteria:** All M0.x milestones done; Architect/CTO signs off on seam freeze; no open blockers for parallel Phase 1 work.

---

### Phase 1 — Design System + Clickable Prototype
**Target duration:** 4 weeks (Sprints 1–2)

| Milestone | Definition of Done |
|---|---|
| M1.1 — Design tokens | Color, typography, spacing, motion tokens defined and in code (`design-tokens/`); "Paw Pulse" signature illustration delivered and integrated (D7). |
| M1.2 — Component library | Core UI components (buttons, inputs, cards, urgency indicators, tab bar, floating CTA) built in Storybook; urgency indicator uses color + text + icon (never color alone; NFR-A2). Tap targets >= 48px (NFR-A3). |
| M1.3 — Clickable prototype | Full prototype covering: Home → Ask a Vet Now → triage AI pre-screen → urgency display → matched vet chat → rating; plus: signup/login OTP flow, owner + pet profile creation, ER finder, symptom checker, toxic-food lookup. Mock data throughout. Every screen reachable; no dead ends. Live URL delivered to Founder. |
| M1.4 — WCAG AA audit | All prototype screens pass WCAG AA minimum; triage flow passes AAA (NFR-A1). Audit report in `/docs/`. |
| M1.5 — Founder approval gate | Founder reviews live prototype URL, approves design direction and complete flow. **No Phase 2 feature code starts until this gate is passed.** Feedback logged and triaged by PM + UX. |

**Phase 1 Exit Criteria:** M1.1–M1.4 done; Founder approval gate passed (M1.5); all open design feedback items triaged (accepted, deferred, or closed).

---

### Phase 2 — MVP Core
**Target duration:** 8 weeks (Sprints 3–6)

Covers: unified OTP auth + RBAC (E1), owner + pet profiles (E2), emergency triage AI + safety rules + ER fallback (E3), vet matching + routing (E4), consult chat + ratings (E5), vet onboarding + credential verification (E6), vet earnings + payments / wallet (E7), admin dashboard core (E18 partial), compliance baseline (E19), feature flags (E20), push notifications for triage + routing (E21 partial).

| Milestone | Definition of Done |
|---|---|
| M2.1 — Auth live (E1) | OTP phone + email signup/login live in both regions; RBAC JWT claims set; rate-limiting and attempt-limits enforced; social (Google/Apple) stubbed as "Coming Soon" or delivered if complete. |
| M2.2 — Profiles live (E2) | Owner profile and pet profiles (broad species + dogs/cats triage flag) create/read/update; likes/dislikes structured field saved; pet photo upload to correct regional storage. |
| M2.3 — Triage + safety live (E3) | Claude Sonnet pre-screen wired; urgency 1–5 returned into fixed templates; keyword hard-rule fires EMERGENCY + ER finder before AI text; server-side content filter live; immutable AI audit log writing; adversarial diagnosis/prescription test suite passing 100% (merge-blocking); no-vet ER fallback fires correctly. |
| M2.4 — Vet matching live (E4) | Routing to verified online vets; SLA timer (3 min) wired to ER fallback; PII-free cross-region payload confirmed; "X vets online" count live on Home. |
| M2.5 — Chat + ratings live (E5) | Realtime chat behind `ChatTransport` (Supabase Realtime); vet structured-response form enforced (urgency verdict + general guidance + "questions to ask your own vet" required); server-side filter on vet replies; completed-consult rating flow live; consult transcript available in records. |
| M2.6 — Vet onboarding live (E6) | Vet application + credential submission; admin verification queue; no auto-approve path exists; annual re-verification timer set; online/offline toggle live. |
| M2.7 — Payments live (E7) | First-question-free promo credit granted at signup; authorize-then-capture flow live (Stripe US/CA); capture on substantive vet reply; authorization released on ER fallback; Wise Business India payout wired; W-8BEN gate non-bypassably enforced; wallet/payment tables Edge-Function-write-only; PCI SAQ-A confirmed. |
| M2.8 — Admin core live (E18 partial) | Vet approval queue; safety P1 event dashboard; basic metrics (vets_online, no_vet_available_rate, time-to-first-reply); pricing config (no deploy required to change tiers); keyword hard-rule cannot be disabled via any flag (E20-US3). |
| M2.9 — Compliance baseline (E19) | Consent screen (nothing pre-checked; EN + Hindi for India); AI-involvement disclosure at point of use; data export and delete self-serve from Account (day-one); India grievance officer in-app contact; data residency routing confirmed for both regions; disclaimer at triage/symptom screens (never a signup wall). |
| M2.10 — Merge-blocking CI green | All merge-blocking tests pass on `main`: auth, payments, triage, RLS multi-user negative assertions, adversarial suite. No open High/Critical findings from pen-test baseline. |

**Phase 2 Exit Criteria:** M2.1–M2.10 all done; no P0/P1 safety events in staging; internal demo end-to-end (open app → triage → vet reply → rate → payout visible in vet dashboard). Second Founder approval gate passed.

---

### Phase 3 — Remaining Launch Features
**Target duration:** 6 weeks (Sprints 7–9)

Covers: symptom checker (E8), toxic-food / poison lookup (E9), ER vet finder full (E10), medical records + vaccines (E11), reminders multi-caregiver (E12), telehealth booking (E13), local services finder (E14), pet-friendly places map (E15), community board (E16), lost-pet QR tag (E17), admin moderation + disputes (E18 completion), notification preferences (E21 completion).

| Milestone | Definition of Done |
|---|---|
| M3.1 — Symptom checker live (E8) | Structured symptom selector → urgency 1–5 output; keyword hard-rules apply; "Ask a Vet Now" handoff with symptom pre-fill; no disease name or drug+dose in output. |
| M3.2 — Toxic-food lookup live (E9) | Searchable toxin database (dogs + cats); severity verdict; high-severity routes to EMERGENCY + ER finder; core data cached for offline (E9-US3 if priority permits). |
| M3.3 — ER finder full (E10) | Google Maps/Places integration; location + manual search fallback; region-correct results + formats; national emergency-help fallback when no results found. |
| M3.4 — Medical records live (E11) | Vaccine records with dates; document/photo upload to correct regional storage; RLS-scoped; shareable summary export. |
| M3.5 — Reminders live (E12) | Med/feeding reminders with push delivery; multi-caregiver invite + shared reminder state; app never suggests a drug or dose (only owner-entered content). |
| M3.6 — Telehealth booking live (E13) | Slot picker + confirmation + reminder; payment via wallet; jurisdiction gate (VCPR flag by province/state); cancel/reschedule within policy; no dead end for gated regions. |
| M3.7 — Services + places live (E14, E15) | Local services finder (search by location/type; direct contact); pet-friendly places map with type filters and directions; report mechanism for stale listings. |
| M3.8 — Community live (E16) | Post submission → `pending`; admin/moderator approval before public; report/flag queue; emergency-sounding posts surface "Ask a Vet Now"; standard disclaimers shown. |
| M3.9 — Lost-pet QR live (E17) | Per-pet QR code generated; public-safe scan page respects owner visibility config; full address never exposed by default; lost/found status toggle. |
| M3.10 — Admin completion (E18) | Dispute/refund workflow with credits-ledger reconciliation; community moderation queue; full metrics dashboard (all G1–G13 metrics visible); audit log on all admin actions. |
| M3.11 — Notifications completion (E21) | Channel preferences in Account; marketing vs transactional distinction; TCPA/CASL/DLT compliance respected by market. |

**Phase 3 Exit Criteria:** M3.1–M3.11 done; all 12 core features + operational spine live in staging; regression suite green; QA sign-off on all Must-have stories.

---

### Phase 4 — Coming-Soon Stubs, Hardening & Launch
**Target duration:** 4 weeks (Sprints 10–11)

| Milestone | Definition of Done |
|---|---|
| M4.1 — Coming-Soon stubs (E20) | All excluded features (owner dating/social, kids chores, creator tools, travel, treat box, grief support, AR games, non-dog/cat triage expansion) render as "Coming Soon" cards behind flags; no dead ends; no broken links. |
| M4.2 — Pre-launch pen test | OWASP Mobile + API pen test completed; no open High/Critical findings; all secrets confirmed absent from client bundles. |
| M4.3 — Load test | Realtime `ChatTransport` load-tested to 5,000 concurrent (NFR-SC2); triage-path API p95 latency within budget; results documented. |
| M4.4 — Legal & compliance final review | Disclaimer templates and structured-response templates reviewed by legal counsel across all three markets (D3); India CA opinion on TDS/GST completed (D4); named grievance officer and data fiduciary disclosed in-app (D5). |
| M4.5 — App store submission | iOS (Apple App Store) and Android (Google Play) builds submitted; metadata, screenshots, privacy labels complete; review passed (D8). |
| M4.6 — Vet supply ready | >= 40 verified India vets with contractual minimum-online commitment confirmed; >= 20 concurrent online during 00:00–06:00 ET validated in staging (G6). |
| M4.7 — Operational readiness | PagerDuty alerting live; on-call rotation set; runbooks for P0/P1 safety events, ER fallback failures, and payment failures documented; Postgres backups tested (both regions). |
| M4.8 — Soft launch | Production deploy; limited user cohort (owner + vet invite-only); all G1–G13 metrics instrumented; no-vet-available rate confirmed < 5% in real traffic. |
| M4.9 — Public launch | Full public availability in all three launch markets; press/growth motion at Founder discretion. |

**Phase 4 Exit Criteria:** M4.1–M4.8 done; Founder confirms launch readiness; M4.9 executed.

---

## 4. Team Roster & RACI Matrix

### Role Definitions

| Role | Responsibilities |
|---|---|
| **Founder/Product** | Vision, approval gates, founder action items, go/no-go decisions |
| **PM** | Sprint planning, milestone tracking, dependency management, risk log, stakeholder comms |
| **Architect/CTO** | System design, seam definition, interface contracts, tech decisions, security posture, CCR sign-off |
| **BA** | Requirements ownership, story IDs, acceptance criteria, open-question resolution |
| **UX** | User flows, wireframes, prototype, accessibility audit, persona research |
| **UI** | Visual design, design tokens, "Paw Pulse" illustration, component library, Storybook |
| **Frontend** | Expo/RN + RN Web implementation, five-tab nav, screens, `<IfEnabled>` wrapper, realtime chat UI |
| **Backend** | Supabase schema, RLS, edge functions, routing engine, AI integration, content filter, audit log, notifications |
| **Payments** | Stripe Connect Express, Wise Business, credits ledger, authorize-then-capture, W-8BEN gate, payout rails |
| **Compliance** | Consent flows, data residency, export/delete, AI-disclosure, grievance officer wiring, market-specific flags |
| **QA/Test-Lead** | Test strategy, merge-blocking suite, adversarial suite, RLS negative assertions, pen-test coordination, load test |

### RACI Key
**R** = Responsible (does the work) | **A** = Accountable (single sign-off) | **C** = Consulted | **I** = Informed

### Epic RACI

| Epic | Architect | BA | PM | UX | UI | Frontend | Backend | Payments | Compliance | QA |
|---|---|---|---|---|---|---|---|---|---|---|
| E1 — Auth & OTP | A | C | I | C | C | R | R | I | C | R |
| E2 — Owner & Pet Profiles | C | A | I | R | R | R | R | I | C | R |
| E3 — Emergency Triage **[anchor]** | A | C | I | R | R | R | R | I | C | R |
| E4 — Vet Matching & Routing | A | C | I | I | I | C | R | I | C | R |
| E5 — Consult Chat + Ratings | A | C | I | R | R | R | R | I | C | R |
| E6 — Vet Onboarding & Verification | C | A | I | R | R | R | R | I | C | R |
| E7 — Earnings & Payments / Wallet | A | C | I | C | C | R | R | R | C | R |
| E8 — Symptom Checker | C | A | I | R | R | R | R | I | C | R |
| E9 — Toxic-Food Lookup | C | A | I | R | R | R | R | I | C | R |
| E10 — ER Vet Finder | C | C | I | R | R | R | R | I | C | R |
| E11 — Medical Records | C | A | I | R | R | R | R | I | C | R |
| E12 — Reminders | C | A | I | R | R | R | R | I | C | R |
| E13 — Telehealth Booking | C | A | I | R | R | R | R | C | A | R |
| E14 — Local Services Finder | C | A | I | R | R | R | R | I | C | R |
| E15 — Pet-Friendly Places Map | C | A | I | R | R | R | R | I | C | R |
| E16 — Community | C | A | I | R | R | R | R | I | C | R |
| E17 — Lost-Pet QR Tag | C | A | I | R | R | R | R | I | C | R |
| E18 — Admin / Back-office | A | C | R | C | C | R | R | C | C | R |
| E19 — Compliance & Data Rights | C | C | I | C | C | R | R | C | A | R |
| E20 — Feature Flags & Stubs | A | C | I | C | C | R | R | I | I | R |
| E21 — Notifications | C | C | I | C | C | R | R | I | C | R |
| Seam definitions / contracts | A | C | I | C | C | C | C | C | C | C |
| Pen test / security | A | I | I | I | I | C | C | C | C | A |
| App store submission | C | I | A | C | R | R | C | I | C | C |

---

## 5. Dependency Map

### Phase-Level Sequencing

```
Phase 0 (Scaffold + Frozen Seams)
    └─► Phase 1 (Design System + Prototype)  [parallel UX/UI against frozen seams]
            └─► Founder Approval Gate ──────────────────────────────────────────┐
                    └─► Phase 2 (MVP Core)   [all agents parallel to contracts] │
                            └─► Phase 2 Exit / Internal Demo Gate               │
                                    └─► Phase 3 (Remaining Features) ◄──────────┘
                                            └─► Phase 4 (Hardening + Launch)
```

### Story-Level Critical Path

| Dependency | Blocked Item | Notes |
|---|---|---|
| M0.3 — Seams frozen | ALL Phase 2+ parallel build | Hard gate; no exceptions |
| M0.2 — Dual-region Supabase | E1 (Auth), E19 (data residency), E4 (cross-region routing) | Cannot auth without a live DB |
| M0.5 — Payment abstraction | E7 (Payments) | Abstraction must exist before Stripe/Wise wiring |
| E1 (Auth + RBAC) | E2, E3, E4, E5, E6, E7 | Every other epic requires an authenticated user |
| E2 (Pet Profiles) | E3 (Triage — species/pet context) | Triage requires knowing which pet |
| E3 (Triage safety rules + content filter) | E5 (Consult Chat filter), E8 (Symptom Checker) | Same filter reused — build once in E3 |
| E6 (Vet Verification) | E4 (Routing — only verified vets eligible) | Routing cannot run without verified vet records |
| E7 (Payment abstraction + Stripe live) | E13 (Telehealth Booking charges) | Booking reuses wallet flow |
| E3 + E10 (ER Finder) | E9 (Toxin lookup escalation), E16 (Community safety surface) | ER finder component reused |
| E19 (Consent + data rights) | App store submission | Apple/Google require privacy labels + consent flows |
| E20 (Feature flags) | E14, E15, E17, groomers stub, all "Coming Soon" stubs | Flag wrapper must exist before stubs |
| D2 — Vet recruitment (external) | M4.6 — Vet supply ready, M2.4 — vet matching live in staging | **Longest lead time; start immediately** |
| D3 — Legal review (external) | M4.4 — launch sign-off | Non-code; run in parallel from Phase 1 |
| D4 — Indian CA / TDS (external) | E7 India payout, M4.4 | Non-code; run in parallel from Phase 0 |
| D5 — Grievance officer named (external) | E19-US4, India launch | Non-code; resolve before Phase 2 |
| D6 — Wise Business setup (external) | E7-US5 India payout | Ops; must complete before Phase 2 payment work |
| D7 — "Paw Pulse" illustration (design) | M1.1 design tokens, Phase 1 prototype | Commission at Phase 0 start |
| D8 — App store accounts (ops) | M4.5 submission | Create/verify accounts in Phase 0; review in Phase 4 |

### Non-Code Long-Lead Items (must start at Phase 0)

| Item | Owner | Target completion |
|---|---|---|
| Vet recruitment (40–60 India vets, contractual online commitment) | Founder + Ops | Before Phase 3 end |
| Legal review — disclaimers + structured-response templates (all 3 markets) | Compliance + Founder | Before Phase 4 |
| Indian CA opinion — TDS/GST + India payout structuring | Founder + Compliance | Before Phase 2 payment work |
| Named India grievance officer + fiduciary disclosure | Founder + Compliance | Before Phase 2 compliance baseline |
| Stripe-India eligibility confirm + Wise Business account setup | Founder + Payments | Phase 0 |
| Apple App Store + Google Play developer accounts | Founder + PM | Phase 0 |

---

## 6. Risk Register

| # | Risk | Likelihood | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| R1 | **Vet supply @3am (US/CA overnight)** — insufficient verified India vets online; `no_vet_available_rate` > 5%; the anchor promise fails | **High** | **Critical** | Founder / Ops | Start recruitment in Phase 0 (D2); target 40–60 vets with contractual minimum-online commitment; staging load-test of concurrent online count before soft launch (M4.6); ER fallback is always live as the safety net (G3 = 100%) |
| R2 | **Diagnosis/prescription leak** — Claude or a vet response contains a disease conclusion or drug+dose, creating a safety/legal incident | **Medium** | **Critical** | Architect / Backend / QA | Server-side content filter independent of the prompt (NFR-S7); structured-response form with no free-text diagnosis field (E5-US2); keyword hard-rules non-disableable (E3-US4, E20-US3); adversarial suite merge-blocking 100% pass (NFR-Q2); immutable audit log (E3-US5); model upgrades gated by adversarial suite (NFR-Q2) |
| R3 | **AI under-triage** — Claude assigns urgency 1–2 to a genuinely critical case, delaying emergency care | **Medium** | **Critical** | Architect / Backend / QA | Keyword hard-rules fire before AI text on red-flag terms (E3-US4); structured urgency templates erring toward caution (i.e., 3 = "see vet within 24h," never "you're fine"); adversarial under-triage test cases in the suite; ER finder always one tap away from any screen; human vet routing fires in parallel on EMERGENCY |
| R4 | **India payout / tax complexity** — TDS/GST structuring unclear; payouts blocked or creating unexpected liabilities | **Medium** | **High** | Founder / Compliance | Indian CA opinion commissioned at Phase 0 (D4); W-8BEN gate non-bypassable in DB (E7-US5); Wise Business as interim rail before RazorpayX; compliance review bi-weekly from Phase 0 |
| R5 | **RLS leak / cross-tenant data exposure** — a bug in RLS policies exposes one user's data to another | **Low** | **Critical** | Architect / Backend / QA | RLS is the tenancy primitive, no app-layer filter fallback (NFR-S1); RLS multi-user negative-assertion tests are merge-blocking in CI (NFR-S1); wallet/payment tables Edge-Function-write-only (NFR-S2); pen test before launch (M4.2); staged rollout to catch any residual |
| R6 | **Realtime scaling under load** — `ChatTransport` (Supabase Realtime) saturates at peak concurrent consults | **Medium** | **High** | Architect / Backend | `ChatTransport` interface designed for swap (to Ably or equivalent) without UI change (NFR-SC2); load-tested to 5,000 concurrent before launch (M4.3); Postgres as durable permanent store so messages aren't lost on transport failure; load test at Phase 4 with go/no-go |
| R7 | **Rating/review gaming** — vets or owners manipulate ratings to game the reputation flywheel | **Medium** | **Medium** | Backend / Admin | Ratings locked to verified owner who completed the consult (E5-US4); one rating per consult, no editing after a time window; admin dashboard surfaces statistical anomalies (outlier rating velocity); moderation queue for flagged reviews; re-request tied to verified past consults only |
| R8 | **App store rejection** — Apple/Google reject the app for medical-advice, payment, or privacy reasons | **Medium** | **High** | PM / Compliance / Founder | "Triage and general guidance only, not diagnosis or prescription" positioning consistent in metadata, screenshots, and in-app copy; legal review of app store health-app guidelines (D3); Apple/Google developer accounts ready from Phase 0 (D8); pre-submission compliance checklist |
| R9 | **OTP delivery failure** — Twilio or Resend outage blocks auth for owners in a 3am panic | **Low** | **High** | Backend / Architect | Retry with exponential back-off; fallback: if OTP delivery fails after N retries, show Twilio/Resend status page and emergency vet-finder directly (pre-auth path); rate-limit abuse detection to avoid blocking legitimate retries |
| R10 | **Stripe India eligibility or Wise Business onboarding delay** — payout rail not ready before Phase 2 | **Medium** | **Medium** | Founder / Payments | Confirm Stripe-India eligibility and Wise Business at Phase 0 (D6); if delayed, India vets accumulate earnings in ledger and batch-payout once rail is live; no feature code blocked (abstraction built in Phase 0) |
| R11 | **Seam drift after freeze** — an agent makes a breaking change to a frozen interface without a formal CCR | **Medium** | **High** | Architect / PM | Formal CCR process documented; seam files are protected branches (no direct merge without Architect sign-off); contract-violation CI check on seam files |
| R12 | **DPDP Act / CPRA compliance gap** — a fast-changing regulatory landscape introduces a requirement missed in v1 | **Low** | **High** | Compliance | Compliance review bi-weekly; per-state/per-region feature flags as kill switches (NFR-P5); data export/delete live from day one (the hardest gap to retrofit); legal counsel retained from Phase 1 (D3) |

---

## 7. Definition of Ready & Definition of Done

### Definition of Ready (DoR) — Story enters a sprint only when all are true

1. Epic and story IDs are assigned and stable (`E<n>-US<n>` format).
2. Acceptance criteria are written in G/W/T format and reviewed by BA + QA.
3. Mockup or wireframe is approved by UX (for any user-facing story) or the interface contract is frozen (for any API/data story).
4. All dependencies of this story are done or have a confirmed date.
5. External dependencies (API keys, legal review, vet credentials) required to implement are in hand or formally deferred with a plan.
6. Story is estimated (story points or t-shirt size) by the responsible agent.
7. "Coming Soon" stories: the flag name is defined and the stub card design is approved.

### Definition of Done (DoD) — Story is done only when all are true

1. **Acceptance criteria pass** — every G/W/T criterion is verified (automated where possible; manual otherwise) and documented in the PR.
2. **CI is green** — lint, type-check, unit tests, integration tests all pass. From Phase 2 on: merge-blocking suites (auth, payments, triage, RLS multi-user negative assertions, adversarial suite) pass.
3. **No dead ends** — every screen reachable from this story has a clear next action; no button leads to a 404 or blank.
4. **Live URL confirmed** — a preview URL (Expo EAS Preview or web preview) is attached to the PR and confirmed working end-to-end with the full flow (mock data acceptable before backend).
5. **Safety rules upheld** — for any triage, chat, symptom, or toxin story: content filter passes; keyword hard-rule active; no diagnosis/drug+dose in output; AI disclosure present.
6. **Accessibility checked** — WCAG AA at minimum; triage-path stories require AAA; urgency never communicated by color alone; tap targets >= 48px.
7. **Regional correctness** — stories touching data storage or payments are confirmed routing to the correct region; PII-free payloads confirmed on cross-region paths.
8. **Code reviewed** — at least one peer review; Architect review required for any seam-touching change.
9. **Compliance sign-off** — for any auth, consent, payment, or data-rights story: Compliance agent has reviewed and approved the PR.
10. **Documented** — any new interface contract, environment variable, flag name, or operational runbook is updated in `/docs/`.

---

## 8. Governance & Ceremonies

### Recurring Ceremonies

| Ceremony | Cadence | Duration | Format | Facilitator | Output |
|---|---|---|---|---|---|
| Sprint Planning | Bi-weekly, Monday | 2 h | Synchronous (video) | PM | Sprint backlog committed; sprint goal agreed |
| Daily Standup | Daily | 15 min | Async written (Slack thread) | PM | Blocker list; dependency flags raised |
| Architecture Sync | Weekly | 30 min | Synchronous | Architect/CTO | CCR decisions; seam-drift checks; tech-debt triage |
| Compliance Review | Bi-weekly | 30 min | Synchronous | Compliance + PM | Regulatory change log; open compliance items |
| Sprint Review / Demo | Bi-weekly, Friday | 1 h | Synchronous + live URL demo | PM | Stakeholder feedback recorded; accepted stories |
| Sprint Retrospective | Bi-weekly, Friday | 45 min | Synchronous | PM (facilitated) | Improvement actions with owners |
| Risk Review | Monthly | 30 min | Synchronous | PM + Architect | Risk register updated; mitigations progressed |

### Founder Approval Gates

| Gate | Trigger | What is reviewed | Go / No-Go criteria |
|---|---|---|---|
| **Gate 1 — Prototype Approval** | End of Phase 1 (M1.5) | Live clickable prototype URL; full flow from Home → triage → vet reply → rating; all 12 core feature entry points present; WCAG AA audit report | Founder approves design direction and complete flow; no must-have design feedback unresolved. **Phase 2 feature code does not start until this gate passes.** |
| **Gate 2 — MVP Core Go/No-Go** | End of Phase 2 | Internal demo: end-to-end triage with real Claude integration; vet matching; payments; vet earnings dashboard; all merge-blocking CI green; no open P0/P1 safety events in staging | Founder confirms core anchor works; Architect confirms seam integrity; QA confirms adversarial suite 100%; Compliance confirms consent + data residency baseline. **Phase 3 parallel build accelerates after this gate.** |
| **Gate 3 — Launch Readiness** | End of Phase 4 / before soft launch | Pen test report (no open High/Critical); load test results; vet supply confirmation (>= 40 verified + >= 20 concurrent); legal review complete; app store submission approved; all G1–G13 metrics instrumented | All items above green; Founder explicit go-decision. |

### Change Control

- **Scope changes** to existing stories or epics: BA proposes → PM assesses impact → Founder signs off if milestone date is affected.
- **Contract changes** (seam/interface): any agent proposes CCR → Architect/CTO + PM review → all affected agents notified and confirm before merge.
- **Story IDs**: stable and never renumbered once published.
- **Emergency P0/P1 safety fixes**: bypass sprint cadence; Architect + PM + Founder on a call within 1 h; fix deployed same day; post-incident review within 48 h.

---

## 9. External & Founder Action Items

These items are **non-code** and cannot be delegated to build agents. Delays on these items directly block or risk milestones. All should begin at Phase 0.

| # | Action Item | Owner | Needed by | Blocks |
|---|---|---|---|---|
| FA1 | **Vet recruitment** — source, contract, and verify 40–60 India-based licensed vets; secure contractual minimum-online commitment covering 00:00–06:00 ET | Founder + Ops | Phase 3 end | M4.6 — Vet supply ready; G6 target |
| FA2 | **Legal review** — retain counsel to review disclaimer language, structured-response templates, and telehealth positioning across US, Canada, and India jurisdictions | Founder + Compliance | Phase 1 end | M4.4; D3 |
| FA3 | **Indian CA opinion** — obtain tax counsel opinion on TDS/GST treatment of India-to-US entity payouts and optimal structuring for India vet payments | Founder + Compliance | Phase 1 end | D4; E7 India payout |
| FA4 | **Named India grievance officer** — appoint a named individual as the DPDP Act grievance officer and data fiduciary; obtain their consent and contact details for in-app disclosure | Founder + Compliance | Before Phase 2 compliance baseline (M2.9) | D5; E19-US4 |
| FA5 | **Stripe-India eligibility** — confirm that the US entity can charge Indian owners via Stripe and document any restrictions or additional verification required | Founder + Payments | Phase 0 end | D6; E7 |
| FA6 | **Wise Business setup** — complete Wise Business account onboarding for India vet payouts; obtain account credentials for Payments agent | Founder + Payments | Phase 0 end | D6; E7-US5 |
| FA7 | **"Paw Pulse" illustration** — commission the signature vector illustration from a designer; deliver source files to UI agent | Founder / UI | Phase 1 start (Sprint 1) | D7; M1.1 |
| FA8 | **App store developer accounts** — create/verify Apple App Store (Apple Developer Program) and Google Play Console accounts | Founder + PM | Phase 0 end | D8; M4.5 |
| FA9 | **Confirm pricing tiers and take-rate** — confirm default per-question pricing ($1.99 / $3.99 / $6.99) and platform take (30–35%) for all launch markets; confirm India INR equivalents (Q1) | Founder | Phase 1 end | E7-US2; admin pricing config |
| FA10 | **SLA + capture trigger definition** — confirm the 3-minute SLA threshold and the definition of "substantive reply" that triggers payment capture (Q2) | Founder + BA | Phase 1 end | E7-US3; E4-US2 |
| FA11 | **Data retention policy** — define retention periods for consult transcripts and the immutable AI audit log per market, plus the delete/anonymisation policy for safety/legal retention (Q3) | Founder + Compliance | Phase 2 start | E19-US2; NFR-S5 |
| FA12 | **Canada telehealth jurisdictions** — confirm which Canadian provinces permit standalone virtual telehealth at launch vs which to flag off (Q4) | Founder + Compliance | Phase 2 start | E13-US2 |
| FA13 | **Lost-pet QR privacy default** — confirm minimum finder-visible fields and whether a contact-relay (masked phone/email) is needed (Q5) | Founder + BA | Phase 3 start | E17-US1, E17-US2 |
| FA14 | **Community scope at launch** — confirm text-only or photo upload for community posts at MVP (Q6) | Founder + BA | Phase 3 start | E16-US1 |
| FA15 | **Re-verification evidence sources** — confirm which license registries are authoritative per market (US/CA/India) and the evidence standard for annual re-verification (Q7) | Founder + Compliance | Phase 2 start | E6-US3 |
| FA16 | **Marketing notification policy** — confirm SMS regulatory constraints per market (TCPA / CASL / India DLT registration) and opt-in policy for marketing messages (Q8) | Founder + Compliance | Phase 2 start | E21-US4 |

---

*End of Project Plan — Draft v1. Story IDs and epic references align with PRD (`01-requirements.md`). All milestone definitions and gate criteria are binding for sprint planning and go/no-go decisions.*
