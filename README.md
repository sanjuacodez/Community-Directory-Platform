# Community Directory Platform

A web-based community directory platform for managing families, members, relationships, announcements, events, businesses, jobs, and obituary records.

Built by **[Sanjay Shankar M](https://sanjayshankar.me)**

[![GitHub](https://img.shields.io/badge/GitHub-sanjuacodez-black?logo=github)](https://github.com/sanjuacodez)
[![Website](https://img.shields.io/badge/Website-sanjayshankar.me-blue)](https://sanjayshankar.me)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)

---

## Features

- Centralized member directory with search and filters
- Family relationship mapping (father, mother, spouse, child)
- Community announcements and events
- Business directory and job board
- Obituary records
- Role-Based Access Control (Super Admin, Family Admin, Member)
- Multi-community SaaS ready architecture

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, TailwindCSS 4, shadcn/ui |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Auth | JWT (access + refresh tokens), Passport |
| State | TanStack Query, Zustand (frontend) |
| Storage | Cloudflare R2 (planned) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/sanjuacodez/Community-Directory-Platform.git
cd Community-Directory-Platform

# Install dependencies
npm install

# Start PostgreSQL
docker compose up -d

# Run database migrations
cd backend
npx prisma migrate dev

# Seed default roles
npx prisma db seed

# Start backend (http://localhost:3001)
npm run start:dev

# In another terminal, start frontend (http://localhost:3000)
cd ../frontend
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories.

---

## Project Structure

```
Community-Directory-Platform/
├── frontend/          # Next.js 16 app
│   └── src/
│       └── app/       # App Router pages
├── backend/           # NestJS 11 API
│   ├── prisma/        # Schema, migrations, seed
│   └── src/
│       ├── auth/      # Authentication & authorization
│       ├── communities/ # Community CRUD
│       ├── users/     # User management
│       └── prisma/    # Database service
├── shared/            # Shared TypeScript types & constants
├── docs/              # Project documentation
├── docker-compose.yml # PostgreSQL container
└── package.json       # Monorepo root (npm workspaces)
```

---

## API Endpoints

### Auth (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |

### Communities (Auth Required)

| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/api/communities` | super_admin |
| GET | `/api/communities` | super_admin, family_admin |
| GET | `/api/communities/:id` | super_admin, family_admin |
| PATCH | `/api/communities/:id` | super_admin |
| DELETE | `/api/communities/:id` | super_admin |

---

## Documentation

- [Project Overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [Backend Specification](docs/backend-specification.md)
- [Frontend Specification](docs/frontend-specification.md)

---

## License

MIT

---

## Support

If you find this project useful, consider supporting:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanjayshankar-yellow?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)
