// src/ingresos-adicionales/dto/update-ingreso-adicional.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateIngresoAdicionalDto } from './create-ingreso-adicional.dto'

export class UpdateIngresoAdicionalDto extends PartialType(CreateIngresoAdicionalDto) {}
