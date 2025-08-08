import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoria_id?: string;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsInt()
  stock_minimo?: number;

  @IsOptional()
  @IsNumber()
  precio_venta?: number;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
