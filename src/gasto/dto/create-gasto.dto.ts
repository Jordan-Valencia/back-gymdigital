import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateGastoDto {
  @IsString()
  concepto: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsDateString()
  fecha: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  // fecha_registro lo genera el backend
}
