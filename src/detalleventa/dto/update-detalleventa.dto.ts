import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleVentaDto } from './create-detalleventa.dto';

export class UpdateDetalleVentaDto extends PartialType(CreateDetalleVentaDto) {}
