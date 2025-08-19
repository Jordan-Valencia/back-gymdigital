// src/gastos/dto/create-categoria-gasto.dto.ts
import { IsString, IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

export enum TipoGasto {
  OPERATIVO = 'OPERATIVO',
  NOMINA = 'NOMINA',
  MANTENIMIENTO = 'MANTENIMIENTO',
  MARKETING = 'MARKETING',
  SERVICIOS = 'SERVICIOS',
  IMPUESTOS = 'IMPUESTOS',
  OTROS = 'OTROS'
}

export class CreateCategoriaGastoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string

  @IsOptional()
  @IsString()
  descripcion?: string

  @IsEnum(TipoGasto)
  tipo: TipoGasto

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true
}
