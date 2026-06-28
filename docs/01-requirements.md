# PetCare 24/7 — Product Requirements Document (PRD)

## 1. Document Control

| Field | Value |
|---|---|
| Document | PetCare 24/7 — Requirements Specification (PRD) |
| File | `/Users/ipsitaghosh/petcare-247/docs/01-requirements.md` |
| Owner | Business Analyst (BA) |
| Status | **Draft v1** |
| Date | 2026-06-28 |
| Source of truth | Approved Master Build Plan (`/Users/ipsitaghosh/.claude/plans/enumerated-moseying-sifakis.md`) |
| Audience | Founder/Product, PM, Solutions Architect/CTO, UX, UI, Frontend, Backend, Payments, Compliance, QA/Test-Lead, and the specialist build agents |
| Related docs (planned) | `02-architecture.md`, `03-roadmap-and-sprints.md`, `04-interface-contracts.md`, `05-test-strategy.md` |
| Change control | BA owns edits; material scope changes require Founder sign-off; story IDs are stable contracts once referenced downstream. |

### Conventions
- **MoSCoW**: Must / Should / Could / Won't (this release).
- Acceptance criteria use numbered **Given/When/Then** (G/W/T) and are written to be testable.
- Story IDs are stable: `E<epic>-US<n>` (e.g. `E3-US2`). Do not renumber after publication.
- "Launch markets" = USA + Canada + India, region-aware from day one.
- "Live marketplace sides at launch" = Owners + Vets only; all other sides are sequenced or stubbed behind feature flags.

---

## 2. Executive Summary & Product Vision

PetCare 24/7 is a **mobile-first** (iOS + Android primary; web secondary) cross-platform pet super-app whose anchor is a **3am promise**: a worried owner taps once and reaches a qualified, currently-online vet who answers the single question that matters in a panic — *"is this an emergency, or can it wait?"* The moat is built from three things competitors lack: **24/7 coverage via time zones** (US/Canada night = India daytime), **micro-payments** (first question free, then ~$1–5), and a **vet-reputation flywheel**.

The product is deliberately **triage-only** — never diagnosis, never prescription — which keeps it inside a permanent legal safe harbor (no VCPR required) across all three launch markets, and is precisely why it can operate cross-border where prescription-issuing incumbents legally cannot. Two invariants govern every decision: **enough vets are genuinely online at 3am EST**, and **the system never once outputs a diagnosis or a drug+dose**. Around the anchor sits a full pet super-app — health profiles, records, reminders, ER finder, toxic-food lookup, telehealth booking, local services, pet-friendly places, a moderated community, and lost-pet QR tags — plus the operational spine of vet onboarding/verification, payments/payouts, and an admin back-office.

---

## 3. Goals & Success Metrics

| # | Goal | Metric | Launch target |
|---|---|---|---|
| G1 | Deliver the 3am anchor reliably | `no_vet_available_rate` (sessions with no human vet inside SLA) | < 5% of triage sessions |
| G2 | Fast human reach | Median time-to-first-vet-reply | < 3 min (P90 < 5 min) |
| G3 | Never get a panicking user stuck | ER-fallback success (sessions with no vet that reached ER finder) | 100% |
| G4 | Safety invariant holds | Diagnosis/drug-dose leaks in production | **0** (adversarial suite must pass 100%) |
| G5 | Conversion off the free first question | Free → first paid question conversion | ≥ 15% within 30 days |
| G6 | Vet supply liquidity | Avg. vets online during US/CA overnight (00:00–06:00 ET) | ≥ 20 concurrent at launch |
| G7 | Trust flywheel | % completed consults that receive a rating | ≥ 50% |
| G8 | Retention / re-request | 30-day repeat-question rate (owners with ≥2 questions) | ≥ 25% |
| G9 | Activation | Signup → first pet profile created | ≥ 70% |
| G10 | Vet quality gate | Vets going live without completed credential verification | **0** (no auto-approve) |
| G11 | Compliance readiness | Data export/delete requests fulfilled within SLA | 100% within 30 days (DPDP/CCPA/PIPEDA) |
| G12 | Payment integrity | Disputed/charge-back rate on captured charges | < 0.75% |
| G13 | Reliability | Triage-path uptime | ≥ 99.9% monthly |

---

## 4. Scope

### 4.1 In Scope — MVP (all 12 core features + operational spine)
1. "Is it an emergency?" triage chat — Claude Sonnet AI pre-screen + human vet routing **[anchor]**.
2. Symptom checker with urgency rating.
3. Pet health profile (broad species; triage launches dogs & cats only).
4. Vaccine/medical records + photos.
5. Nearest emergency vet finder (map / call / directions).
6. Med/feeding reminders (multi-caregiver).
7. Toxic-food / poison lookup.
8. Non-urgent telehealth booking (province/state-gated where required).
9. Local services finder.
10. Pet-friendly places map.
11. Moderated community board (lost/found + advice).
12. Lost-pet QR tag (digital at MVP).

**Operational spine (also in MVP):** unified OTP auth (phone + email) + RBAC; owner + pet profiles; vet onboarding + credential verification (no auto-approve); vet earnings dashboard; ratings/reviews/re-request; wallet/credits + payments (authorize-then-capture); admin dashboard (approve vets, moderate, metrics, disputes/refunds, configure pricing); compliance (consent, AI disclosure, export/delete); feature-flag system; notifications (push/email/SMS).

**Region-aware from day one:** two-region data residency (US/CA `us-east-1`, India `ap-south-1`/Mumbai); dual payout rails (Stripe Connect Express US/CA, Wise Business India).

### 4.2 Out of Scope — Coming Soon (stub only; do NOT build)
Owner dating/social, kids' chores, creator tools, travel planner, treat box, grief support, AR games, **species beyond dogs/cats for triage**. Each appears as a flagged **"Coming Soon"** card (slot exists, code is a stub) — never a dead end, never built this release.

### 4.3 Deferred / Sequenced (planned, not launch)
| Item | Status |
|---|---|
| Razorpay owner charging (India, UPI) | Phase 2+ (Stripe-only charging at launch) |
| RazorpayX INR-native payouts | After Wise Business |
| Video consults | Fast-follow (text chat only at launch) |
| Groomers/walkers/sitters/trainers marketplace | Phase 2 — self-serve listings + reviews (direct contact, no in-app booking) |
| Suppliers/commerce | Phase 3 — affiliate-first (Chewy/Amazon), powered by pet likes/dislikes |
| Care Pack bundle pricing | Month 2 (micro-payments only at launch) |
| US-based premium vet tier | Later (India vets at launch) |
| Dark mode | Not at launch |

