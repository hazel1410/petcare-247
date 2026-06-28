# PetCare 24/7 — Strategy Refinements (v1.1)

> Source: `04-competitive-landscape.md`. These are **binding amendments** to the PRD
> (`01-requirements.md`), project plan (`02`), and sprint plan (`03`). Where this doc
> conflicts with v1, **this doc wins.** Owner: Lead. Status: adopted 2026-06-28.

## Updated positioning statement (replaces the PRD vision line)

> **For worried pet owners at any hour — especially 3am — PetCare 24/7 is the only app that
> instantly connects you to a real, currently-online, qualified vet to answer "is this an
> emergency, or can it wait?" — free for your first question, a dollar or two after. Because
> our vets span time zones, someone trusted is always awake; because we triage instead of
> prescribe, we work across the US, Canada and India; and because the best vets earn the most,
> you're always talking to someone the community trusts.**

## Refinement 1 — Instant-match first; kill "browse & book" (amends E3, E4)
The v1 anchor is **one tap → matched to an online vet in seconds → first answer free.** No vet
browsing, no scheduling, no subscription wall at the moment of panic (that is Vetster/Dutch's
mistake at 3am). Scheduled/telehealth booking (E13) stays, but is **secondary** and must never sit
on the critical 3am path.
- **Requirement changes:** the matching + time-zone routing layer (E4) is the **v1 core**, built in
  Sprint 0/2, not deferred. The "Ask a Vet Now" → AI pre-screen → instant match → free first
  question → $1–5 capture is the single most-instrumented flow.
- **Acceptance:** from Home, an owner reaches a matched online vet with **zero scheduling/browse
  screens**; median time-to-first-vet < 3 min (ties to G2).

## Refinement 2 — Reputation flywheel is the moat, instrument from day 1 (amends E5, E6)
Every competitor treats vets as anonymous/interchangeable. Our defensibility is **named vets whose
earnings & visibility are driven by quality.**
- **Requirement changes:** from the **first consult**, capture per-vet: response time, triage
  accuracy/outcome, follow-up rate, repeat-bookings, peer endorsements. Vet earnings + match
  priority are a function of this score. Named vet profiles + a quality ladder/badging ship in the
  **MVP-core sprints, not v2.**
- **Acceptance:** every completed consult writes reputation signals; vet match ordering uses the
  reputation score; owners can see a vet's stats and **re-request** them (existing E5-US "re-request").

## Refinement 3 — Breadth is capital-light: directory/referral, NOT own-the-supply (amends E7, E14, E16, E17)
Fuzzy ($15/mo, full prescribing + clinics) **shut down in 2023** on bad unit economics. We do not
build a Rover-style supply marketplace or Fuzzy-style clinics.
- **Requirement changes:** Services (groomers/walkers/sitters — E14), ER finder (E10), and pharmacy
  are **directory + referral/partner integrations** (e.g. ER → Vetic clinics, pharmacy → Supertails),
  not owned supply or in-app payments-to-providers at MVP. Community + lost-found (E16/E17) ship
  **free** as the acquisition/retention layer; revenue = triage + premium health records.
- **One pet identity (new cross-cutting requirement):** all lanes write to a single pet record so the
  loop closes — *a sitter flags limping → triage chat → vet says "watch 24h" → reminder → logged in
  the health record.* This closed loop is the super-app promise no competitor can make.

## Competitive guardrails (for the team)
- **Win the 12am–6am window first** — it is structurally unserved (Chewy stops at midnight, India
  players at 7pm). It is the wedge; do not dilute it.
- **Chewy is the #1 threat** (scale + Modern Animal 24/7 over FY26–27). Refer into their commerce;
  compete on cross-border + named-vet trust + micro-price, which they can't bundle.
- **India:** partner downstream with Supertails/Vetic; own the 3am triage they don't serve.
- **Do not out-Rover Rover** or rebuild Pawp's emergency fund at v1 (partner with insurers later).
