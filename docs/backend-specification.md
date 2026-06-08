# Backend Specification

## Module Structure

/auth
/communities
/families
/members
/relationships
/announcements
/events
/businesses
/jobs
/obituaries
/reports

## Authentication

Features:

* Login
* Logout
* Refresh Token
* Password Reset

Roles:

* Super Admin
* Family Admin

## Member APIs

POST /members

GET /members

GET /members/:id

PATCH /members/:id

DELETE /members/:id

## Relationship APIs

POST /relationships

PATCH /relationships/:id

DELETE /relationships/:id

GET /members/:id/relationships

## Search APIs

GET /members/search

Filters:

* name
* profession
* blood_group
* family
* location

## Reports APIs

GET /reports/dashboard

GET /reports/member-distribution

GET /reports/blood-groups

GET /reports/professions

## Security

* RBAC
* Input Validation
* Audit Logging
* Rate Limiting
* JWT Authentication
