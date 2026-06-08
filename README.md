# Community Directory Platform

A web-based community directory platform for managing families, members, relationships, announcements, events, businesses, jobs, and obituary records. Designed as a reusable SaaS-ready platform.

Built by **[Sanjay Shankar M](https://sanjayshankar.me)**

[![GitHub](https://img.shields.io/badge/GitHub-sanjuacodez-black?logo=github)](https://github.com/sanjuacodez)
[![Website](https://img.shields.io/badge/Website-sanjayshankar.me-blue)](https://sanjayshankar.me)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)

---

## Architecture

```
Cloudflare Pages (Frontend) ─── Supabase (DB + Auth + API)
                             └── Cloudflare R2 (File Storage)
```

**$0/month** operating cost for up to 5,000 users on free tiers.

---

## Quick Start (With Supabase)

### Prerequisites
- Node.js 18+
- npm
- Git

### Setup

```bash
# 1. Clone
git clone https://github.com/sanjuacodez/Community-Directory-Platform.git
cd Community-Directory-Platform

# 2. Install dependencies
npm install

# 3. Create a Supabase project at https://supabase.com
#    - Go to SQL Editor → paste backend/prisma/schema.sql
#    - Enable Email/Password auth in Authentication → Providers
#    - Go to Storage → create 'profiles' bucket (public)

# 4. Configure environment
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > frontend/.env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> frontend/.env.local
echo "NEXT_PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.dev" >> frontend/.env.local

# 5. Seed roles (in Supabase SQL Editor)
# INSERT INTO roles (name) VALUES ('super_admin'), ('family_admin'), ('member');

# 6. Start frontend
cd frontend && npm run dev
```

The app runs at **http://localhost:3000**. No backend server needed.

---

## Quick Start (Legacy - With Docker + NestJS)

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Start backend
cd backend && cp .env.example .env && npx prisma migrate dev && npm run start:dev

# 3. Start frontend
cd frontend && npm run dev
```

Backend: http://localhost:3001 | Frontend: http://localhost:3000

---

## Features

### For End Users
- Member Directory with search (name, profession, blood group, location)
- Member Profiles with relationships, family info
- Family Directory with community filter
- Public Announcements, Events, Businesses, Jobs, Obituaries

### For Administrators
- Dashboard with real-time stats
- Family + Member CRUD management
- Relationship Engine (father, mother, spouse, child)
- Content Management (announcements, events, businesses, jobs)
- CSV Import/Export
- Audit Logs

### Security
- Supabase Auth (JWT, email/password)
- Row-Level Security (RLS) on all tables
- Helmet headers via Cloudflare
- CORS configured

---

## Testing

```bash
# Unit Tests (53 tests, 11 suites)
cd backend && npm test

# E2E Tests (21 tests, 3 suites)
cd frontend && npm run test:e2e

# Type Checking
npm run typecheck
```

---

## Project Structure

```
├── frontend/           # Next.js 16 (21 pages)
│   ├── e2e/            # Playwright E2E tests
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── lib/        # Supabase client, utilities
│   │   └── stores/     # Zustand auth wrapper
│   └── playwright.config.ts
├── backend/            # NestJS 11 (to be deprecated)
│   ├── prisma/         # Schema (source of truth)
│   └── src/            # 13 modules (39 endpoints)
├── shared/             # Shared TypeScript types
├── docs/               # Documentation
│   ├── supabase-migration-plan.md  # Migration guide
│   ├── architecture.md
│   ├── database-schema.md
│   └── ...
└── docker-compose.yml  # PostgreSQL (legacy)
```

---

## Documentation
- [Supabase Migration Plan](docs/supabase-migration-plan.md)
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [Backend Specification](docs/backend-specification.md)
- [Frontend Specification](docs/frontend-specification.md)
- [Project Overview](docs/project-overview.md)

---

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanjayshankar-yellow?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)
