import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsUUID()
  communityId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(2)
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
