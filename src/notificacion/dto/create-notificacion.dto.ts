import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateNotificacionDto {
  @IsString()
  id: string;

  @IsString()
  tipo: string;

  @IsString()
  mensaje: string;

  @IsBoolean()
  leida: boolean;

  @IsDateString()
  fecha_creacion: string;

  @IsOptional()
  @IsString()
  referencia_id?: string;

  @IsOptional()
  @IsString()
  referencia_tipo?: string;
}
