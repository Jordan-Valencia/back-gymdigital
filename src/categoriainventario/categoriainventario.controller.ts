import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriaInventarioService } from './categoriainventario.service';
import { CategoriaInventario } from '@prisma/client';
import { CreateCategoriaInventarioDto } from './dto/create-categoriainventario.dto';
import { UpdateCategoriaInventarioDto } from './dto/update-categoriainventario.dto';

@Controller('categoria-inventario')
export class CategoriaInventarioController {
  constructor(private readonly categoriaInventarioService: CategoriaInventarioService) {}

  @Post()
  create(@Body() data: CreateCategoriaInventarioDto): Promise<CategoriaInventario> {
    return this.categoriaInventarioService.create(data);
  }

  @Get()
  findAll(): Promise<CategoriaInventario[]> {
    return this.categoriaInventarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoriaInventario | null> {
    return this.categoriaInventarioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoriaInventarioDto): Promise<CategoriaInventario> {
    return this.categoriaInventarioService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<CategoriaInventario> {
    return this.categoriaInventarioService.remove(id);
  }
}
