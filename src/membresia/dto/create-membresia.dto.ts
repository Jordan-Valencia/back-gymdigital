import {
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateMembresiaDto {
  @IsUUID()
  usuario_id: string;

  @IsUUID()
  plan_id: string;

  @IsDateString()
  fecha_inicio: string;

  @IsDateString()
  fecha_fin: string;

  @IsNumber()
  @IsPositive()
  precio_pagado: number;

  @IsString()
  metodo_pago: string;

  @IsDateString()
  fecha_pago: string;
}
