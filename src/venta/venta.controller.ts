import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VentaService } from './venta.service';
import { Venta } from '@prisma/client';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  create(@Body() data: CreateVentaDto): Promise<Venta> {
    return this.ventaService.create(data);
  }

  @Get()
  findAll(): Promise<Venta[]> {
    return this.ventaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Venta | null> {
    return this.ventaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVentaDto): Promise<Venta> {
    return this.ventaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Venta> {
    return this.ventaService.remove(id);
  }
}
