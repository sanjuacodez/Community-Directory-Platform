# TASKS.md

# Community Directory Platform

## Project Status

Current Phase: Phase 2

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

* [ ] Create MemberRelationship model

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

* [ ] Create relationship API
* [ ] Update relationship API
* [ ] Delete relationship API
* [ ] Get member relationships API

### Acceptance Criteria

* Relationship records can be managed

---

## Relationship Validation

* [ ] Prevent duplicate relationships
* [ ] Prevent circular references
* [ ] Validate spouse uniqueness

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

* [ ] Implement member search API
* [ ] Implement profession filter
* [ ] Implement blood group filter
* [ ] Implement family filter
* [ ] Implement location filter

### Acceptance Criteria

* Search returns filtered results

---

## Frontend

* [ ] Directory page
* [ ] Search bar
* [ ] Filter sidebar

### Acceptance Criteria

* Directory usable by community members

---

# Phase 8 - Announcements

## Backend

* [ ] Create Announcement model
* [ ] Create announcement CRUD APIs
* [ ] Add image support

### Acceptance Criteria

* Announcements manageable

---

## Frontend

* [ ] Announcement list page
* [ ] Announcement details page
* [ ] Admin management page

### Acceptance Criteria

* Announcements visible publicly

---

# Phase 9 - Events

## Backend

* [ ] Create Event model
* [ ] Create event CRUD APIs

### Acceptance Criteria

* Events manageable

---

## Frontend

* [ ] Event list page
* [ ] Event details page
* [ ] Admin event management page

### Acceptance Criteria

* Events displayed publicly

---

# Phase 10 - Business Directory

## Backend

* [ ] Create Business model
* [ ] Create business CRUD APIs

### Acceptance Criteria

* Businesses manageable

---

## Frontend

* [ ] Business listing page
* [ ] Business details page
* [ ] Admin business management page

### Acceptance Criteria

* Business directory operational

---

# Phase 11 - Job Board

## Backend

* [ ] Create Job model
* [ ] Create job CRUD APIs

### Acceptance Criteria

* Jobs manageable

---

## Frontend

* [ ] Job listing page
* [ ] Job details page
* [ ] Admin job management page

### Acceptance Criteria

* Job board operational

---

# Phase 12 - Obituary Module

## Backend

* [ ] Create Obituary model
* [ ] Create obituary CRUD APIs

### Acceptance Criteria

* Obituaries manageable

---

## Frontend

* [ ] Obituary listing page
* [ ] Obituary details page
* [ ] Admin obituary management page

### Acceptance Criteria

* Obituary section operational

---

# Phase 13 - Reports & Dashboard

## Backend

* [ ] Member count statistics
* [ ] Family count statistics
* [ ] Blood group statistics
* [ ] Profession statistics

### Acceptance Criteria

* Dashboard APIs available

---

## Frontend

* [ ] Admin dashboard
* [ ] Statistics widgets
* [ ] Summary cards

### Acceptance Criteria

* Dashboard operational

---

# Phase 14 - Audit Logs

## Backend

* [ ] Create AuditLog model
* [ ] Log create actions
* [ ] Log update actions
* [ ] Log delete actions

### Acceptance Criteria

* All important actions logged

---

# Phase 15 - Import & Export

## Backend

* [ ] CSV export
* [ ] Excel export
* [ ] Member import

### Acceptance Criteria

* Bulk import/export functional

---

# Phase 16 - Production Readiness

## Security

* [ ] API rate limiting
* [ ] Input validation
* [ ] Security headers

---

## Performance

* [ ] Pagination
* [ ] Database indexes
* [ ] Query optimization

---

## Testing

* [ ] Unit tests
* [ ] Integration tests
* [ ] Manual QA

### Acceptance Criteria

* Production deployment ready

---

# Future Tasks (Out of Scope)

* [ ] Graphical Family Tree
* [ ] Notifications
* [ ] Mobile Application
* [ ] Multi-language Support
* [ ] Multi-community SaaS Dashboard