---

## 5. Personas

| Persona | Snapshot | Primary Jobs-To-Be-Done |
|---|---|---|
| **Maya — the anxious owner @ 3am (US/CA)** | New mom of a Lab puppy in Toronto; it's 3am, the puppy ate something and is shaking; she's terrified and doesn't know if it's worth a $400 ER trip. | "Tell me fast and clearly: emergency or can it wait?"; "If it's an emergency, get me to the nearest open ER now"; "Don't make me create an account before you help me." |
| **Dr. Anand — the vet in India** | Licensed vet in Bengaluru; works PetCare 24/7 during his afternoon (US/CA night) for supplemental income; cares about reputation and fair, transparent pay. | "Get verified once and start earning"; "Show me incoming questions with context (pet profile, symptoms, urgency)"; "Let me answer safely via the structured form"; "Pay me reliably and show my earnings." |
| **Priya — groomer / provider** | Runs a mobile grooming service; wants discoverability among local pet owners. | "List my service so owners find me"; "Collect reviews to build trust"; (Phase 2) "Be reachable directly." |
| **Sam — community member** | Long-time dog owner; posts lost/found notices and answers newcomer questions. | "Post a lost-pet notice that's seen fast"; "Give/get advice in a safe, moderated space"; "Trust that ratings and posts aren't gamed." |
| **Rosa — admin / back-office** | Operations + trust & safety lead. | "Verify vets before they go live"; "Moderate the community"; "Handle disputes/refunds"; "Watch supply/SLA metrics"; "Configure pricing and feature flags." |

---

## 6. Epic Index

| ID | Epic |
|---|---|
| E1 | Onboarding & Auth (OTP phone + email) |
| E2 | Owner & Pet Profiles (incl. likes/dislikes → product engine) |
| E3 | Emergency Triage (AI pre-screen + safety rules + ER fallback) **[anchor]** |
| E4 | Vet Matching & Routing (timezone, SLA, ER fallback) |
| E5 | Consult Chat + Ratings / Re-request |
| E6 | Vet Onboarding & Credential Verification |
| E7 | Vet Earnings & Payments / Wallet |
| E8 | Symptom Checker |
| E9 | Toxic-Food / Poison Lookup |
| E10 | ER Vet Finder |
| E11 | Medical Records & Vaccines |
| E12 | Reminders (med/feeding, multi-caregiver) |
| E13 | Telehealth Booking (non-urgent) |
| E14 | Local Services Finder |
| E15 | Pet-Friendly Places Map |
| E16 | Community (moderated, lost/found + advice) |
| E17 | Lost-Pet QR Tag |
| E18 | Admin / Back-office |
| E19 | Compliance & Data Rights |
| E20 | Feature Flags & Coming-Soon Stubs |
| E21 | Notifications |

---

## 7. Epics & User Stories

> Safety/legal rules appear as **hard acceptance criteria** (bolded) and are merge-blocking from Phase 2 on. Wherever an AI or vet response is produced, the "never a diagnosis, never a drug+dose, never 'you don't need a vet'" rule applies even if not restated.

---

### E1 — Onboarding & Auth (OTP phone + email)

One unified login **and** signup flow. Accepts phone number **and** email; verified by OTP/one-time code (OTP is the primary credential — no password-first). Social (Google/Apple) optional. RBAC from day one: owner / vet / provider / admin. Region is captured at signup and drives data residency.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E1-US1 | As a new or returning user, I want one flow that handles both signup and login via phone or email, so that I don't have to choose or remember a password. | Must | 1. **Given** the auth screen, **when** I enter a valid phone or email and continue, **then** the system sends a one-time code and shows the code-entry screen, regardless of whether the account already exists. 2. **Given** a correct OTP, **when** I submit it, **then** existing users land on Home and new users proceed to profile creation. 3. **Given** no password field is ever shown, **when** I complete auth, **then** I am authenticated by OTP alone. |
| E1-US2 | As a user, I want my OTP delivered by SMS or email, so that I can verify on whichever I provided. | Must | 1. **Given** I entered a phone number, **when** I request a code, **then** it is sent via SMS (Twilio). 2. **Given** I entered an email, **when** I request a code, **then** it is sent via email (Resend). 3. **Given** a code, **then** it expires within 10 minutes and is single-use. |
| E1-US3 | As a user, I want protection against code abuse, so that my account is secure. | Must | 1. **Given** 5 failed OTP attempts, **when** I try again, **then** the code is invalidated and I must request a new one. 2. **Given** repeated requests, **then** rate-limiting/throttling applies per identifier and per device. 3. **Given** a resend, **then** a cooldown timer is enforced. |
| E1-US4 | As a user, I want to optionally use Google or Apple sign-in, so that I can sign in faster. | Could | 1. **Given** the auth screen, **when** I choose Google/Apple, **then** I authenticate and land in the same RBAC/profile flow. 2. **Given** social is unavailable, **then** OTP remains fully functional (social never blocks the primary path). |
| E1-US5 | As the system, I want every user assigned exactly one active role context (owner/vet/provider/admin), so that RBAC and RLS scope correctly. | Must | 1. **Given** a new signup, **when** the account is created, **then** it carries a role claim in the JWT. 2. **Given** a role, **when** any API call is made, **then** RLS scopes data to that role's context. 3. **Given** a role change, **then** it is admin-controlled and audit-logged. |
| E1-US6 | As a user in a specific market, I want my region detected/confirmed at signup, so that my data is stored in the correct residency region. | Must | 1. **Given** signup, **when** I select/confirm my market (US/CA/India), **then** a `region` claim is set. 2. **Given** the region claim, **when** I make requests, **then** the gateway routes to the correct regional Supabase project. 3. **Given** an India user, **then** consent is presented in English **and** Hindi (see E19). |
| E1-US7 | As an owner in a panic, I want to reach triage without a signup wall, so that I am never blocked from help. | Must | 1. **Given** the app's first screen, **when** I tap "Ask a Vet Now," **then** triage starts and the safety/keyword rules run before any account is required. 2. **Given** I must eventually create an account to be matched to a human/charge, **then** the prompt appears at the point of decision, never as an upfront wall. |

---

### E2 — Owner & Pet Profiles (incl. likes/dislikes → product engine)

