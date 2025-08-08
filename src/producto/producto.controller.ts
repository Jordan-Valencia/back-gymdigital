import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '../../generated/prisma';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() data: CreateProductoDto): Promise<Producto> {
    return this.productoService.create(data);
  }

  @Get()
  findAll(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Producto | null> {
    return this.productoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductoDto): Promise<Producto> {
    return this.productoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Producto> {
    return this.productoService.remove(id);
  }
}
