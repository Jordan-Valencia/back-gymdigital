import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateHoraTrabajadaDto {
  @IsOptional()
  @IsString()
  entrenador_id?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsNumber()
  horas?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;
}
