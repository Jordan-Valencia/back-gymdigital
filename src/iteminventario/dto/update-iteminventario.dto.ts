import { IsString, IsOptional, IsInt, IsNumber, IsDateString } from 'class-validator';

export class UpdateItemInventarioDto {
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
  precio_unitario?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;
}
