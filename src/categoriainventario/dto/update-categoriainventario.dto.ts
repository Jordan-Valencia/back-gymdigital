import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CategoriaTipo } from './create-categoriainventario.dto';

export class UpdateCategoriaInventarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(CategoriaTipo)
  tipo?: CategoriaTipo;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
