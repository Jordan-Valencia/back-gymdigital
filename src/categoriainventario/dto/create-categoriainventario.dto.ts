import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { CategoriaTipo } from '@prisma/client';

export class CreateCategoriaInventarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(CategoriaTipo)
  tipo: CategoriaTipo;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
