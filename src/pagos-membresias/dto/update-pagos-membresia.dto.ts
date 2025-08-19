// src/pagos-membresias/dto/update-pago-membresia.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreatePagoMembresiaDto } from './create-pagos-membresia.dto'

export class UpdatePagoMembresiaDto extends PartialType(CreatePagoMembresiaDto) {}
