import { IsUUID, IsInt, Min, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsOptional()
  @IsUUID()
  id?: string; // generalmente generado por el backend

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsUUID()
  venta_id: string;

  @IsUUID()
  producto_id: string;
}
