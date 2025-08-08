import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ItemInventarioService } from './iteminventario.service';
import { ItemInventario } from '../../generated/prisma';
import { CreateItemInventarioDto } from './dto/create-iteminventario.dto';
import { UpdateItemInventarioDto } from './dto/update-iteminventario.dto';

@Controller('item-inventario')
export class ItemInventarioController {
  constructor(private readonly itemInventarioService: ItemInventarioService) {}

  @Post()
  create(@Body() data: CreateItemInventarioDto): Promise<ItemInventario> {
    return this.itemInventarioService.create(data);
  }

  @Get()
  findAll(): Promise<ItemInventario[]> {
    return this.itemInventarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ItemInventario | null> {
    return this.itemInventarioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateItemInventarioDto): Promise<ItemInventario> {
    return this.itemInventarioService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ItemInventario> {
    return this.itemInventarioService.remove(id);
  }
}
