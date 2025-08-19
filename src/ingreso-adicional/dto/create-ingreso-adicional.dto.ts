// src/ingresos-adicionales/dto/create-ingreso-adicional.dto.ts
import { IsString, IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateIngresoAdicionalDto {
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
  categoria: string

  @IsString()
  descripcion: string

  @IsString()
  @IsNotEmpty()
  metodo_pago: string
}
