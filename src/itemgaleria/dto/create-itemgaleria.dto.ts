import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateItemGaleriaDto {
  @IsString()
  id: string;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  ruta_imagen: string;

  @IsDateString()
  fecha: string;

  @IsDateString()
  fecha_registro: string;
}
