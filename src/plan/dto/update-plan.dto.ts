import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;
}
