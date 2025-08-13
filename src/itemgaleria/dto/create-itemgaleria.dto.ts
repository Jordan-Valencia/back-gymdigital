import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateItemGaleriaDto {
  @IsOptional()
  @IsUUID()
  id?: string; // generado automáticamente

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  ruta_imagen: string;

  @IsDateString()
  fecha: string; // fecha del evento/imagen

  // fecha_registro no se envía, lo crea el backend
}