Owner profile (name, address, phone, email) created right after first login. One or many pet profiles per owner; profile supports a **broad species set** (dog, cat, parrot, rabbit, + more) even though triage launches dogs & cats only. Likes/dislikes explicitly feed a future product-suggestion engine.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E2-US1 | As a new owner, I want to create my owner profile (name, address, phone, email), so that vets and services have context. | Must | 1. **Given** first login, **when** profile creation opens, **then** name, address, phone, email are captured (email/phone may pre-fill from auth). 2. **Given** required fields, **when** I submit, **then** validation enforces format (phone/email/address). 3. **Given** a saved profile, **then** it is editable later from Account. |
| E2-US2 | As an owner, I want to add one or many pets, so that each pet has its own record. | Must | 1. **Given** my account, **when** I add a pet, **then** I can create multiple distinct pet profiles. 2. **Given** multiple pets, **when** I start triage, **then** I select which pet the question is about. |
| E2-US3 | As an owner, I want to record species/breed/color/weight/age/allergies, so that triage and records are accurate. | Must | 1. **Given** a new pet, **when** I pick species, **then** I can choose dog, cat, parrot, rabbit, and more. 2. **Given** species, **then** breed, color, weight, age, allergies are capturable (allergies optional/"if known"). 3. **Given** missing optional fields, **then** the profile still saves. |
| E2-US4 | As an owner, I want to record my pet's likes/dislikes, so that I get better suggestions later. | Should | 1. **Given** a pet profile, **when** I add likes/dislikes (optional), **then** they save to a structured field. 2. **Given** likes/dislikes exist, **then** they are stored so a future product-suggestion engine can consume them (no live suggestions required at MVP). |
| E2-US5 | As an owner with a non-dog/cat pet, I want to still create its profile, so that the app works for all my pets even before triage covers them. | Must | 1. **Given** a parrot/rabbit/etc., **when** I create the profile, **then** it saves normally. 2. **Given** I start triage for a non-dog/cat species, **then** the app clearly states triage currently covers dogs & cats and offers the ER finder / non-urgent options instead (never a dead end). |
| E2-US6 | As an owner, I want to upload a pet photo/avatar, so that my pet is recognizable. | Could | 1. **Given** a pet profile, **when** I add a photo, **then** it is stored (regional storage) and shown as a circular avatar. |

---

### E3 — Emergency Triage (AI pre-screen + safety rules + ER fallback) **[anchor]**

The anchor flow. Claude Sonnet pre-screens, returns a structured **1–5 urgency score** into fixed templates; a **server-side content filter** blocks drift; **keyword hard-rules** force EMERGENCY and show the ER finder before any AI text while firing human routing in parallel; an **immutable AI audit log** records every interaction; a **"no vet → nearest ER"** fallback guarantees no one is stuck.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E3-US1 | As an anxious owner, I want to tap one prominent "Ask a Vet Now" button anywhere, so that help is always one tap away. | Must | 1. **Given** any screen except the chat itself, **then** the amber "Ask a Vet Now" anchor is visible. 2. **Given** I tap it, **then** triage starts immediately. 3. **Given** Home, **then** "X vets online now" is displayed. |
| E3-US2 | As an owner, I want the AI to ask short pre-screen questions and give an urgency read, so that I get a fast first answer. | Must | 1. **Given** a started triage, **when** I describe symptoms, **then** Claude asks targeted follow-ups and returns a structured urgency score 1–5. 2. **Given** the score, **then** the UI shows it via fixed template phrasing (ER now / vet within 24h / monitor) using color **and** text/icon (never color alone). 3. **Given** any AI text, **then** an AI-involvement disclosure is shown (see E19). |
| E3-US3 | As a user, I want the system to never produce a diagnosis or medication dose, so that I'm safe and the service stays legal. | Must | 1. **Given** any AI or templated output, **then** it **NEVER contains a disease conclusion ("diagnosed with X")**. 2. **Given** any output, **then** it **NEVER contains a drug name + dose**. 3. **Given** any output, **then** it **NEVER says "you don't need a vet."** 4. **Given** the server-side content filter detects drug+dose or "diagnosed with X" (regex, independent of the prompt), **then** the output is blocked and the event is raised as **P1**. 5. **Given** the adversarial test suite, **then** 100% of diagnosis/prescription attempts are blocked (merge-blocking). |
| E3-US4 | As an owner facing a red-flag symptom, I want instant escalation, so that critical cases aren't delayed by chat. | Must | 1. **Given** input containing a hard-rule keyword (**seizure, breathing trouble, collapse, bleeding, toxin**), **when** detected, **then** the case is forced to EMERGENCY. 2. **Given** EMERGENCY, **then** the ER finder is shown **before any AI text**. 3. **Given** EMERGENCY, **then** human routing fires **in parallel**. 4. **Given** any feature flag state, **then** the keyword hard-rule **cannot be disabled**. |
| E3-US5 | As compliance/QA, I want every AI interaction logged immutably, so that we can audit safety and gate model upgrades. | Must | 1. **Given** any triage AI call, **then** prompt, model version, output, and timestamp are written to an **append-only/immutable** audit log. 2. **Given** a model upgrade, **then** it is gated by passing the adversarial suite before rollout. 3. **Given** logs, **then** they are tamper-evident and access-controlled. |
| E3-US6 | As a panicking owner when no vet is available, I want a guaranteed fallback, so that I'm never stuck. | Must | 1. **Given** no human vet accepts within the SLA (default 3 min, ER fallback at >3 min wait), **then** the app routes me to the nearest ER finder. 2. **Given** the fallback, **then** I always have a clear next action (call/directions). 3. **Given** the fallback fires, **then** `no_vet_available_rate` is incremented for metrics. |
| E3-US7 | As an owner whose pet is not a dog or cat, I want triage to behave safely, so that I'm guided appropriately. | Must | 1. **Given** a non-dog/cat species, **when** I attempt triage, **then** the app states triage currently covers dogs & cats and offers ER finder + non-urgent booking. 2. **Given** this branch, **then** keyword hard-rules and ER fallback still apply (safety never degraded). |
| E3-US8 | As an owner, I want the triage flow to work end-to-end even before backend is live, so that I can preview the full path. | Must | 1. **Given** a preview build, **when** I walk open → ask → AI pre-screen → matched-vet answer → rate, **then** the full path works with realistic mock data. 2. **Given** any increment, **then** no screen is a dead-end button. |

---

### E4 — Vet Matching & Routing (timezone, SLA, ER fallback)

