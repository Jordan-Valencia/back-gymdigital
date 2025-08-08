import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateGastoDto {
  @IsOptional()
  @IsString()
  concepto?: string;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;
}
