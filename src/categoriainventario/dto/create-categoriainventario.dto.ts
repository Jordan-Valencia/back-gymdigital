import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum CategoriaTipo {
  IMPLEMENTO = 'implemento',
  PRODUCTO = 'producto',
}

export class CreateCategoriaInventarioDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(CategoriaTipo)
  tipo: CategoriaTipo;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
