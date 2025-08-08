import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsString()
  id: string;

  @IsString()
  venta_id: string;

  @IsString()
  producto_id: string;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;

  @IsNumber()
  subtotal: number;
}
