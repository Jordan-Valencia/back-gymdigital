// src/gastos/dto/update-gasto-detallado.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateGastoDetalladoDto } from './create-gasto-detallado.dto'

export class UpdateGastoDetalladoDto extends PartialType(CreateGastoDetalladoDto) {}
