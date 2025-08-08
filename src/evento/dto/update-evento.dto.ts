import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;
}
