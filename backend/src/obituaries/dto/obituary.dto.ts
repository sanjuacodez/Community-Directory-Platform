import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
export class CreateObituaryDto { @IsUUID() communityId: string; @IsUUID() memberId: string; @IsOptional() @IsString() content?: string; @IsDateString() dateOfDeath: string; }
export class UpdateObituaryDto { @IsOptional() @IsString() content?: string; @IsOptional() @IsDateString() dateOfDeath?: string; }
