# CommunityHub - Community Directory Platform

A web-based community directory platform for managing families, members, relationships, announcements, events, businesses, jobs, and obituary records. Built with claymorphism design.

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

## Quick Start

```bash
git clone https://github.com/sanjuacodez/Community-Directory-Platform.git
cd Community-Directory-Platform
npm install
cd frontend
cp .env.example .env.local   # Add your Supabase keys
npm run dev
```

Opens at **http://localhost:3000**. No backend server needed.

### Demo Credentials
- **URL:** http://localhost:3000/login
- **Email:** `admin@communityportal.com`
- **Password:** `admin123456`
- **Role:** Super Admin

---

## Features

### For Everyone (Public)
- **Member Directory** — search by name, filter by community, family, gender, blood group, profession, location
- **Grid/List Views** — toggle between card grid and table view
- **Member Popups** — click any member for full details with prev/next navigation
- **Social Links** — WhatsApp, Facebook, Instagram, LinkedIn, Twitter per member
- **Content Feed** — announcements, events, businesses, jobs, obituaries on home page

### For Admins
- **Admin Panel** (`/admin`) — quick links to create all content types
- **Dashboard** — stats with blood group + profession breakdowns
- **Role Management** (`/admin/roles`) — assign super_admin, community_admin, family_admin to users
- **Login Creation** — admins can create auth accounts for members with auto-generated passwords
- **Password Reset** — admins can reset member passwords directly
- **Member CRUD** — full create/edit with grouped sections (Profile Photo, Basic Info, Contact, Work, Social Media, Family Connections)
- **Family Connections** — link father/mother/spouse during member creation with auto-relationship creation
- **Quick Add Member** — modal for rapid member creation directly from relationship forms
- **Profile Image Upload** — Supabase Storage with drag-and-drop
- **Relationships** — create/manage father, mother, spouse, child relationships
- **CSV Import/Export**
- **Audit Logging**

### Design
- **Claymorphism** — soft 3D shadows, rounded elements, pastel colors
- **Gender-colored cards** — blue (male), pink (female), purple (other)
- **Mobile responsive** — all grids collapse to single column
- **Accessibility** — ARIA labels, keyboard navigation, focus rings
- **SVG icons** on all controls

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

## Documentation
- [Deployment Guide](docs/deployment.md) — step-by-step deployment to Cloudflare Pages + Supabase
- [Design System](docs/design-system.md) — claymorphism guide, colors, components
- [Supabase Migration Plan](docs/supabase-migration-plan.md)
- [User Roles & Capabilities](docs/user-roles-capabilities.md)
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)

---

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanjayshankar-yellow?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/sanjayshankar)
