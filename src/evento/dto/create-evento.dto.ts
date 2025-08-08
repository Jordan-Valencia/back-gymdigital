import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  id: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fecha_inicio: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsDateString()
  fecha_registro: string;
}