Routes triage cases to currently-online, qualified vets, exploiting timezone coverage; enforces SLA timers; triggers ER fallback. Cross-region matching passes only a PII-free payload (urgency, species, language, region).

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E4-US1 | As an owner, I want my question routed to an online, verified vet fast, so that I get a human answer quickly. | Must | 1. **Given** a triage case ready for human routing, **when** routing runs, **then** only **verified, online** vets are eligible. 2. **Given** eligible vets, **then** the case is offered and assigned on first acceptance. 3. **Given** matching, **then** median assignment supports time-to-first-reply < 3 min (G2). |
| E4-US2 | As the system, I want SLA timers on each case, so that stalled cases escalate. | Must | 1. **Given** an unaccepted case, **when** the SLA timer (default 3 min) elapses, **then** ER fallback (E3-US6) fires. 2. **Given** an accepted-but-idle case, **then** escalation/reassignment logic applies. |
| E4-US3 | As compliance, I want cross-region matching to carry no PII, so that data residency holds. | Must | 1. **Given** a case routed across regions (e.g., US owner → India vet), **then** only a PII-free payload (urgency, species, language, region) crosses. 2. **Given** the consult, **then** message storage stays in the owner's residency region. |
| E4-US4 | As an owner, I want language-aware routing, so that I'm matched to a vet who can communicate. | Should | 1. **Given** my language, **when** routing runs, **then** language is a matching signal. 2. **Given** no language match, **then** fallback rules still route or escalate to ER. |
| E4-US5 | As ops, I want supply visibility, so that I can manage the 3am promise. | Must | 1. **Given** the matching system, **then** it tracks `vets_online`, `no_vet_available_rate`, and time-to-first-reply. 2. **Given** Home, **then** "X vets online now" reflects real online count. |

---

### E5 — Consult Chat + Ratings / Re-request

Realtime text chat between owner and matched vet, behind a `ChatTransport` interface; Postgres is the permanent store. Vet replies use a **structured form**, never a free diagnosis box. Owners rate completed consults and can re-request a vet.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E5-US1 | As an owner, I want a realtime chat with my matched vet, so that I can describe the situation and get guidance. | Must | 1. **Given** an assigned case, **when** the vet replies, **then** messages appear in realtime for both parties. 2. **Given** the chat, **then** messages persist in Postgres (permanent store). 3. **Given** the transport, **then** it sits behind `ChatTransport` (swappable without UI change). |
| E5-US2 | As a vet, I want to answer via a structured form, so that I stay within the safe harbor. | Must | 1. **Given** a case, **when** I respond, **then** I complete: (a) **urgency verdict** (ER now / vet within 24h / monitor), (b) **general guidance**, (c) **"questions to ask your own vet" (required)**. 2. **Given** the form, **then** there is **no free-text field that permits a disease conclusion or drug+dose**. 3. **Given** "questions to ask your own vet" is empty, **then** the reply cannot be submitted. |
| E5-US3 | As the system, I want vet replies filtered too, so that safety holds even with a human. | Must | 1. **Given** a vet reply, **then** the same server-side content filter (drug+dose, "diagnosed with X") applies. 2. **Given** a blocked reply, **then** it is not delivered and the event is logged (P1). |
| E5-US4 | As an owner, I want to rate the consult, so that good vets rise. | Must | 1. **Given** a completed consult, **when** it ends, **then** I'm prompted to rate (only verified owners who had the consult can rate). 2. **Given** a rating, **then** it updates the vet's public reputation. 3. **Given** ratings, **then** earnings remain private while ratings are public. |
| E5-US5 | As an owner, I want to re-request a vet I liked, so that I get continuity. | Should | 1. **Given** a past consult, **when** I re-request that vet, **then** if they're online the case is offered to them first. 2. **Given** they're offline, **then** standard routing + ER fallback apply (never a dead end). |
| E5-US6 | As an owner, I want a transcript of my consult, so that I can share it with my own vet. | Should | 1. **Given** a completed consult, **then** a transcript (including disclaimers and "questions to ask your own vet") is available in records. 2. **Given** the transcript, **then** it can be exported/shared. |

---

### E6 — Vet Onboarding & Credential Verification

Vets self-onboard but **no vet goes live without manual credential verification** (license + ID + registry cross-check). No auto-approve. Annual re-verification. India vets must clear a W-8BEN gate before first payout (see E7).

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E6-US1 | As a vet, I want to apply and submit credentials, so that I can start earning. | Must | 1. **Given** the vet onboarding flow, **when** I apply, **then** I can submit license number, ID, registry details, and region. 2. **Given** submission, **then** my status is `pending` and I cannot receive cases. |
| E6-US2 | As an admin, I want a verification queue, so that I approve only legitimate vets. | Must | 1. **Given** pending applications, **when** I review, **then** I can cross-check license against the registry, verify ID, and approve/reject with reason. 2. **Given** approval, **then** the vet becomes eligible for routing. 3. **Given** **no path** auto-approves a vet. |
| E6-US3 | As compliance, I want annual re-verification, so that credentials stay current. | Must | 1. **Given** an approved vet, **when** 12 months elapse, **then** re-verification is required and lapse blocks new case assignment. |
| E6-US4 | As a vet, I want to set my availability/online status, so that the timezone model works. | Must | 1. **Given** a verified vet, **when** I toggle online, **then** I become eligible for routing and count toward "X vets online." 2. **Given** offline, **then** I receive no new cases. |
| E6-US5 | As an India vet, I want clear payout prerequisites, so that I know what to complete before earning out. | Must | 1. **Given** an India vet, **then** W-8BEN collection is shown as a hard prerequisite to first payout. 2. **Given** `w8ben_collected` is false, **then** payouts are **non-bypassably** blocked (see E7-US5). |

---

### E7 — Vet Earnings & Payments / Wallet

