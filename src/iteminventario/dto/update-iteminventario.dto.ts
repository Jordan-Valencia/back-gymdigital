import { PartialType } from '@nestjs/mapped-types';
import { CreateItemInventarioDto } from './create-iteminventario.dto';

export class UpdateItemInventarioDto extends PartialType(CreateItemInventarioDto) {}
