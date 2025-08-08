import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ItemGaleriaService } from './itemgaleria.service';
import { ItemGaleria } from '../../generated/prisma';
import { CreateItemGaleriaDto } from './dto/create-itemgaleria.dto';
import { UpdateItemGaleriaDto } from './dto/update-itemgaleria.dto';

@Controller('item-galeria')
export class ItemGaleriaController {
  constructor(private readonly itemGaleriaService: ItemGaleriaService) {}

  @Post()
  create(@Body() data: CreateItemGaleriaDto): Promise<ItemGaleria> {
    return this.itemGaleriaService.create(data);
  }

  @Get()
  findAll(): Promise<ItemGaleria[]> {
    return this.itemGaleriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ItemGaleria | null> {
    return this.itemGaleriaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateItemGaleriaDto): Promise<ItemGaleria> {
    return this.itemGaleriaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ItemGaleria> {
    return this.itemGaleriaService.remove(id);
  }
}
