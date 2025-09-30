import { IsString, IsUUID, IsInt, MinLength, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsUUID()
  requester_id: string;

  @IsUUID()
  category_id: string;

  @IsInt()
  status_id: number;

  @IsInt()
  priority_id: number;

  @IsUUID()
  category_name_snapshot: string;

  @IsString()
  priority_name_snapshot: string;

  @IsInt()
  sla_first_response_hours_snapshot: number;

  @IsInt()
  sla_resolution_hours_snapshot: number;

  @IsUUID()
  @IsOptional()
  assigned_to_id?: string;
}
