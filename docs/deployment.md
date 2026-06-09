# Deployment Guide

## Overview

CommunityHub deploys to **zero-cost** infrastructure for up to 5,000 users:

| Component | Service | Free Tier | Deployment Method |
|-----------|---------|-----------|-------------------|
| Frontend | Cloudflare Pages | Unlimited | Git push or manual upload |
| Database | Supabase | 500 MB, 50K MAU | Managed — no deploy needed |
| Auth | Supabase Auth | 50K MAU | Managed — no deploy needed |
| Storage | Cloudflare R2 | 10 GB | Managed — no deploy needed |

**Total monthly cost: $0** up to significant scale.

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → Sign in → **New Project**
2. Choose an organization, name your project (e.g., `communityhub`)
3. Set a secure **Database Password** — save it somewhere safe
4. Choose region closest to your users (e.g., `ap-south-1` for India)
5. Click **Create Project** — wait 2-3 minutes for provisioning

### 1.2 Import Database Schema
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `backend/prisma/supabase-schema.sql` from this repo
4. Copy its entire contents and paste into the SQL Editor
5. Click **Run** — all 14 tables, roles, indexes, and RLS policies are created
6. Verify: go to **Table Editor** (left sidebar) — you should see all tables listed

### 1.3 Enable Authentication
1. Go to **Authentication** → **Providers** (left sidebar)
2. Find **Email** provider → toggle it **ON**
3. Configure:
   - **Confirm email**: Optional (turn off for easier onboarding)
   - **Minimum password length**: 8
4. Click **Save**

### 1.4 Get API Keys
1. Go to **Settings** → **API** (left sidebar)
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: starts with `eyJh...`
   - **service_role key**: starts with `eyJh...` (keep this secret!)

---

## Step 2: Frontend Configuration

### 2.1 Set Environment Variables
Create a file `frontend/.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-1.4
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-community-directory.r2.dev
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-step-1.4
```

**⚠️ Important:** The `SUPABASE_SERVICE_ROLE_KEY` is used server-side only (for admin API routes). Do NOT prefix it with `NEXT_PUBLIC_`.

### 2.2 Seed Roles
If the SQL import didn't seed roles, run this in Supabase SQL Editor:
```sql
INSERT INTO roles (name) VALUES ('super_admin'), ('community_admin'), ('family_admin'), ('member');
```

### 2.3 Create Admin User
1. Start the app locally: `cd frontend && npm run dev`
2. Open `http://localhost:3000/login`
3. Click **Create Account** → register with your email and password
4. In Supabase SQL Editor, promote yourself:
```sql
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM auth.users u, roles r
WHERE u.email = 'your-email@example.com' AND r.name = 'super_admin';
```
5. Refresh the app — you now have super admin access

### 2.4 Test Locally
```bash
cd frontend
npm run dev
# Open http://localhost:3000
# Login with your admin credentials
# Verify: create a community, add a family, add members
```

---

## Step 3: Deploy Frontend to Cloudflare Pages

### 3.1 Push to GitHub
Make sure your code is on GitHub:
```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 3.2 Connect Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** tab → **Connect to Git**
3. Authorize Cloudflare to access your GitHub account
4. Select your repository

### 3.3 Configure Build
| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Build Command** | `npm install && npm run build --workspace=frontend` |
| **Build Output Directory** | `frontend/.next` |
| **Root Directory** | `/` |

### 3.4 Add Environment Variables
In Cloudflare Pages → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Your R2 public URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |

### 3.5 Deploy
Click **Save and Deploy**. Cloudflare builds and deploys your app. You'll get a URL like:
`https://communityhub.pages.dev`

### 3.6 Custom Domain (Optional)
1. In Cloudflare Pages → your project → **Custom Domains**
2. Add your domain (e.g., `communityhub.example.com`)
3. Cloudflare automatically handles DNS and SSL

---

## Step 4: Cloudflare R2 Setup (For Profile Images)

### 4.1 Create R2 Bucket
```bash
npx wrangler r2 bucket create community-directory
```

Or via Cloudflare Dashboard → R2 → Create Bucket → `community-directory`

### 4.2 Enable Public Access
1. Go to R2 → `community-directory` → **Settings**
2. Under **Public Access** → **Custom Domain**
3. Connect a domain or use the R2.dev subdomain
4. Copy the public URL (e.g., `https://pub-xxxxx.r2.dev`)

### 4.3 Update Environment
Add the R2 public URL to both `.env.local` (local) and Cloudflare Pages env vars:
```
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 4.4 Create Storage Bucket in Supabase
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
```

Profile images are stored in Supabase Storage — R2 is used as a CDN for public assets.

---

## Step 5: Post-Deployment Checklist

- [ ] Home page loads with content sections
- [ ] Public `/members` page shows member directory
- [ ] Login with admin credentials works
- [ ] Creating a community works
- [ ] Creating a family with admin assignment works
- [ ] Adding members with family connections works
- [ ] Profile image upload works
- [ ] Member popup with prev/next navigation works
- [ ] Admin panel (`/admin`) loads with all links
- [ ] Role management (`/admin/roles`) works
- [ ] Filter panel on members page works
- [ ] Grid/List toggle works
- [ ] Mobile responsive — test on phone
- [ ] Social links in member popup work

---

## Updating the App

### Schema Changes
1. Edit `backend/prisma/supabase-schema.sql`
2. Run new ALTER/CREATE statements in Supabase SQL Editor
3. Do NOT modify existing CREATE TABLE statements — use ALTER TABLE

### Frontend Changes
1. Make changes in `frontend/src/`
2. Test locally: `cd frontend && npm run dev`
3. Run typecheck: `npm run typecheck`
4. Commit and push to GitHub
5. Cloudflare Pages auto-deploys on push to `main`

### Environment Variables
Never commit `.env.local` to git. It's already in `.gitignore`. Use `.env.example` as a template for new developers.

---

## Troubleshooting

### "supabaseUrl is required" error
→ Set `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` (local) or Cloudflare Pages env vars (production)

### No API key found in request
→ Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` correctly

### Members not loading
→ Check RLS policies: `GRANT SELECT ON members TO anon;`

### Profile images not uploading
→ Check Supabase Storage bucket: `SELECT * FROM storage.buckets;`
→ Check RLS on storage.objects

### Password reset / Login creation not working
→ Set `SUPABASE_SERVICE_ROLE_KEY` in environment variables (without `NEXT_PUBLIC_` prefix)
