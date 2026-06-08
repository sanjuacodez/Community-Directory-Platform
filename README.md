# Community Directory Platform

A web-based community directory platform for managing families, members, relationships, announcements, events, businesses, jobs, and obituary records. Designed as a reusable SaaS-ready platform capable of supporting multiple communities.

Built by **[Sanjay Shankar M](https://sanjayshankar.me)**

[![GitHub](https://img.shields.io/badge/GitHub-sanjuacodez-black?logo=github)](https://github.com/sanjuacodez)
[![Website](https://img.shields.io/badge/Website-sanjayshankar.me-blue)](https://sanjayshankar.me)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)

---

## Features

### For End Users (Community Members)
- **Member Directory**: Search and filter members by name, profession, blood group, location
- **Member Profiles**: View detailed profiles with family info and relationships
- **Family Directory**: Browse families within communities
- **Announcements**: Stay updated with community news
- **Events Calendar**: Upcoming community events with dates and locations
- **Business Directory**: Discover community businesses
- **Job Board**: Find and apply for jobs within the community
- **Obituaries**: Memorial records for deceased members
- **Public Access**: Announcements, events, businesses, jobs, and obituaries are publicly viewable

### For Administrators
- **Dashboard**: Real-time statistics (members, families, communities, blood groups, professions)
- **Family Management**: Create, edit, archive families; filter by community
- **Member Management**: Full CRUD with search, filters, and profile image support
- **Relationship Engine**: Map family relationships (father, mother, spouse, child) with duplicate/circular prevention
- **Content Management**: Manage announcements, events, businesses, and jobs
- **Media Upload**: Upload profile images via Cloudflare R2
- **Import/Export**: CSV export for members and families; bulk member import
- **Audit Logs**: Track all create, update, and delete actions
- **Role-Based Access**: Super Admin, Family Admin, and Member roles

### Security
- JWT authentication (access + refresh tokens)
- Role-Based Access Control (RBAC) with guards
- Helmet security headers (XSS, CSP, HSTS, X-Frame-Options)
- CORS with credential support
- Global input validation (whitelist + transform)
- bcrypt password hashing (12 rounds)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, TailwindCSS 4 |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Auth | JWT (access + refresh tokens), Passport |
| Storage | Cloudflare R2 |
| Testing | Jest, Playwright |
| Security | Helmet, bcrypt, class-validator |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop
- npm

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/sanjuacodez/Community-Directory-Platform.git
cd Community-Directory-Platform

# 2. Install all dependencies
npm install

# 3. Start PostgreSQL
docker compose up -d

# 4. Run database migrations and seed
cd backend
cp .env.example .env
npx prisma migrate dev
npx prisma db seed

# 5. Start backend (http://localhost:3001)
npm run start:dev

# 6. In another terminal, start frontend (http://localhost:3000)
cd ../frontend
npm run dev
```

### Default Admin User
After seeding, create a super admin user:
1. Register via `POST http://localhost:3001/api/auth/register` with any email/password
2. Promote to super_admin via database:
   ```sql
   INSERT INTO user_roles (id, user_id, role_id, created_at, updated_at)
   SELECT gen_random_uuid(), u.id, r.id, NOW(), NOW()
   FROM users u, roles r WHERE u.email = 'your-email' AND r.name = 'super_admin';
   ```

### Access Points

| Service | URL | Auth |
|---------|-----|------|
| Frontend | http://localhost:3000 | Public/Login |
| Backend API | http://localhost:3001/api | JWT Bearer |
| Prisma Studio | `npx prisma studio` (in backend/) | - |
| PostgreSQL | localhost:5432 | postgres/postgres |

---

## Testing

### Unit Tests
```bash
cd backend
npm test                # Run all unit tests (53 tests across 11 suites)
npm test -- --coverage  # Run with coverage report
```

### E2E Tests (Playwright)
```bash
cd frontend
npm run test:e2e        # Run all E2E tests (chromium, mobile, tablet)
npm run test:e2e:ui     # Run with Playwright UI viewer
```

E2E test coverage includes:
- Navigation & page load tests (all 10 pages)
- Responsive design (mobile, tablet, desktop)
- Accessibility (heading hierarchy, alt text, form labels, contrast)
- Auth flow (login form, validation, credentials)
- Performance (sub-3s page loads)
- Security (headers, CORS, 401 responses)

### Type Checking
```bash
npm run typecheck       # Runs tsc --noEmit across all workspaces
```

---

## API Endpoints (39 total)

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/announcements` | List announcements |
| GET | `/api/announcements/:id` | Get announcement |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get event |
| GET | `/api/businesses` | List businesses |
| GET | `/api/businesses/:id` | Get business |
| GET | `/api/jobs` | List jobs |
| GET | `/api/jobs/:id` | Get job |
| GET | `/api/obituaries` | List obituaries |
| GET | `/api/obituaries/:id` | Get obituary |
| GET | `/api/media/files/*` | Serve uploaded files |

### Authenticated (super_admin, family_admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PATCH/DELETE | `/api/communities` | Community CRUD |
| POST/PATCH/DELETE | `/api/families` | Family CRUD |
| POST/PATCH/DELETE | `/api/members` | Member CRUD |
| GET | `/api/members?search=` | Search members |
| POST/PATCH/DELETE | `/api/relationships` | Relationship CRUD |
| GET | `/api/relationships/member/:id` | Member relationships |
| POST/PATCH/DELETE | `/api/announcements` | Manage announcements |
| POST/PATCH/DELETE | `/api/events` | Manage events |
| POST/PATCH/DELETE | `/api/businesses` | Manage businesses |
| POST/PATCH/DELETE | `/api/jobs` | Manage jobs |
| POST/PATCH/DELETE | `/api/obituaries` | Manage obituaries |
| POST | `/api/media/upload` | Upload image |
| DELETE | `/api/media/files/*` | Delete file |

### Admin Only (super_admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Dashboard stats |
| GET | `/api/reports/blood-groups` | Blood group distribution |
| GET | `/api/reports/professions` | Profession distribution |
| GET | `/api/audit-logs` | View audit logs |
| GET | `/api/export/members/csv` | Download members CSV |
| GET | `/api/export/families/csv` | Download families CSV |
| POST | `/api/export/members/import` | Bulk import members |

---

## Frontend Pages (21 total)

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Announcements | `/announcements` | Public |
| Announcement Detail | `/announcements/[id]` | Public |
| Events | `/events` | Public |
| Event Detail | `/events/[id]` | Public |
| Businesses | `/businesses` | Public |
| Business Detail | `/businesses/[id]` | Public |
| Jobs | `/jobs` | Public |
| Job Detail | `/jobs/[id]` | Public |
| Obituaries | `/obituaries` | Public |
| Obituary Detail | `/obituaries/[id]` | Public |
| Directory | `/directory` | Authenticated |
| Members | `/members` | Authenticated |
| Member Profile | `/members/[id]` | Authenticated |
| Families | `/families` | Authenticated |
| Dashboard | `/dashboard` | Admin only |

**Admin-only pages (create/edit):**
Families (`/families/create`, `/families/[id]/edit`), Members (`/members/create`, `/members/[id]/edit`), Announcements, Events, Businesses, Jobs, Obituaries

---

## Project Structure

```
Community-Directory-Platform/
├── frontend/              # Next.js 16 app
│   ├── e2e/               # Playwright E2E tests
│   ├── src/
│   │   ├── app/           # App Router pages (21 pages)
│   │   ├── lib/           # API client, utilities
│   │   └── stores/        # Zustand state (auth)
│   └── playwright.config.ts
├── backend/               # NestJS 11 API
│   ├── prisma/            # Schema, migrations, seed
│   ├── src/
│   │   ├── auth/          # JWT, Passport, RBAC guards
│   │   ├── communities/   # Community CRUD
│   │   ├── families/      # Family CRUD
│   │   ├── members/       # Member CRUD + search
│   │   ├── relationships/ # Relationship engine
│   │   ├── announcements/ # Announcements CRUD
│   │   ├── events/        # Events CRUD
│   │   ├── businesses/    # Business directory
│   │   ├── jobs/          # Job board
│   │   ├── obituaries/    # Obituary module
│   │   ├── media/         # Cloudflare R2 upload
│   │   ├── reports/       # Dashboard statistics
│   │   ├── audit-logs/    # Activity logging
│   │   ├── export/        # CSV import/export
│   │   └── prisma/        # Database service
│   └── .env.example
├── shared/                # Shared TypeScript types & constants
├── docs/                  # Project documentation
├── docker-compose.yml     # PostgreSQL container
└── package.json           # Monorepo root (npm workspaces)
```

---

## Documentation
- [Project Overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [Backend Specification](docs/backend-specification.md)
- [Frontend Specification](docs/frontend-specification.md)

---

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanjayshankar-yellow?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)
