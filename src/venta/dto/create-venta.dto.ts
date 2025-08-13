import { IsDateString, IsNumber, Min, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVentaDto {
  @IsDateString()
  fecha_venta: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsString()
  metodo_pago: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsUUID()
  usuario_id?: string;
}
