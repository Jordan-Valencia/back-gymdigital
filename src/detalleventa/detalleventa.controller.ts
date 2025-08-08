// src/detalleventa/detalleventa.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DetalleVentaService } from './detalleventa.service';
import { DetalleVenta } from '../../generated/prisma';
import { CreateDetalleVentaDto } from './dto/create-detalleventa.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalleventa.dto';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly service: DetalleVentaService) {}

  @Post()
  create(@Body() data: CreateDetalleVentaDto): Promise<DetalleVenta> {
    return this.service.create(data);
  }

  @Get()
  findAll(): Promise<DetalleVenta[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetalleVenta | null> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DetalleVenta> {
    return this.service.remove(id);
  }
}
