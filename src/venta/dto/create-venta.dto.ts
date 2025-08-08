import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateVentaDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  usuario_id?: string; 

  @IsDateString()
  fecha_venta: string;

  @IsNumber()
  total: number;

  @IsString()
  metodo_pago: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
