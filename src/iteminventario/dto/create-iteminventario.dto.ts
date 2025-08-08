import { IsString, IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateItemInventarioDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsString()
  categoria_id: string;

  @IsInt()
  cantidad: number;

  @IsInt()
  stock_minimo: number;

  @IsOptional()
  @IsNumber()
  precio_unitario?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fecha_registro: string;
}
