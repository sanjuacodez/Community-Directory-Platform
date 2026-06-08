# PROJECT_STATUS.md

## Current Phase

Phase 2 - Community Module (Complete)

## Completed Tasks

### Phase 0 - Project Foundation

Completed: 2026-06-08

* Monorepo structure (npm workspaces: frontend, backend, shared)
* Frontend app scaffolded (Next.js 16, TypeScript, TailwindCSS 4, ESLint)
* Backend app scaffolded (NestJS 11, TypeScript, ESLint, Prettier)
* PostgreSQL 16 via Docker Compose
* Prisma 6 ORM with full schema (14 tables)
* Initial migration + seed (super_admin, family_admin, member roles)
* PrismaModule and PrismaService for NestJS

### Phase 1 - Authentication & RBAC

Completed: 2026-06-08

* `POST /api/auth/register` — creates user, returns JWT + refresh token
* `POST /api/auth/login` — validates credentials, returns JWT + refresh token
* `POST /api/auth/refresh` — exchanges refresh token for new pair
* bcrypt password hashing (12 rounds)
* JWT access tokens (15min) + refresh tokens (7d)
* Role priority system (super_admin > family_admin > member)
* JwtAuthGuard (Passport-based bearer token)
* RolesGuard with `@Roles()` decorator
* Input validation via class-validator (DTOs)
* Global ValidationPipe with whitelist + transform

### Phase 2 - Community Module

Completed: 2026-06-08

* `POST /api/communities` — create community (super_admin only)
* `GET /api/communities` — list all non-deleted communities (super_admin, family_admin)
* `GET /api/communities/:id` — get community with family/member counts
* `PATCH /api/communities/:id` — update community (super_admin only)
* `DELETE /api/communities/:id` — soft delete community (super_admin only)
* Duplicate slug detection (409 Conflict)
* DTO validation (name, slug required, string length limits)

---

## API Status

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/auth/register` | POST | Public | Done |
| `/api/auth/login` | POST | Public | Done |
| `/api/auth/refresh` | POST | Public | Done |
| `/api/communities` | POST | super_admin | Done |
| `/api/communities` | GET | super_admin, family_admin | Done |
| `/api/communities/:id` | GET | super_admin, family_admin | Done |
| `/api/communities/:id` | PATCH | super_admin | Done |
| `/api/communities/:id` | DELETE | super_admin | Done |

---

## Database Status

Current Tables (14): users, roles, user_roles, communities, families, members, member_relationships, announcements, events, businesses, jobs, obituaries, audit_logs

Seed Data: super_admin, family_admin, member roles

---

## Frontend Status

Implemented: Scaffolded Next.js app (home page only)

---

## Known Issues

None

---

## Next Recommended Task

Phase 3 - Family Module: Create Family CRUD APIs
