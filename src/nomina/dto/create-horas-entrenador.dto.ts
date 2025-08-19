// src/nomina/dto/create-horas-entrenador.dto.ts
import { IsString, IsNumber, IsDateString, IsNotEmpty, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateHorasEntrenadorDto {
  @IsString()
  @IsNotEmpty()
  entrenador_id: string

  @IsDateString()
  fecha: string

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  horas: number
}
