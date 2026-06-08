# Technical Architecture

## Target Stack (Phase 17 Migration)

### Frontend

Framework: Next.js 16

Language: TypeScript

UI:
* TailwindCSS 4

State Management:
* Zustand (auth state)

API Client:
* Supabase SDK (`@supabase/supabase-js`)

Hosting:
* Cloudflare Pages

### Backend (Serverless)

Database:
* Supabase PostgreSQL (Free Tier — 500 MB)

Authentication:
* Supabase Auth (email/password, JWT)

API:
* Supabase Auto-Generated REST API
* Supabase Edge Functions (custom logic)

Authorization:
* Supabase Row-Level Security (RLS) policies

### File Storage

Cloudflare R2 (10 GB free)

### Legacy (To Be Deprecated)

* NestJS 11 backend
* Docker PostgreSQL
* Custom JWT + bcrypt auth
* Prisma 6 ORM (schema preserved for reference)

---

## Deployment

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Cloudflare Pages | Free |
| Database | Supabase | Free |
| Auth | Supabase Auth | Free |
| Storage | Cloudflare R2 | Free |
| Custom Logic | Supabase Edge Functions | 2M/month free |
| **Total Monthly** | | **$0** |

---

## Design Principles

* Mobile Responsive
* API First (Supabase REST)
* Multi Community Ready
* Modular Architecture
* Role Based Access Control
* Serverless First
* Zero Infrastructure
