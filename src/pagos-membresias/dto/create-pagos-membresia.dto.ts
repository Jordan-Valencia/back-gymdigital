// src/pagos-membresias/dto/create-pago-membresia.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsNotEmpty, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
  PARCIAL = 'PARCIAL'
}

export class CreatePagoMembresiaDto {
  @IsString()
  @IsNotEmpty()
  membresia_id: string

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  monto: number

  @IsDateString()
  fecha_pago: string

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string

  @IsString()
  @IsNotEmpty()
  metodo_pago: string

  @IsEnum(EstadoPago)
  estado: EstadoPago

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  descuento: number

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  recargo: number

  @IsOptional()
  @IsString()
  notas?: string
}
