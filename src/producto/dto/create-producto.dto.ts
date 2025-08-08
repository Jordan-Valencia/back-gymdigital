import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class CreateProductoDto {
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

  @IsNumber()
  precio_venta: number;

  @IsNumber()
  costo: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
