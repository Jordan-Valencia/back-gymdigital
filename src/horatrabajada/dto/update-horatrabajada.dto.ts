import { PartialType } from '@nestjs/mapped-types';
import { CreateHoraTrabajadaDto } from './create-horatrabajada.dto';

export class UpdateHoraTrabajadaDto extends PartialType(CreateHoraTrabajadaDto) {}
