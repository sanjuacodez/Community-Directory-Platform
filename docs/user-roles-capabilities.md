# User Roles & Capabilities Matrix

## Role Hierarchy

```
super_admin > community_admin > family_admin > member > public (visitor)
```

---

## Capability Matrix

| Capability | Public | Member | Family Admin | Community Admin | Super Admin |
|-----------|--------|--------|-------------|-----------------|-------------|
| View home page | ✅ | ✅ | ✅ | ✅ | ✅ |
| View directory | ❌ | ✅ | ✅ | ✅ | ✅ |
| View members list | ❌ | ✅ | ✅ | ✅ | ✅ |
| View member profiles | ❌ | ✅ | ✅ | ✅ | ✅ |
| View families | ❌ | ✅ | ✅ | ✅ | ✅ |
| View communities | ❌ | ✅ | ✅ | ✅ | ✅ |
| View announcements | ✅ | ✅ | ✅ | ✅ | ✅ |
| View events | ✅ | ✅ | ✅ | ✅ | ✅ |
| View businesses | ✅ | ✅ | ✅ | ✅ | ✅ |
| View jobs | ✅ | ✅ | ✅ | ✅ | ✅ |
| View obituaries | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create members | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Edit members | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Delete members | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Create families | ❌ | ❌ | ❌ | ✅ (own community) | ✅ |
| Edit families | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Delete families | ❌ | ❌ | ❌ | ✅ (own community) | ✅ |
| Create communities | ❌ | ❌ | ❌ | ❌ | ✅ |
| Edit communities | ❌ | ❌ | ❌ | ✅ (own) | ✅ |
| Delete communities | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create announcements | ❌ | ❌ | ❌ | ✅ (own community) | ✅ |
| Create events | ❌ | ❌ | ❌ | ✅ (own community) | ✅ |
| Create businesses | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Create jobs | ❌ | ❌ | ❌ | ✅ (own community) | ✅ |
| Create obituaries | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Manage relationships | ❌ | ❌ | ✅ (own family) | ✅ (own community) | ✅ |
| Manage user roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| View dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ✅ |
| CSV import/export | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## How to Assign Roles

### Method 1: Admin Panel (recommended)
1. Login as super_admin
2. Go to `/admin/roles`
3. Find the user — click role toggles to assign/remove

### Method 2: SQL (backend)
```sql
-- Find user ID from auth.users
SELECT id, email FROM auth.users;

-- Assign role
INSERT INTO user_roles (user_id, role_id)
SELECT 'USER_UUID_HERE', id FROM roles WHERE name = 'community_admin';
```

---

## How Members Get Login Credentials

### Flow
1. Admin creates member record with email in `/members/create`
2. Admin clicks **"Create Login"** on the member profile
3. System auto-generates a password and creates Supabase Auth account
4. Admin shares the password with the member
5. Member logs in at `/login` with their email + password
6. Member can reset password via "Forgot Password" on login page

### Creating Admins
1. Person registers at `/login` with email + password
2. Admin creates their member record
3. Admin goes to `/admin/roles` → assigns the appropriate role
4. Person can now manage their assigned community/family

---

## Database Notes

- `auth.users` — Supabase Auth managed (email, password, session)
- `members.user_id` — links member record to `auth.users.id`
- `user_roles` — many-to-many between `auth.users` and `roles`
- `roles` — predefined: super_admin, community_admin, family_admin, member
- RLS policies enforce role-based access at database level
