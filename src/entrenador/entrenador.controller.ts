import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { Entrenador } from '../../generated/prisma';
import { CreateEntrenadorDto } from './dto/create-entrenador.dto';
import { UpdateEntrenadorDto } from './dto/update-entrenador.dto';

@Controller('entrenador')
export class EntrenadorController {
  constructor(private readonly entrenadorService: EntrenadorService) {}

  @Post()
  create(@Body() data: CreateEntrenadorDto): Promise<Entrenador> {
    return this.entrenadorService.create(data);
  }

  @Get()
  findAll(): Promise<Entrenador[]> {
    return this.entrenadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Entrenador | null> {
    return this.entrenadorService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEntrenadorDto): Promise<Entrenador> {
    return this.entrenadorService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Entrenador> {
    return this.entrenadorService.remove(id);
  }
}
