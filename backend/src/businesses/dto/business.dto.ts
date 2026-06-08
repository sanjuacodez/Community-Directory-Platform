import { IsString, IsOptional, IsUUID, IsEmail, MaxLength } from 'class-validator';
export class CreateBusinessDto {
  @IsUUID() communityId: string; @IsUUID() ownerMemberId: string;
  @IsString() @MaxLength(200) businessName: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() location?: string;
}
export class UpdateBusinessDto {
  @IsOptional() @IsString() @MaxLength(200) businessName?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() phone?: string; @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() location?: string;
}
