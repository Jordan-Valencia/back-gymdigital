// src/nomina/dto/update-horas-entrenador.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateHorasEntrenadorDto } from './create-horas-entrenador.dto'

export class UpdateHorasEntrenadorDto extends PartialType(CreateHorasEntrenadorDto) {}
