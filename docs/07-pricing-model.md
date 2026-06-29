# PetCare 24/7 — Pricing Model (v1, adopted 2026-06-29)

> Amends the pricing in `01-requirements.md` / `03-sprint-plan.md`. Decision: **hybrid + regional.**
> Rationale anchored to `04-competitive-landscape.md` (online consults: Airvet $30, Chewy $19.99,
> Vetster $35–70, Pawp $99/yr; India Conbun/Supertails ₹199–299 ≈ $2.40–3.60).

## Principle
- **Triage (the 3am anchor) = FLAT, never per-minute.** A ticking meter on a frightened owner fights
  our calm, low-stress brand. Price must be predictable at the worst moment.
- **Scheduled telehealth (non-urgent video) = per-minute or duration tiers.** A real appointment;
  per-minute aligns vet pay to effort and is great for vet recruitment.
- **Regional pricing** — undercut every competitor everywhere, but capture US/CA willingness-to-pay.

## Triage pricing (first question always FREE, then flat per question)
| Region | First | Then per question |
|---|---|---|
| 🇮🇳 India | Free | **₹149** (~$1.79) |
| 🇺🇸🇨🇦 US / Canada | Free | **Quick text $4.99 · Standard consult $7.99** |
Marketing headline: **"First question free, then from $1.99."** (Still ~1/10th of a US clinic visit.)

## Telehealth (scheduled video / longer consults)
- **Per-minute:** US/CA **$0.99/min**, India **₹19/min** — OR pick a bundle:
  **15-min $12.99 · 30-min $24.99** (US/CA) / **₹249 / ₹449** (India).
- Shown with a live, visible timer + an upfront estimate so there are no surprises.

## Vet economics & margin (important)
- **Vets keep 75–80%** of each consult (generous → helps the #1 risk: vet supply). Weekly/bi-weekly
  payouts (Stripe Connect US/CA, Wise India).
- **Watch the floor:** on a $1.99–3 charge, Stripe (~$0.30 + 2.9%) eats most of the platform's 20–25%.
  Mitigations: (a) a small fixed **service fee** baked into the price to cover processing; (b) lean on
  the India-vet cost base + volume; (c) US/CA tiers ($4.99–7.99) carry the margin, India is near-breakeven
  acquisition. Net: triage is roughly margin-neutral; **money is made on US/CA + telehealth + scale.**

## What changes where
- **Website (`apps/site`, opencode):** update the Pricing section copy to this model.
- **App (prototype + future, lead):** pricing tiers config; per-minute timer in telehealth (deferred —
  founder picked "lock the model + site update" now; app per-minute build is the next step when ready).
