// src/nomina/dto/create-nomina.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsNotEmpty, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
  PARCIAL = 'PARCIAL'
}

export class CreateNominaDto {
  @IsString()
  @IsNotEmpty()
  entrenador_id: string

  @IsNumber()
  @Min(1)
  @Max(12)
  @Transform(({ value }) => parseInt(value))
  mes: number

  @IsNumber()
  @Min(2020)
  @Transform(({ value }) => parseInt(value))
  año: number

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  salario_base: number

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  bonificaciones: number

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  deducciones: number

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  total_pagar: number

  @IsOptional()
  @IsDateString()
  fecha_pago?: string

  @IsEnum(EstadoPago)
  estado: EstadoPago

  @IsOptional()
  @IsString()
  notas?: string
}