Charge owners via Stripe (US/CA) now; Razorpay (India) later. First-question-free; rail-agnostic credits ledger; configurable per-question tiers; **authorize-then-capture**. Pay vets via Stripe Connect Express (US/CA) + Wise Business (India) → RazorpayX later. Payment-provider abstraction built in Sprint 1. PCI SAQ-A (no raw card data). Wallet/payment tables are Edge-Function-write-only.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E7-US1 | As a new owner, I want my first question free, so that I try the service risk-free. | Must | 1. **Given** signup, **then** one non-transferable promo credit (user-level, 90-day expiry) is granted. 2. **Given** my first question, **then** no charge occurs. 3. **Given** the promo is used/expired, **then** standard pricing applies. |
| E7-US2 | As an owner, I want to pay small per-question fees via wallet/credits, so that cost matches value. | Must | 1. **Given** default tiers (Quick $1.99 / Standard $3.99 / Extended $6.99, admin-configurable), **when** I start a paid question, **then** the correct tier is applied. 2. **Given** a charge, **then** it flows through a rail-agnostic credits ledger. 3. **Given** PCI scope, **then** **no raw card data touches our servers (SAQ-A)**. |
| E7-US3 | As an owner, I want to be charged only when I actually get help, so that I'm not billed for nothing. | Must | 1. **Given** a paid session, **when** it starts, **then** the charge is **authorized** (not captured). 2. **Given** the vet sends a substantive reply, **then** the charge is **captured**. 3. **Given** no vet within 5 min → ER fallback, **then** the authorization is **released** (no capture). |
| E7-US4 | As a vet, I want a clear earnings dashboard, so that I trust the pay. | Must | 1. **Given** completed consults, **then** my dashboard shows earnings, platform take (30–35% via application fee), and payout status. 2. **Given** earnings, **then** they are **private** to me (not public). |
| E7-US5 | As the platform, I want payouts on the correct rail with tax gates enforced, so that we pay legally and reliably. | Must | 1. **Given** a US/CA vet, **then** payout uses Stripe Connect Express. 2. **Given** an India vet, **then** payout uses Wise Business (RazorpayX later). 3. **Given** an India vet without `w8ben_collected = true`, **then** payout is **DB-enforced blocked** (non-bypassable). 4. **Given** new rails, **then** they are added via config (payment-provider abstraction), not rewrite. |
| E7-US6 | As an admin, I want to configure pricing/tiers/take-rate, so that we can tune economics. | Must | 1. **Given** the admin pricing config, **when** I change tiers or take-rate, **then** changes apply without a code deploy. 2. **Given** a change, **then** it is audit-logged. |
| E7-US7 | As the system, I want wallet/payment tables write-protected, so that balances can't be tampered with. | Must | 1. **Given** wallet/payment tables, **then** they are **Edge-Function-write-only** (no direct client writes). 2. **Given** RLS, **then** users can read only their own ledger rows. |

---

### E8 — Symptom Checker

A structured symptom checker that produces an urgency rating, complementary to the AI triage chat, under the same safety rules.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E8-US1 | As an owner, I want to select symptoms and get an urgency rating, so that I gauge severity without typing. | Must | 1. **Given** the symptom checker, **when** I select symptoms for a dog/cat, **then** I receive an urgency rating (1–5 mapped to ER now / 24h / monitor). 2. **Given** the result, **then** it uses color **and** text/icon. 3. **Given** any red-flag symptom selected, **then** keyword hard-rules force EMERGENCY + ER finder. |
| E8-US2 | As a user, I want the symptom checker to stay within safe limits, so that it never diagnoses. | Must | 1. **Given** any output, **then** **no disease conclusion and no drug+dose** appear. 2. **Given** the result screen, **then** a path to "Ask a Vet Now" and the disclaimer are present. |
| E8-US3 | As an owner, I want the checker to hand off to triage, so that I can escalate to a human. | Should | 1. **Given** a checker result, **when** I tap "Ask a Vet Now," **then** the symptoms pre-fill the triage context. |

---

### E9 — Toxic-Food / Poison Lookup

A searchable database of foods/substances toxic to dogs & cats, with severity and a clear "toxin → EMERGENCY" path.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E9-US1 | As an owner, I want to look up whether a food/substance is toxic, so that I know if I should worry. | Must | 1. **Given** the lookup, **when** I search an item, **then** I see a toxicity verdict and severity for the relevant species. 2. **Given** a toxic result, **then** a clear next-step (Ask a Vet Now / ER finder) is shown. |
| E9-US2 | As a user, I want a toxin hit to escalate safely, so that poisonings aren't underplayed. | Must | 1. **Given** a high-severity toxin result, **then** the "toxin" keyword hard-rule path is offered (EMERGENCY + ER finder before any AI text). 2. **Given** any result, **then** **no drug+dose treatment instruction** is given. |
| E9-US3 | As an owner offline, I want core toxic-food data available, so that I can check in a low-signal moment. | Could | 1. **Given** poor connectivity, **then** a cached core toxic-food list is still searchable. |

---

### E10 — ER Vet Finder

Find the nearest emergency vet via Google Maps/Places, with call and directions. Powers the ER fallback. Region-aware.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E10-US1 | As an owner in an emergency, I want the nearest ER vet on a map with call/directions, so that I can act immediately. | Must | 1. **Given** location permission, **when** I open the ER finder, **then** I see nearby emergency vets on a map. 2. **Given** a result, **then** I can call and get directions in one tap. 3. **Given** EMERGENCY/fallback, **then** the ER finder appears before any AI text. |
| E10-US2 | As an owner who denied location, I want a manual search, so that I'm never blocked. | Must | 1. **Given** denied/unavailable location, **when** I enter an address/postal code, **then** results appear. 2. **Given** no results, **then** a national emergency-help fallback (e.g., poison line) is shown — never a dead end. |
| E10-US3 | As a user in any launch market, I want region-correct results, so that listings are relevant. | Must | 1. **Given** my region (US/CA/India), **then** results and formats (phone, units) are localized. |

---

### E11 — Medical Records & Vaccines

Store vaccine and medical records with photos, per pet; available to share with the owner's own vet.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E11-US1 | As an owner, I want to record vaccines with dates, so that I track immunization. | Must | 1. **Given** a pet, **when** I add a vaccine record (name + date), **then** it saves and lists chronologically. 2. **Given** a due/expiry date, **then** an optional reminder can be set (see E12). |
| E11-US2 | As an owner, I want to upload medical record photos/documents, so that history is centralized. | Must | 1. **Given** a pet, **when** I upload a photo/document, **then** it stores in the correct residency region and links to the pet. 2. **Given** files, **then** access is RLS-scoped to the owner. |
| E11-US3 | As an owner, I want to share records with my own vet, so that the consult informs in-person care. | Should | 1. **Given** records, **when** I export/share, **then** a shareable summary (incl. consult transcript) is produced. |

---

### E12 — Reminders (med/feeding, multi-caregiver)

