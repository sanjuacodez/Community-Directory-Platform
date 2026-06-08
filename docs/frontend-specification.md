# Frontend Specification

## Stack
- Next.js 16 (App Router)
- TypeScript
- TailwindCSS 4
- Zustand (auth state)
- Supabase SDK (database + auth client)
- Cloudflare R2 (direct file upload)

## Page Breakdown

### Public Pages (No Login Required)

| Page | Route | Data Source |
|------|-------|-------------|
| Home | `/` | Supabase queries |
| Announcements | `/announcements` | `/rest/v1/announcements` |
| Announcement Detail | `/announcements/[id]` | `/rest/v1/announcements?id=eq.X` |
| Events | `/events` | `/rest/v1/events` |
| Event Detail | `/events/[id]` | `/rest/v1/events?id=eq.X` |
| Businesses | `/businesses` | `/rest/v1/businesses` |
| Business Detail | `/businesses/[id]` | `/rest/v1/businesses?id=eq.X` |
| Jobs | `/jobs` | `/rest/v1/jobs` |
| Job Detail | `/jobs/[id]` | `/rest/v1/jobs?id=eq.X` |
| Obituaries | `/obituaries` | `/rest/v1/obituaries` |
| Obituary Detail | `/obituaries/[id]` | `/rest/v1/obituaries?id=eq.X` |

### Authenticated Pages (Login Required)

| Page | Route | Data Source |
|------|-------|-------------|
| Directory | `/directory` | `/rest/v1/members?select=*,family(*),community(*)` |
| Members | `/members` | `/rest/v1/members` with filters |
| Member Profile | `/members/[id]` | `/rest/v1/members?id=eq.X&select=*,relationships(*)` |
| Member Create | `/members/create` | POST `/rest/v1/members` |
| Member Edit | `/members/[id]/edit` | PATCH `/rest/v1/members?id=eq.X` |
| Families | `/families` | `/rest/v1/families?select=*,members(count)` |
| Family Create | `/families/create` | POST `/rest/v1/families` |
| Family Edit | `/families/[id]/edit` | PATCH `/rest/v1/families?id=eq.X` |

### Admin Pages (super_admin Only)

| Page | Route | Data Source |
|------|-------|-------------|
| Dashboard | `/dashboard` | Edge Function `/functions/v1/dashboard` |
| Create/Edit (all entities) | Various | POST/PATCH to Supabase REST |

## State Management

- **Supabase Auth**: Session, user, login/logout
- **Zustand**: Thin wrapper for auth state (or removed entirely in favor of Supabase Auth helpers)

## File Upload

Direct to Cloudflare R2 via presigned URLs or Worker proxy. No NestJS intermediary needed.

## Responsive Design

21 pages, all mobile-responsive via TailwindCSS. Tested with Playwright on Desktop Chrome, iPhone 13, iPad Pro 11.
