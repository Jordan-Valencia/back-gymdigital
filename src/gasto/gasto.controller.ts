import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GastoService } from './gasto.service';
import { Gasto } from '../../generated/prisma';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Controller('gasto')
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post()
  create(@Body() data: CreateGastoDto): Promise<Gasto> {
    return this.gastoService.create(data);
  }

  @Get()
  findAll(): Promise<Gasto[]> {
    return this.gastoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Gasto | null> {
    return this.gastoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateGastoDto): Promise<Gasto> {
    return this.gastoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Gasto> {
    return this.gastoService.remove(id);
  }
}
