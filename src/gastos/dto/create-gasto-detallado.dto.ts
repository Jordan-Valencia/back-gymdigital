// src/gastos/dto/create-gasto-detallado.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsNotEmpty, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export enum EstadoGasto {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO', 
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO'
}

export class CreateGastoDetalladoDto {
  @IsString()
  @IsNotEmpty()
  concepto: string

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  monto: number

  @IsDateString()
  fecha: string

  @IsString()
  @IsNotEmpty()
  categoria_id: string

  @IsOptional()
  @IsString()
  descripcion?: string

  @IsOptional()
  @IsString()
  proveedor?: string

  @IsString()
  @IsNotEmpty()
  metodo_pago: string

  @IsEnum(EstadoGasto)
  estado: EstadoGasto

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string

  @IsOptional()
  @IsString()
  comprobante_url?: string
}
