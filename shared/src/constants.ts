export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  FAMILY_ADMIN: 'family_admin',
  MEMBER: 'member',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const VISIBILITY = {
  PUBLIC: 'public',
  COMMUNITY_ONLY: 'community_only',
  FAMILY_ONLY: 'family_only',
  PRIVATE: 'private',
} as const;

export type Visibility = (typeof VISIBILITY)[keyof typeof VISIBILITY];

export const RELATIONSHIP_TYPES = {
  FATHER: 'father',
  MOTHER: 'mother',
  SPOUSE: 'spouse',
  CHILD: 'child',
} as const;

export type RelationshipType =
  (typeof RELATIONSHIP_TYPES)[keyof typeof RELATIONSHIP_TYPES];

export const ENTITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type EntityStatus = (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
