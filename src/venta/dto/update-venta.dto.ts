import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateVentaDto {
  @IsOptional()
  @IsString()
  usuario_id?: string;

  @IsOptional()
  @IsDateString()
  fecha_venta?: string;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  metodo_pago?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
