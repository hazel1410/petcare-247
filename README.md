# PetCare 24/7

**Global vet triage — ask a qualified vet anytime, day or night.**

A friendly app where worried pet owners can reach a qualified vet at any hour to answer: *"Is this an emergency, or can it wait?"* Plus pet health records, reminders, and local services.

## Architecture

```
petcare-247/
├── apps/
│   ├── web/              # React (Vite) — owner + vet + admin web app
│   └── admin/            # Admin dashboard (shared with web)
├── packages/
│   ├── mobile/           # React Native (Expo) — iOS + Android
│   ├── api/              # Fastify + tRPC backend
│   ├── shared/           # Zod schemas, types, constants, utilities
│   └── ui/               # Design tokens (colors, spacing, typography)
├── tooling/
│   ├── eslint/
│   └── typescript/
└── package.json          # Turborepo root
```

## Tech Stack

| Layer | Choice |
|---|---|
| **Mobile** | React Native (Expo) — iOS + Android |
| **Web** | React (Vite) |
| **Backend** | Node.js (Fastify) + tRPC |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth (email + social + phone OTP) |
| **Realtime** | Supabase Realtime (WebSockets) |
| **Payments** | Stripe Connect Express |
| **Hosting** | Railway (API) + Vercel (web) + EAS (mobile) |

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Supabase project (free tier works)
- Stripe account (test mode)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase and Stripe keys

# Push database schema to Supabase
# Run the SQL from packages/api/src/db/schema.sql in Supabase SQL Editor
# Then run packages/api/src/db/functions.sql

# Start development
pnpm dev
```

This starts:
- **API** at http://localhost:3001
- **Web** at http://localhost:3000
- **Mobile** via Expo Go (scan QR code)

## Features

### ✅ MVP (Launched)
- [x] **Triage chat** — AI pre-screen + route to online vet
- [x] **Pet health profiles** — dogs & cats, breed, age, weight, allergies, meds
- [x] **Vet matching** — route questions to online qualified vets
- [x] **Free first question** — then pay-per-question (Stripe)
- [x] **Vet reputation** — ratings, reviews, questions answered stats
- [x] **Vet dashboard** — earnings, ratings, question history
- [x] **Emergency vet finder** — nearby open clinics
- [x] **Symptom checker** — guided flows with urgency rating
- [x] **Poison/food lookup** — searchable toxic food database
- [x] **Feature flag system** — toggle features on/off
- [x] **Admin dashboard** — vet approvals, metrics, feature flags
- [x] **Disclaimers** — triage guidance, not diagnosis

### 🚧 Launch Features
- [ ] Vaccine & medical records
- [ ] Medication & feeding reminders (multi-caregiver)
- [ ] Local services finder (walkers, groomers, sitters, trainers)
- [ ] Pet-friendly places map
- [ ] Community board (lost/found + advice)
- [ ] Lost-pet QR tag support
- [ ] Telehealth (scheduled non-urgent consults)

### 🔮 Coming Soon
- Owner dating/social
- Kids' pet-care chores & education
- Creator/influencer tools
- Travel planner
- Treat subscription box
- Grief support
- AR games
- Exotic pets (beyond dogs & cats)

## Design

Light, bright, friendly, calming palette:
- **Primary**: Soft teal-green (`#4A9E8E`)
- **Secondary**: Gentle blue (`#6B9FD4`)
- **Accent**: Warm amber (`#F5A623`)
- **Background**: Warm white (`#F9F9F6`)
- **Type**: Nunito (rounded, friendly sans-serif)

## Key Decisions

- **One codebase, two roles**: A single app with owner/vet/admin experiences routed by role. Shares ~80% of UI code.
- **tRPC**: End-to-end type safety between frontend and backend. Changes to schemas are instantly caught everywhere.
- **Supabase**: Handles auth, database, realtime, and storage — reduces operational complexity for MVP.
- **Stripe Connect**: Built for marketplace payouts; handles global vet payouts and PCI compliance.

## Legal

Vet responses are framed as **triage guidance only**, not diagnosis or prescription. All responses include disclaimers. This product does not establish a VCPR (veterinary-client-patient relationship).

## License

Private — all rights reserved.
