import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateHoraTrabajadaDto {
  @IsString()
  id: string;

  @IsString()
  entrenador_id: string;

  @IsDateString()
  fecha: string;

  @IsNumber()
  horas: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fecha_registro: string;
}
