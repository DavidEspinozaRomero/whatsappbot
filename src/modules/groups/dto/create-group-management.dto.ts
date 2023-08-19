import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupManagementDto {
  @IsString()
  role: string; // (e.g., admin, moderator)

  @IsNumber()
  groupId: number;

  @IsString()
  status: string; // (e.g., active, inactive)

  @IsString()
  permissions: string;

  @IsDate()
  @IsOptional()
  lastSeen: Date;
}
