// create-iteminventario.dto.ts
import { IsString, IsOptional, IsInt, Min, IsNumber, IsPositive, IsUUID, IsDateString } from 'class-validator';

export class CreateItemInventarioDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  nombre: string;

  @IsUUID()
  categoria_id: string;

  @IsInt()
  @Min(0)
  cantidad: number;

  @IsInt()
  @Min(1)
  stock_minimo: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio_unitario?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string; // ✅ lo agregamos opcionalmente
}