Medication and feeding reminders with multi-caregiver support so a household shares the schedule.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E12-US1 | As an owner, I want med/feeding reminders, so that I don't miss doses or meals. | Must | 1. **Given** a pet, **when** I create a reminder (time/recurrence), **then** I receive a push/notification at the scheduled time. 2. **Given** a reminder, **then** I can mark it done/snooze. |
| E12-US2 | As a household, I want multiple caregivers to share reminders, so that anyone can cover. | Should | 1. **Given** I invite a caregiver, **when** they accept, **then** they see/act on shared reminders. 2. **Given** one caregiver marks done, **then** others see it updated. 3. **Given** sharing, **then** access is permission-scoped (caregiver role on that pet only). |
| E12-US3 | As a user, I want reminders to never imply a dose recommendation, so that safety holds. | Must | 1. **Given** a med reminder, **then** it stores only what the **owner** entered (name/amount they input), and the app **never suggests a drug or dose**. |

---

### E13 — Telehealth Booking (non-urgent)

Schedule non-urgent telehealth consults, province/state-gated where virtual VCPR rules require it.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E13-US1 | As an owner with a non-urgent issue, I want to book a telehealth slot, so that I plan a consult. | Must | 1. **Given** availability, **when** I pick a slot, **then** a booking is created with confirmation + reminder. 2. **Given** a booking, **then** payment follows the wallet/charge flow (E7). |
| E13-US2 | As compliance, I want bookings gated by jurisdiction, so that we respect VCPR rules. | Must | 1. **Given** a region/province that does not permit standalone virtual VCPR, **then** standalone telehealth booking is **flag-gated off** there. 2. **Given** a gated region, **then** the user is offered triage + ER finder instead (never a dead end). |
| E13-US3 | As an owner, I want to manage/cancel a booking, so that I stay in control. | Should | 1. **Given** an upcoming booking, **when** I cancel/reschedule within policy, **then** it updates and any authorization is handled correctly. |

---

### E14 — Local Services Finder

Discover local pet services. At MVP this is a finder; full provider marketplace (groomers/walkers/sitters/trainers) is Phase 2 (self-serve listings + reviews, direct contact, no in-app booking).

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E14-US1 | As an owner, I want to find local pet services, so that I can get care beyond vets. | Should | 1. **Given** the Services tab, **when** I search by location/type, **then** I see relevant listings. 2. **Given** a listing, **then** I can view details and contact directly. |
| E14-US2 | As a provider (Phase 2), I want to self-list my service, so that owners find me. | Could | 1. **Given** a provider account, **when** I create a listing, **then** it appears in the finder. 2. **Given** Phase 2 scope, **then** in-app booking is **not** required (direct contact only); the slot exists as a Coming-Soon for booking. |
| E14-US3 | As an owner, I want reviews on services, so that I choose well. | Could | 1. **Given** a service I used, **when** I review it, **then** the review shows on the listing (moderation per E16/E18). |

---

### E15 — Pet-Friendly Places Map

A map of pet-friendly places (parks, cafes, hotels) via Google Places.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E15-US1 | As an owner, I want to find pet-friendly places nearby, so that I can go out with my pet. | Should | 1. **Given** location/region, **when** I open the map, **then** pet-friendly places appear with type filters. 2. **Given** a place, **then** I can get directions. |
| E15-US2 | As a user, I want region-correct, accurate place data, so that listings are trustworthy. | Should | 1. **Given** my region, **then** results are localized. 2. **Given** stale/incorrect entries, **then** a report mechanism exists. |

---

### E16 — Community (moderated, lost/found + advice)

A moderated community board for lost/found notices and advice. Every post is `pending` first (manual moderation at launch). Text at launch; photos as a fast-follow.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E16-US1 | As a community member, I want to post lost/found notices and advice, so that I get help from others. | Should | 1. **Given** the Community tab, **when** I submit a post, **then** it is created with status `pending`. 2. **Given** `pending`, **then** it is **not publicly visible** until approved. |
| E16-US2 | As an admin/moderator, I want to review posts before they go live, so that the space stays safe. | Must | 1. **Given** pending posts, **when** I review, **then** I can approve/reject with reason. 2. **Given** approval, **then** the post becomes public. 3. **Given** moderation, **then** actions are audit-logged. |
| E16-US3 | As a user, I want to report or flag content, so that bad posts get removed. | Should | 1. **Given** a public post, **when** I report it, **then** it enters a moderation review queue. |
| E16-US4 | As a user, I want community guidance to never substitute for emergency care, so that safety holds. | Must | 1. **Given** an emergency-sounding post, **then** the UI surfaces "Ask a Vet Now" / ER finder. 2. **Given** community advice, **then** standard disclaimers apply (community is not medical advice). |

---

### E17 — Lost-Pet QR Tag

A digital QR tag (MVP) that, when scanned, surfaces owner contact / pet info to help reunite lost pets.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E17-US1 | As an owner, I want a QR tag for my pet, so that a finder can reach me. | Should | 1. **Given** a pet, **when** I generate a QR tag, **then** a unique scannable code is produced (digital at MVP). 2. **Given** a scan, **then** a public-safe page shows the info I chose to expose + a contact path. |
| E17-US2 | As an owner, I want to control what a finder sees, so that I protect my privacy. | Must | 1. **Given** the QR config, **when** I set visibility, **then** only fields I opt to share are shown on scan. 2. **Given** a scan, **then** my full address is **never** exposed unless I explicitly opt in. |
| E17-US3 | As an owner, I want to mark a pet lost/found, so that the tag state reflects reality. | Could | 1. **Given** a pet, **when** I toggle lost/found, **then** the scan page reflects status and can link to a community post (E16). |

---

### E18 — Admin / Back-office

Internal tooling: approve vets, moderate community, view metrics, handle disputes/refunds, configure pricing & flags.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E18-US1 | As an admin, I want to approve/reject vets, so that only verified vets go live. | Must | 1. **Given** the vet queue (E6), **when** I act, **then** status updates and the decision is audit-logged. 2. **Given** no auto-approve exists. |
| E18-US2 | As an admin, I want a metrics dashboard, so that I manage supply, SLA, and safety. | Must | 1. **Given** the dashboard, **then** I see `vets_online`, `no_vet_available_rate`, time-to-first-reply, conversion, and P1 safety events. |
| E18-US3 | As an admin, I want to handle disputes/refunds, so that payment issues are resolved. | Must | 1. **Given** a disputed charge, **when** I review, **then** I can refund/credit and the action is audit-logged. 2. **Given** refunds, **then** they reconcile against the credits ledger. |
| E18-US4 | As an admin, I want to configure pricing and feature flags, so that we tune the product without deploys. | Must | 1. **Given** pricing/flag config, **when** I change values, **then** they apply at runtime and are audit-logged. 2. **Given** the keyword hard-rule, **then** it **cannot** be disabled by any flag. |
| E18-US5 | As an admin, I want to moderate community content, so that the board stays safe. | Must | 1. **Given** the moderation queue (E16), **when** I act, **then** content state updates and actions are logged. |

