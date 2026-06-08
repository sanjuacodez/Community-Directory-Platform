import type {
  Role,
  Visibility,
  RelationshipType,
  EntityStatus,
  Gender,
  BloodGroup,
} from './constants';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface MemberBase {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  email?: string;
  phone?: string;
  profession?: string;
  organization?: string;
  education?: string;
  location?: string;
  profileImage?: string;
  isDeceased?: boolean;
  visibility: Visibility;
}

export interface RelationshipRecord {
  id: string;
  memberId: string;
  relatedMemberId: string;
  relationshipType: RelationshipType;
  createdAt: string;
}

export type { Role, Visibility, RelationshipType, EntityStatus, Gender, BloodGroup };
