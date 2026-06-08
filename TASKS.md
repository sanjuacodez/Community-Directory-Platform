# TASKS.md

# Community Directory Platform

## Project Status

Current Phase: Phase 17

---

# Phase 0 - Project Foundation

## Repository Setup

* [x] Create monorepo structure
* [x] Create frontend application (Next.js 15)
* [x] Create backend application (NestJS)
* [x] Configure TypeScript
* [x] Configure ESLint
* [x] Configure Prettier
* [x] Configure environment variables
* [x] Create shared constants folder

### Acceptance Criteria

* Frontend starts successfully
* Backend starts successfully
* Environment variables load correctly

---

## Database Setup

* [x] Install Prisma
* [x] Configure PostgreSQL connection
* [x] Create initial Prisma schema
* [x] Setup migrations
* [x] Setup seed mechanism

### Acceptance Criteria

* Database connection works
* Migration executes successfully
* Seed command works

---

# Phase 1 - Authentication & RBAC

## User Management

* [x] Create User model
* [x] Create Role model
* [x] Create UserRole relationship

### Acceptance Criteria

* Users can be created
* Roles can be assigned

---

## Authentication

* [x] Implement login endpoint
* [ ] Implement logout endpoint
* [x] Implement JWT generation
* [x] Implement refresh tokens
* [x] Implement password hashing

### Acceptance Criteria

* Login returns JWT
* Protected endpoints require authentication

---

## Authorization

* [x] Create RBAC guards
* [x] Create Super Admin role
* [x] Create Family Admin role

### Acceptance Criteria

* Unauthorized access is blocked

---

# Phase 2 - Community Module

## Community Entity

* [x] Create Community model
* [x] Create Community CRUD APIs
* [x] Create Community validation

### Acceptance Criteria

* Community CRUD works

---

# Phase 3 - Family Module

## Database

* [x] Create Family model
* [x] Add Community relationship
* [x] Add Family Admin relationship

### Acceptance Criteria

* Families belong to communities

---

## APIs

* [x] Create family create API
* [x] Create family update API
* [x] Create family list API
* [x] Create family detail API
* [x] Create family archive API

### Acceptance Criteria

* Family CRUD fully functional

---

## Frontend

* [x] Family list page
* [x] Family create page
* [x] Family edit page

### Acceptance Criteria

* Family management works from UI

---

# Phase 4 - Member Module

## Database

* [x] Create Member model
* [x] Add Family relationship
* [x] Add Community relationship

### Fields

* First Name
* Last Name
* Gender
* DOB
* Blood Group
* Email
* Phone
* Profession
* Organization
* Education
* Location
* Profile Image
* Visibility

---

## APIs

* [x] Create member API
* [x] Update member API
* [x] Get member API
* [x] List members API
* [x] Archive member API

### Acceptance Criteria

* Full member CRUD works

---

## Frontend

* [x] Member list page
* [x] Member profile page
* [x] Member create form
* [x] Member edit form

### Acceptance Criteria

* Members manageable through UI

---

# Phase 5 - Media Upload

## Storage

* [x] Configure Cloudflare R2
* [x] Create upload service
* [x] Create image upload API

### Acceptance Criteria

* Profile image upload works

---

# Phase 6 - Relationship Engine

## Database

* [x] Create MemberRelationship model

Fields:

* member_id
* related_member_id
* relationship_type

Relationship Types:

* father
* mother
* spouse
* child

---

## APIs

* [x] Create relationship API
* [x] Update relationship API
* [x] Delete relationship API
* [x] Get member relationships API

### Acceptance Criteria

* Relationship records can be managed

---

## Relationship Validation

* [x] Prevent duplicate relationships
* [x] Prevent circular references
* [x] Validate spouse uniqueness

### Acceptance Criteria

* Invalid relationships rejected

---

## Frontend

* [ ] Relationship management UI
* [ ] Member selector search component
* [ ] Relationship display component

### Acceptance Criteria

* Family relationships manageable from UI

---

# Phase 7 - Search & Directory

## Backend

* [x] Implement member search API
* [x] Implement profession filter
* [x] Implement blood group filter
* [x] Implement family filter
* [x] Implement location filter

### Acceptance Criteria

* Search returns filtered results

---

## Frontend

* [x] Directory page
* [x] Search bar
* [x] Filter sidebar

### Acceptance Criteria

* Directory usable by community members

---

# Phase 8 - Announcements

## Backend

* [x] Create Announcement model
* [x] Create announcement CRUD APIs
* [x] Add image support

### Acceptance Criteria

* Announcements manageable

---

## Frontend

* [x] Announcement list page
* [x] Announcement details page
* [x] Admin management page

### Acceptance Criteria

* Announcements visible publicly

---

# Phase 9 - Events

## Backend

* [x] Create Event model
* [x] Create event CRUD APIs

### Acceptance Criteria

* Events manageable

---

## Frontend

* [x] Event list page
* [x] Event details page
* [x] Admin event management page

### Acceptance Criteria

* Events displayed publicly

---

# Phase 10 - Business Directory

## Backend

* [x] Create Business model
* [x] Create business CRUD APIs

