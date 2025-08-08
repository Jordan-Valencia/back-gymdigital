import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateMembresiaDto {
  @IsString()
  id: string;

  @IsString()
  usuario_id: string;

  @IsString()
  plan_id: string;

  @IsDateString()
  fecha_inicio: string;

  @IsDateString()
  fecha_fin: string;

  @IsNumber()
  precio_pagado: number;

  @IsString()
  metodo_pago: string;

  @IsDateString()
  fecha_pago: string;
}
