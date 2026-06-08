# AGENTS.md

# Community Directory Platform

## Purpose

This file defines how AI agents should work within this repository.

All agents must follow these instructions before making changes.

---

# Required Reading Order

Before starting any task, read the following files:

1. docs/project-overview.md
2. docs/architecture.md
3. docs/database-schema.md
4. docs/backend-specification.md
5. docs/frontend-specification.md
6. PROJECT_STATUS.md
7. TASKS.md

Do not start implementation until these files have been reviewed.

---

# Development Workflow

When a task is requested:

1. Find the next incomplete task in TASKS.md
2. Implement only that task
3. Verify acceptance criteria
4. Mark task as completed in TASKS.md
5. Update PROJECT_STATUS.md
6. Commit code changes
7. Stop and wait for next instruction

Never implement multiple phases at once unless explicitly requested.

---

# Project Principles

* Use TypeScript everywhere.
* Never use JavaScript.
* Keep code modular.
* Prefer reusable components.
* Avoid duplication.
* Follow SOLID principles.

---

# Frontend Rules

Framework:

* Next.js 15

UI:

* TailwindCSS
* shadcn/ui

State:

* TanStack Query
* Zustand

Rules:

* Mobile responsive first
* Accessibility friendly
* Reusable components
* Avoid custom CSS when possible

---

# Backend Rules

Framework:

* NestJS

Database:

* PostgreSQL
* Prisma ORM

Rules:

* Use DTOs
* Use validation
* Use service layer
* Follow REST conventions

---

# Database Rules

Every table must include:

* id
* created_at
* updated_at

Use soft delete where applicable.

Never store relationship names directly in member records.

Always use member_relationships table.

---

# Testing Rules

All backend services should include tests.

All APIs should have validation.

Critical business logic should be tested.

---

# Documentation Rules

Whenever schema changes:

Update:

* database-schema.md
* PROJECT_STATUS.md

Whenever APIs change:

Update:

* backend-specification.md
* PROJECT_STATUS.md

Whenever UI changes:

Update:

* frontend-specification.md
* PROJECT_STATUS.md

---

# Task Completion Rules

A task is complete only if:

* Code compiles
* Tests pass
* Acceptance criteria satisfied
* Documentation updated

Do not mark tasks complete otherwise.

---

# Out Of Scope

Do not implement:

* Mobile Apps
* Matrimony
* QR Family Cards
* Payments
* Chat System

Unless explicitly requested.

---

# AI Output Expectations

After completing a task:

Provide:

1. Summary of work completed
2. Files modified
3. Database changes
4. API changes
5. Next recommended task