### Acceptance Criteria

* Businesses manageable

---

## Frontend

* [x] Business listing page
* [x] Business details page
* [x] Admin business management page

### Acceptance Criteria

* Business directory operational

---

# Phase 11 - Job Board

## Backend

* [x] Create Job model
* [x] Create job CRUD APIs

### Acceptance Criteria

* Jobs manageable

---

## Frontend

* [x] Job listing page
* [x] Job details page
* [x] Admin job management page

### Acceptance Criteria

* Job board operational

---

# Phase 12 - Obituary Module

## Backend

* [x] Create Obituary model
* [x] Create obituary CRUD APIs

### Acceptance Criteria

* Obituaries manageable

---

## Frontend

* [x] Obituary listing page
* [x] Obituary details page
* [x] Admin obituary management page

### Acceptance Criteria

* Obituary section operational

---

# Phase 13 - Reports & Dashboard

## Backend

* [x] Member count statistics
* [x] Family count statistics
* [x] Blood group statistics
* [x] Profession statistics

### Acceptance Criteria

* Dashboard APIs available

---

## Frontend

* [x] Admin dashboard
* [x] Statistics widgets
* [x] Summary cards

### Acceptance Criteria

* Dashboard operational

---

# Phase 14 - Audit Logs

## Backend

* [x] Create AuditLog model
* [x] Log create actions
* [x] Log update actions
* [x] Log delete actions

### Acceptance Criteria

* All important actions logged

---

# Phase 15 - Import & Export

## Backend

* [x] CSV export
* [ ] Excel export
* [x] Member import

### Acceptance Criteria

* Bulk import/export functional

---

# Phase 16 - Production Readiness

## Security

* [x] API rate limiting
* [x] Input validation
* [x] Security headers

---

## Performance

* [x] Pagination
* [x] Database indexes
* [x] Query optimization

---

## Testing

* [x] Unit tests
* [x] Integration tests
* [x] Manual QA

### Acceptance Criteria

* Production deployment ready

---

# Phase 17 - Supabase Migration

## Supabase Project Setup

* [x] Create Supabase project (Free Tier)
* [x] Export current Prisma schema → PostgreSQL SQL
* [x] Push schema to Supabase
* [x] Enable Supabase Auth (email/password provider)
* [x] Configure environment variables for Supabase

### Acceptance Criteria

* Supabase project accessible via API
* All 14 tables created in Supabase
* Email/password auth enabled

---

## Frontend Migration

* [x] Install @supabase/supabase-js in frontend
* [x] Create Supabase client module (src/lib/supabase.ts)
* [x] Replace api.ts fetch calls with Supabase SDK queries
* [x] Replace Zustand auth store with Supabase Auth methods
* [x] Update login/register forms to use Supabase Auth
* [x] Update member search/filters to use Supabase queries
* [x] Update all 21 pages for Supabase compatibility
* [x] Update environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Acceptance Criteria

* All 21 frontend pages load against Supabase
* Login/register works with Supabase Auth
* CRUD operations work without NestJS
* Zero backend servers running

---

## Custom Logic Migration

* [ ] Move relationship validation → Supabase Edge Function
* [ ] Move CSV member export → Supabase Edge Function
* [ ] Move CSV family export → Supabase Edge Function
* [ ] Move CSV member import → Supabase Edge Function
* [ ] Move dashboard reports → Direct Supabase queries
* [ ] Move audit logging → Supabase database triggers
* [ ] Keep Cloudflare R2 for file storage (direct upload from frontend)

### Acceptance Criteria

* Relationship validation works (duplicate, circular, spouse uniqueness)
* CSV export/import functional
* Dashboard stats load from Supabase
* R2 uploads continue to work

---

## Security & RLS

* [ ] Public tables RLS: announcements, events, businesses, jobs, obituaries
* [ ] Authenticated RLS: members, families read by community
* [ ] Admin RLS: super_admin full access
* [ ] Profile image upload RLS: owner-only write
* [ ] Test RLS policies with different roles

### Acceptance Criteria

* Unauthenticated users can only see public tables
* Members can only see their community data
* Admins have full CRUD access

---

## Testing & Cleanup

* [ ] Run all 53 unit tests against Supabase (adapt as needed)
* [ ] Run all 21 E2E tests with Supabase backend
* [ ] Typecheck passes across all workspaces
* [ ] Remove NestJS backend from monorepo (optional, can archive)
* [ ] Remove docker-compose.yml (optional, keep as fallback)
* [ ] Update README with new Supabase setup instructions
* [ ] Update all docs/ files for new architecture

### Acceptance Criteria

* All tests pass against Supabase
* Zero infrastructure cost ($0/month)
* 412 users (400 members + 12 admins) supported on free tier

---

# Future Tasks (Out of Scope)

* [ ] Graphical Family Tree
* [ ] Notifications
* [ ] Mobile Application
* [ ] Multi-language Support
* [ ] Multi-community SaaS Dashboard
* [ ] Supabase Realtime subscriptions (live updates)
* [ ] Supabase Storage migration from R2
* [ ] OAuth providers (Google, Facebook login)
* [ ] Database backups to external provider
