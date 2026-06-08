# PROJECT_STATUS.md

## Current Phase

Phase 3 - Family Module (Complete)

## Completed Tasks

### Phase 0 - Project Foundation

* Monorepo structure (npm workspaces: frontend, backend, shared)
* Frontend: Next.js 16, TypeScript, TailwindCSS 4, ESLint
* Backend: NestJS 11, TypeScript, ESLint, Prettier
* PostgreSQL 16 via Docker Compose
* Prisma 6 ORM with full schema (14 tables)
* Initial migration + seed (super_admin, family_admin, member roles)

### Phase 1 - Authentication & RBAC

* Register, login, refresh token endpoints
* bcrypt password hashing (12 rounds)
* JWT access (15min) + refresh (7d) tokens
* Role priority: super_admin > family_admin > member
* JwtAuthGuard + RolesGuard with @Roles() decorator

### Phase 2 - Community Module

* Full CRUD for communities (super_admin only)
* List/Get accessible by family_admin
* Soft delete, slug uniqueness validation

### Phase 3 - Family Module

* `POST /api/families` — create family with community link
* `GET /api/families` — list families (filterable by communityId)
* `GET /api/families/:id` — detail with members list and count
* `PATCH /api/families/:id` — update family fields
* `DELETE /api/families/:id` — soft archive (status: deleted)
* Access: super_admin, family_admin
* Frontend: Family list page with community filter, create/edit forms with validation

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
| `/api/families` | POST | super_admin, family_admin | Done |
| `/api/families` | GET | super_admin, family_admin | Done |
| `/api/families/:id` | GET | super_admin, family_admin | Done |
| `/api/families/:id` | PATCH | super_admin, family_admin | Done |
| `/api/families/:id` | DELETE | super_admin, family_admin | Done |

---

## Frontend Status

| Page | Status |
|------|--------|
| Home (`/`) | Done |
| Families List (`/families`) | Done |
| Create Family (`/families/create`) | Done |
| Edit Family (`/families/[id]/edit`) | Done |

State Management: Zustand (auth store)
API Client: Custom fetch wrapper with auth token support

---

## Database Status

14 tables, seed data for 3 roles

---

## Known Issues

None

---

## Next Recommended Task

Phase 4 - Member Module: Create Member CRUD APIs + Frontend
