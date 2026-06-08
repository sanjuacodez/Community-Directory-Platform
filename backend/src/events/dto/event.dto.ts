import { IsString, IsOptional, IsUUID, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsUUID() communityId: string;
  @IsString() @MinLength(2) @MaxLength(200) title: string;
  @IsOptional() @IsString() description?: string;
  @IsDateString() eventDate: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() image?: string;
}

export class UpdateEventDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() eventDate?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() image?: string;
}
