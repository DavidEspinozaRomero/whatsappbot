import { IsArray, IsDate, IsString } from 'class-validator';

export class CreateGroupManagementDto {
  @IsArray()
  groupMembers: number[]; // (Array of Contacts IDs)

  @IsString()
  description: string;

  @IsDate()
  joinedAt: Date;

  @IsDate()
  lastSeen: Date;

  @IsString()
  role: string; // (e.g., admin, moderator)

  @IsString()
  status: string; // (e.g., active, inactive)

  @IsString()
  permissions: string;
}
