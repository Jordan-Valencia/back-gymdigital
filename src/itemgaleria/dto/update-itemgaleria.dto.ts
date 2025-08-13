import { PartialType } from '@nestjs/mapped-types';
import { CreateItemGaleriaDto } from './create-itemgaleria.dto';

export class UpdateItemGaleriaDto extends PartialType(CreateItemGaleriaDto) {}
