# opencode work order #2 — Marketing Website (PetCare 24/7)

> **Coordination:** Claude Code (lead) owns the apps + prototype + shared + docs. You (opencode)
> already own `packages/api` (backend). This is your **second lane: the marketing website.**
> We run in parallel — **do not overlap.**

## HARD BOUNDARY — where you may write
✅ Create the marketing site **only under `apps/site/`** (a new folder you create).
✅ You may continue to maintain `packages/api/`.
🚫 Do **NOT** touch: `apps/web`, `packages/mobile`, `packages/ui`, `packages/shared`, `prototype/`,
   `docs/`, or root config files. Those are the lead's lanes.

## What to build
A fast, SEO-friendly **marketing website** for PetCare 24/7 (this is a site to *sell* the app and
recruit vets — NOT the app itself). Self-contained in `apps/site`.

**Recommended stack:** Vite + React + TypeScript (simple, static-deployable to Vercel/Cloudflare).
A static export is fine. Keep it self-contained; no backend calls needed (a waitlist form can POST
to a stubbed endpoint or just show a success state).

**Pages / sections (single landing page is fine, multi-section):**
1. **Hero** — the 3am promise: "Is it an emergency, or can it wait? A qualified vet, any hour." + a
   primary CTA ("Get the app" / "Join the waitlist") and an "X vets online now" trust line.
2. **How it works** — 3 steps: describe → matched to an online vet in seconds → urgency answer + guidance.
3. **Why us / super-app** — vet triage + records + reminders + services (groomers/walkers/boarding) +
   supplies + community. Emphasize: triage & guidance, **never diagnosis/prescriptions**.
4. **24/7 via time zones** — the global vet network story (someone trusted is always awake).
5. **Pricing** — first question free, then ~$1–5. No subscription required.
6. **For vets** — recruitment section: "Earn from home, on your schedule" + a "Become a vet" CTA
   (this is critical — vet supply is the #1 business risk).
7. **Trust & safety** — licensed vets, credential-verified, encrypted records, clear disclaimers.
8. **Waitlist / email capture** + footer (markets: US, Canada, India; legal links placeholder).

**Brand (match the app exactly):**
- Colors: Sage Teal `#3AAFA9` (primary), Warm Amber `#F59E0B` (accent, sparingly), Cream `#FAFAF7`
  (background), Charcoal `#1F2937` (text), Coral `#F87171` (urgency), Leaf Green `#22C55E`.
- Fonts (Google Fonts): **Fraunces** for headings, **Inter** for body.
- Light, warm, calm, trustworthy. Rounded cards (radius ~20px), generous spacing. NOT dark.
- Signature mark: a "Paw Pulse" — a paw print whose center pad is a heartbeat/ECG line (recreate as inline SVG).
- Accessible (WCAG AA), responsive (looks great on mobile + desktop).

## Rules
- Commit with `feat(site): …` messages scoped to `apps/site` (never commit other lanes' files).
- Add a one-line status to `apps/site/PROGRESS.md` after each milestone.
- Make it runnable: a `dev` script and a `build` script in `apps/site/package.json`. Note the dev port
  in PROGRESS.md so the lead can preview it.
