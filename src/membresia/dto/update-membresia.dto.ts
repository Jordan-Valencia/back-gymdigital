import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateMembresiaDto {
  @IsOptional()
  @IsString()
  usuario_id?: string;

  @IsOptional()
  @IsString()
  plan_id?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsNumber()
  precio_pagado?: number;

  @IsOptional()
  @IsString()
  metodo_pago?: string;

  @IsOptional()
  @IsDateString()
  fecha_pago?: string;
}
