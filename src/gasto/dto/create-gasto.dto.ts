import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateGastoDto {
  @IsString()
  id: string;

  @IsString()
  concepto: string;

  @IsNumber()
  monto: number;

  @IsDateString()
  fecha: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fecha_registro: string;
}
