import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class UpdateEntrenadorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsNumber()
  tarifa_hora?: number;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
