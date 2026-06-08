import { IsUUID, IsIn, IsOptional } from 'class-validator';

const validTypes = ['father', 'mother', 'spouse', 'child'] as const;

export class CreateRelationshipDto {
  @IsUUID()
  memberId: string;

  @IsUUID()
  relatedMemberId: string;

  @IsIn(validTypes)
  relationshipType: string;
}

export class UpdateRelationshipDto {
  @IsOptional()
  @IsIn(validTypes)
  relationshipType?: string;
}
