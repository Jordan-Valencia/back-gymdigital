import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateDetalleVentaDto {
  @IsOptional()
  @IsString()
  venta_id?: string;

  @IsOptional()
  @IsString()
  producto_id?: string;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  precio_unitario?: number;

  @IsOptional()
  @IsNumber()
  subtotal?: number;
}
