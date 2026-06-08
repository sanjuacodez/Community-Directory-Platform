# Database Schema

## communities

id
name
slug
logo
status

## families

id
community_id
name
house_name
address
family_admin_id
status

## members

id
community_id
family_id

first_name
last_name

gender
date_of_birth

blood_group

email
phone

profession
organization

education

location

profile_image

is_deceased

visibility

status

created_at
updated_at

## member_relationships

id

member_id

related_member_id

relationship_type

created_at

Relationship Types:

* father
* mother
* spouse
* child

## announcements

id
community_id

title
content

image

published_at

status

## events

id
community_id

title
description

event_date

location

image

## businesses

id
community_id

owner_member_id

business_name

category

description

phone

email

location

## jobs

id
community_id

title

company

location

description

contact_information

expiry_date

## obituaries

id

community_id

member_id

content

date_of_death

## audit_logs

id

user_id

entity_type

entity_id

action

changes

created_at
