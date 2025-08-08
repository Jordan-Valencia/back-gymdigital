import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateItemGaleriaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  ruta_imagen?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;
}
