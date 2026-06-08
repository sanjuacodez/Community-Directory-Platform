# Backend Specification

## Current (NestJS)

39 custom endpoints implemented across 13 modules.

## Target (Supabase - Post Migration)

The NestJS backend is replaced by Supabase's auto-generated REST API. The Prisma schema serves as the source of truth for the database structure.

### Supabase Auto-API Endpoints (Generated)

All CRUD operations are handled by Supabase's PostgREST engine:

```
GET    /rest/v1/communities
POST   /rest/v1/communities
PATCH  /rest/v1/communities?id=eq.<id>
DELETE /rest/v1/communities?id=eq.<id>

GET    /rest/v1/families?community_id=eq.<id>
GET    /rest/v1/members?family_id=eq.<id>&select=*,family(*)
GET    /rest/v1/announcements?order=published_at.desc

... (same for all 14 tables)
```

### Custom Endpoints (Edge Functions)

These remain as serverless functions for complex logic:

| Endpoint | Purpose |
|----------|---------|
| `/functions/v1/relationships` | Validate + create relationship |
| `/functions/v1/export-members` | CSV export |
| `/functions/v1/export-families` | CSV export |
| `/functions/v1/import-members` | Bulk member import |
| `/functions/v1/dashboard` | Aggregated stats |

### Authentication

Supabase Auth handles:
* Email/password registration
* Email verification
* Password reset
* JWT issuance (access + refresh)
* Session management

The frontend uses `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`.

### Authorization (Row-Level Security)

Replaces NestJS guards with database-level policies:

```sql
-- Public tables: readable by anyone
CREATE POLICY "Public read" ON announcements FOR SELECT USING (true);

-- Members: visible to community members
CREATE POLICY "Community read" ON members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin: full access
CREATE POLICY "Admin all" ON communities FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'));
```

### Security

* JWT via Supabase Auth
* Row-Level Security on all tables
* API key required for Edge Functions
* HTTPS enforced by Supabase
* CORS configured in Supabase dashboard
