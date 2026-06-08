-- Community Directory Platform - Supabase Schema
-- Run this in Supabase SQL Editor: https://fflgfmhliwrltyjbfguf.supabase.com

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "EntityStatus" AS ENUM ('active', 'inactive', 'archived', 'deleted');
CREATE TYPE "Visibility" AS ENUM ('public', 'community_only', 'family_only', 'private');
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');
CREATE TYPE "RelationshipType" AS ENUM ('father', 'mother', 'spouse', 'child');

-- Roles (uses uuid, references auth.users)
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- User roles (references Supabase auth.users)
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "role_id" UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("user_id", "role_id"),
    PRIMARY KEY ("id")
);

-- Communities
CREATE TABLE "communities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "logo" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Families
CREATE TABLE "families" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "house_name" TEXT,
    "address" TEXT,
    "family_admin_id" UUID,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Members
CREATE TABLE "members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "family_id" UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMPTZ,
    "blood_group" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "profession" TEXT,
    "organization" TEXT,
    "education" TEXT,
    "location" TEXT,
    "profile_image" TEXT,
    "is_deceased" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "Visibility" NOT NULL DEFAULT 'community_only',
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Member Relationships
CREATE TABLE "member_relationships" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "member_id" UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    "related_member_id" UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    "relationship_type" "RelationshipType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("member_id", "related_member_id", "relationship_type"),
    PRIMARY KEY ("id")
);

-- Announcements
CREATE TABLE "announcements" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "published_at" TIMESTAMPTZ DEFAULT now(),
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Events
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMPTZ NOT NULL,
    "location" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Businesses
CREATE TABLE "businesses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "owner_member_id" UUID NOT NULL,
    "business_name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Jobs
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "location" TEXT,
    "description" TEXT,
    "contact_information" TEXT,
    "expiry_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Obituaries
CREATE TABLE "obituaries" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "community_id" UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    "member_id" UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    "content" TEXT,
    "date_of_death" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Audit Logs
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Seed default roles
INSERT INTO "roles" ("name") VALUES ('super_admin'), ('family_admin'), ('member');

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE obituaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for content tables
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read obituaries" ON obituaries FOR SELECT USING (true);

-- RLS Policies: Authenticated read for member data
CREATE POLICY "Auth read communities" ON communities FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth read families" ON families FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth read members" ON members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth read relationships" ON member_relationships FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Auth read user_roles" ON user_roles FOR SELECT USING (true);

-- Helper function for admin check (must be defined before policies that use it)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies: Admin full access (users with super_admin role)
CREATE POLICY "Admin all communities" ON communities FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all families" ON families FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all members" ON members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all relationships" ON member_relationships FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all announcements" ON announcements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all events" ON events FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all businesses" ON businesses FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all jobs" ON jobs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin all obituaries" ON obituaries FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin user_roles" ON user_roles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin audit_logs" ON audit_logs FOR SELECT USING (is_admin());
