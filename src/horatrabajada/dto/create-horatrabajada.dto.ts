import { IsUUID, IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateHoraTrabajadaDto {
  @IsOptional()
  @IsUUID()
  id?: string; // normalmente generado por backend

  @IsDateString()
  fecha: string;

  @IsNumber()
  @Min(0.01)
  horas: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsUUID()
  entrenador_id: string;

  // fecha_registro normalmente no se envía, el backend la genera
}
