// src/facturas/dto/generar-factura.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator'

export enum TipoFactura {
  MEMBRESIA = 'MEMBRESIA',
  PRODUCTO = 'PRODUCTO',
  SERVICIO = 'SERVICIO'
}

export class GenerarFacturaDto {
  @IsEnum(TipoFactura)
  tipo: TipoFactura

  @IsString()
  entidad_id: string // ID de la membresía, venta, etc.

  @IsOptional()
  @IsString()
  notas?: string
}
