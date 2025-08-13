import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateProductoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  nombre: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  stock_minimo: number;

  @IsNumber()
  @IsPositive()
  precio_venta: number;

  @IsNumber()
  @IsPositive()
  costo: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  categoria_id: string;

}