---

### E19 — Compliance & Data Rights

CCPA/CPRA (US, + AI/ADMT disclosure), PIPEDA (Canada), India DPDP Act (consent EN+Hindi, named data fiduciary, in-app grievance officer, data residency). Consent + export/delete from day one; disclaimers at the moment of decision, never a signup wall.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E19-US1 | As a user, I want a plain-language consent screen with nothing pre-checked, so that my consent is real. | Must | 1. **Given** signup, **when** consent is shown, **then** **no box is pre-checked**. 2. **Given** an India user, **then** consent is available in **English and Hindi**. 3. **Given** consent, **then** it is versioned and recorded with timestamp. |
| E19-US2 | As a user, I want to export and delete my data from Account, so that I control my information. | Must | 1. **Given** Account, **when** I request export, **then** I receive my data within SLA. 2. **Given** a delete request, **then** my data is deleted/anonymized per policy within SLA (immutable safety audit logs retained per legal basis, de-identified where required). 3. **Given** both, **then** they work from day one. |
| E19-US3 | As a US user, I want AI involvement disclosed, so that ADMT/CPRA is met. | Must | 1. **Given** any AI-assisted output, **then** an AI-involvement disclosure is shown at the point of use (ADMT, eff. Jan 2026). 2. **Given** per-state rules, **then** a per-state feature flag can act as a compliance kill switch. |
| E19-US4 | As an India user, I want a grievance officer and clear fiduciary, so that DPDP rights are honored. | Must | 1. **Given** the India experience, **then** an **in-app grievance officer** contact is present. 2. **Given** DPDP, **then** a named data fiduciary is disclosed. 3. **Given** India data, **then** it is stored in the India region (`ap-south-1`). |
| E19-US5 | As compliance, I want disclaimers shown at the moment of decision, so that users are informed without friction. | Must | 1. **Given** triage/symptom/toxic outputs, **then** the "triage only, not diagnosis/prescription" disclaimer is shown at that screen. 2. **Given** disclaimers, **then** they are **never** used as a signup wall blocking emergency help. |
| E19-US6 | As compliance, I want region-correct data residency enforced, so that cross-border rules hold. | Must | 1. **Given** a user's region claim, **then** the gateway routes to the correct regional Supabase project. 2. **Given** cross-region matching, **then** only PII-free payloads cross (E4-US3). |

---

### E20 — Feature Flags & Coming-Soon Stubs

A feature-flag system (`<IfEnabled>` wrapper + flag table) controlling sequenced sides and excluded features. Every not-yet-built feature is a flagged "Coming Soon" card — slot exists, code is a stub, never a dead end.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E20-US1 | As the platform, I want runtime feature flags, so that we sequence sides safely. | Must | 1. **Given** the flag table, **when** a flag is toggled, **then** the wrapped UI/feature enables/disables at runtime. 2. **Given** a disabled feature, **then** it renders a "Coming Soon" card, not a dead end. |
| E20-US2 | As a user, I want excluded features shown as "Coming Soon," so that I see the vision without broken links. | Must | 1. **Given** an excluded feature (dating, chores, creator tools, travel, treat box, grief support, AR games, non-dog/cat triage), **then** a "Coming Soon" card appears. 2. **Given** the card, **then** tapping it explains the feature, never errors. |
| E20-US3 | As compliance, I want the keyword hard-rule exempt from flags, so that safety can't be turned off. | Must | 1. **Given** any flag configuration, **then** the EMERGENCY keyword hard-rule (E3-US4) remains active. |
| E20-US4 | As the platform, I want a permanent five-tab nav, so that scope stays disciplined. | Must | 1. **Given** the app, **then** nav is exactly five tabs: Home / My Pets / Services / Community / Account. 2. **Given** any new feature, **then** **no sixth tab is added**; "Ask a Vet Now" stays a floating button. |

---

### E21 — Notifications

Push (Expo), email (Resend), SMS (Twilio) for OTP, case routing, vet replies, reminders, bookings, and admin alerts.

| ID | As a / I want / so that | MoSCoW | Acceptance Criteria (G/W/T) |
|---|---|---|---|
| E21-US1 | As a vet, I want to be notified of an incoming case fast, so that I can accept within SLA. | Must | 1. **Given** I'm online, **when** a case is routed to me, **then** I receive a push notification immediately. 2. **Given** I don't respond, **then** SLA escalation (E4-US2) proceeds. |
| E21-US2 | As an owner, I want to be notified when my vet replies, so that I don't miss the answer. | Must | 1. **Given** a vet reply, **then** I receive a push (and email/SMS fallback if push fails). |
| E21-US3 | As a user, I want reminder and booking notifications, so that I act on time. | Must | 1. **Given** a reminder/booking time, **then** I receive a timely notification. 2. **Given** I disable a channel, **then** preferences are respected. |
| E21-US4 | As a user, I want notification preferences and consent, so that I control contact. | Should | 1. **Given** Account, **when** I set channel preferences, **then** they're honored. 2. **Given** transactional vs marketing, **then** marketing requires explicit opt-in (per market law). |

---

## 8. Non-Functional Requirements (NFRs)

### Security
- **NFR-S1** — RLS is the tenancy primitive: every row carries `user_id`/`role_context_id`; all access auto-scopes to the JWT role claim with **no app-layer filtering**. **RLS multi-user negative-assertion tests are merge-blocking in CI.**
- **NFR-S2** — Wallet/payment tables are **Edge-Function-write-only**; no direct client writes.
- **NFR-S3** — PCI **SAQ-A**: no raw card data touches our servers; all card handling delegated to Stripe/Razorpay.
- **NFR-S4** — OTP credentials: codes single-use, ≤10-min expiry, attempt-limited and rate-limited per identifier/device.
- **NFR-S5** — Immutable, tamper-evident AI audit log; access-controlled and retained per legal basis.
- **NFR-S6** — Pre-launch pen test (OWASP Mobile + API) with no open High/Critical findings; secrets never in client bundles.
- **NFR-S7** — Server-side content filter runs independently of the prompt (defense in depth) and is merge-blocking via the adversarial suite.

