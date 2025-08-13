import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaInventarioDto } from './create-categoriainventario.dto';

export class UpdateCategoriaInventarioDto extends PartialType(CreateCategoriaInventarioDto) {}
