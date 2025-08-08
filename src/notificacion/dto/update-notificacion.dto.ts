import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateNotificacionDto {
  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;

  @IsOptional()
  @IsDateString()
  fecha_creacion?: string;

  @IsOptional()
  @IsString()
  referencia_id?: string;

  @IsOptional()
  @IsString()
  referencia_tipo?: string;
}