### Privacy & Data Residency
- **NFR-P1** — Two-region residency: US/CA in `us-east-1`, India in `ap-south-1` (Mumbai); a Cloudflare Workers gateway routes by `region` claim.
- **NFR-P2** — Cross-region matching transfers only PII-free payloads (urgency, species, language, region).
- **NFR-P3** — Consent is explicit, versioned, nothing pre-checked; India consent in EN + Hindi.
- **NFR-P4** — Data export and delete available from day one, fulfilled within legal SLA (CCPA/CPRA, PIPEDA, DPDP).
- **NFR-P5** — Compliance kill switches via per-state/per-region feature flags (except the safety hard-rule).
- **NFR-P6** — AI-involvement disclosure (ADMT/CPRA) shown at point of use.

### Scalability
- **NFR-SC1** — Modular monolith with directory-enforced module boundaries; **no cross-module direct DB access**; modules independently extractable later.
- **NFR-SC2** — Realtime behind a `ChatTransport` interface (Supabase Realtime now, swappable to Ably) with Postgres as permanent store; **load-tested to 5,000 concurrent**.
- **NFR-SC3** — Payment-provider abstraction so new rails (Razorpay, RazorpayX) are config, not rewrite (built Sprint 1).
- **NFR-SC4** — Stateless edge functions; horizontal scale; no sticky sessions required for the triage path.

### Performance
- **NFR-PF1** — Time-to-first-vet-reply median < 3 min (P90 < 5 min); ER fallback at > 3 min wait (G2/G3).
- **NFR-PF2** — AI pre-screen first response within a few seconds under normal load; EMERGENCY ER finder renders **before** any AI text on a hard-rule hit.
- **NFR-PF3** — App cold start and Home render fast on mid-tier phones (mobile-first); "X vets online" reflects near-real-time count.
- **NFR-PF4** — Triage-path API p95 latency budget defined and monitored (Sentry/PostHog/Checkly).

### Accessibility (WCAG)
- **NFR-A1** — WCAG **AA** minimum app-wide; **AAA on the triage flow**.
- **NFR-A2** — Urgency is **never communicated by color alone** (always text + icon).
- **NFR-A3** — Tap targets ≥ 48px; body text ≥ 16sp at 1.5 line height; reduced-motion respected.
- **NFR-A4** — Triage flow usable at 20% screen brightness (the 3am rule); full screen-reader support on the anchor path.

### Reliability
- **NFR-R1** — Triage-path uptime ≥ 99.9% monthly (G13); monitored with PagerDuty alerting.
- **NFR-R2** — Guaranteed **"no vet → nearest ER"** fallback so a panicking user is never stuck (100%, G3).
- **NFR-R3** — Authorize-then-capture with automatic authorization release on fallback (no erroneous captures).
- **NFR-R4** — Automated backups of Postgres (both regions); tested restore; transcripts/records durable.
- **NFR-R5** — Graceful degradation: if AI is unavailable, keyword hard-rules + human routing + ER finder still function.

### Maintainability / Quality Gates
- **NFR-Q1** — Tests on **auth, payments, and triage are merge-blocking from Phase 2 on**.
- **NFR-Q2** — Each AI model upgrade is gated by passing the adversarial diagnosis/prescription suite (100%).
- **NFR-Q3** — Specialist agents build against **frozen interface contracts**; seams (RLS schema, `ChatTransport`, payment abstraction, flag wrapper, vet-response template) frozen in Phase 0.

---

## 9. Assumptions, Dependencies & Open Questions

### Assumptions
- **A1** — Launch is **text chat only**; video is a fast-follow.
- **A2** — At launch, **India-based vets** serve US/CA overnight demand; a US premium vet tier comes later.
- **A3** — **Stripe-only** owner charging at launch; Razorpay (India/UPI) follows in Phase 2.
- **A4** — Lost-pet QR is **digital-only** at MVP (no physical tags).
- **A5** — Community moderation is **manual** at launch; every post `pending` first.
- **A6** — Triage covers **dogs & cats only** at launch; profiles support a broader species set.
- **A7** — Micro-payments only at launch; Care Pack bundle pricing arrives ~month 2.
- **A8** — Founder approval gate after Phase 1 mockups precedes any Phase 2 production feature code.

### Dependencies
- **D1** — Third-party services: Supabase (2 projects), Claude Sonnet, Stripe + Stripe Connect Express, Wise Business, Google Maps/Places, Twilio (SMS/OTP), Resend (email), Expo Push, Sentry/PostHog/Checkly/PagerDuty, Cloudflare Workers.
- **D2** — **Vet recruitment** (40–60 verified India vets with a contractual minimum-online commitment) — longest lead time, the #1 existential risk; must begin immediately (non-code, founder/ops).
- **D3** — **Legal review** of disclaimer + structured-response templates across all three markets (non-code).
- **D4** — **Indian CA opinion** on TDS/GST and structuring India payouts from the US entity (non-code).
- **D5** — Named **India grievance officer** and data fiduciary disclosure (non-code).
- **D6** — Confirm **Stripe-India eligibility** and complete **Wise Business** setup (non-code/ops).
- **D7** — Commission the **"Paw Pulse"** signature vector illustration (design dependency).
- **D8** — App store accounts/review (Apple App Store, Google Play) for mobile distribution.

### Open Questions for the Founder
- **Q1** — Confirm default pricing tiers ($1.99 / $3.99 / $6.99) and platform take (30–35%) for launch markets, incl. India INR equivalents.
- **Q2** — Confirm the SLA threshold (3 min default) and the exact "substantive reply" definition that triggers capture (who decides — vet action, message length, or admin rule?).
- **Q3** — What is the data-retention period for consult transcripts and the immutable AI audit log per market, and the delete/anonymization policy that still satisfies safety/legal retention?
- **Q4** — For Canada telehealth booking: which provinces are permitted at launch (which to flag off)?
- **Q5** — Lost-pet QR privacy default: what is the minimum a finder sees, and is any contact relay (masked phone/email) needed to avoid exposing raw contact info?
- **Q6** — Community scope at launch: is photo upload in or strictly text-only first?
- **Q7** — Re-verification cadence confirmation (annual) and what evidence/registry sources are authoritative per market.
- **Q8** — Marketing-notification opt-in policy and any SMS regulatory constraints per market (TCPA/CASL/India DLT).
- **Q9** — Promo-credit policy edge cases: per-person vs per-device fraud controls; reactivation of expired credits?
- **Q10** — Confirm which web pages need SEO/SSR at launch (vet profiles, community) vs app-only.

---

*End of PRD — Draft v1. Story IDs (E1-US1 … E21-US4) are stable references for the PM, architecture, sprint plan, and test strategy.*
