# Supabase Migration Plan

## Objective

Migrate from self-hosted PostgreSQL + NestJS backend to Supabase as the primary backend, keeping Cloudflare R2 for file storage and Cloudflare Pages for frontend hosting. Goal: **$0/month operating cost** for up to 5,000 users.

---

## Architecture Comparison

### Current (Self-Hosted)
```
Next.js → NestJS (VPS) → Docker PostgreSQL
                    └→ Cloudflare R2
```

### Target (Serverless)
```
Cloudflare Pages → Supabase (PostgreSQL + Auth + REST API)
               └→ Cloudflare R2 (Storage)
               └→ Supabase Edge Functions (Complex Logic)
```

---

## Component Migration Map

| Component | Current | Target | Action |
|-----------|---------|--------|--------|
| Database | Docker PostgreSQL | Supabase PostgreSQL | Export/import schema + data |
| Auth | Custom JWT + bcrypt | Supabase Auth | Replace auth module |
| REST API | NestJS (39 endpoints) | Supabase Auto-API | Drop 30+ endpoints |
| File Storage | NestJS proxy → R2 | R2 direct upload | Simplify upload flow |
| Search | Prisma queries | Supabase `select()` | Direct queries |
| Validation | class-validator | Supabase RLS + constraint | Policies |
| RBAC | JWT roles guard | Supabase RLS policies | Table-level policies |
| Audit Logs | Prisma service | Supabase triggers | Auto-logging |
| Reports | NestJS aggregate queries | Edge Functions | Serverless compute |
| Import/Export | NestJS CSV service | Edge Functions | Serverless compute |
| Tests | Jest unit tests | Jest + Supabase local | Local dev preserved |
| E2E | Playwright | Playwright | No change |

---

## What Gets Eliminated

### Dropped Entirely
- `backend/` NestJS application (~20,000 lines)
- `docker-compose.yml` PostgreSQL container
- `backend/src/auth/` custom JWT + bcrypt
- `backend/src/prisma/` PrismaService
- `backend/.env` database credentials
- 39 API endpoints → Supabase auto-generates them

### Kept / Modified
- `frontend/` Next.js app — replaces `api.ts` with Supabase SDK
- `docs/` — updated architecture
- `shared/` — shared types (simplified)
- Cloudflare R2 — frontend direct uploads

---

## Phase 17 - Supabase Migration Tasks

### 17.1: Supabase Project Setup
- Create Supabase project
- Export current Prisma schema to SQL
- Push schema to Supabase
- Enable Supabase Auth (email/password)
- Configure RLS policies for all tables
- Set up Supabase Storage (or keep R2)

### 17.2: Frontend Migration
- Install `@supabase/supabase-js`
- Replace `api.ts` with Supabase client
- Replace Zustand auth store with Supabase Auth
- Replace login/register forms
- Test all 21 frontend pages
- Update environment variables

### 17.3: Custom Logic Migration
- Move relationship validation → Edge Function
- Move CSV export → Edge Function
- Move CSV import → Edge Function
- Move dashboard reports → Direct Supabase queries
- Move audit logging → Database triggers

### 17.4: Security & RLS
- Create RLS policies per table
- Map roles to RLS policies
- Public tables: announcements, events, businesses, jobs, obituaries
- Authenticated: members, families (by community)
- Admin: full access with RLS policies

### 17.5: Testing & Cleanup
- Run all unit tests against Supabase local
- Run E2E tests with Supabase
- Remove NestJS backend from monorepo
- Remove Docker Compose
- Update all documentation

### Acceptance Criteria
- Frontend runs entirely against Supabase
- Zero backend servers running
- All 21 pages functional
- Auth works end-to-end
- R2 uploads remain functional
- 53 unit tests pass (adapted for Supabase)
- 21 E2E tests pass

---

## Cost Analysis

| Service | Free Limit | Our Usage | Monthly Cost |
|---------|-----------|-----------|-------------|
| Supabase DB | 500 MB | ~5 MB | $0 |
| Supabase Auth | 50,000 MAU | 412 users | $0 |
| Supabase API | 2 GB bandwidth | Minimal | $0 |
| Cloudflare Pages | Unlimited | - | $0 |
| Cloudflare R2 | 10 GB storage | < 100 MB | $0 |
| **Total** | | | **$0/month** |

When > 5,000 users: Upgrade Supabase Pro ($25/month for 8 GB DB, 50 GB bandwidth).

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Supabase downtime | 99.9% SLA; keep NestJS code for failover |
| RLS complexity | Start with permissive, tighten incrementally |
| Vendor lock-in | PostgreSQL standard; portable to any Postgres host |
| Edge Function cold start | Keep functions small; < 1s target |

---

## Timeline

| Phase | Duration | Prerequisites |
|-------|----------|--------------|
| 17.1 Setup | 1 session | Supabase account |
| 17.2 Frontend | 1 session | 17.1 complete |
| 17.3 Custom Logic | 1 session | 17.2 complete |
| 17.4 Security | 1 session | 17.3 complete |
| 17.5 Testing | 1 session | 17.4 complete |

**Total: ~5 sessions** to full migration.

---

## Next Steps

1. Create Supabase project
2. Push current schema
3. Swap frontend SDK
4. Test with 400 users / 12 admins
5. Decommission NestJS backend
