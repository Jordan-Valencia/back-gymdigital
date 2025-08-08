import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum CategoriaTipo {
  IMPLEMENTO = 'implemento',
  PRODUCTO = 'producto',
}

export class CreateCategoriaInventarioDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsEnum(CategoriaTipo)
  tipo: CategoriaTipo;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
