import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';

const validStatuses = ['active', 'inactive', 'archived', 'deleted'] as const;

export class CreateCommunityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsIn(validStatuses)
  status?: string;
}
