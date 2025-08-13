import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EventoService } from './evento.service';
import { Evento } from '@prisma/client';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  create(@Body() data: CreateEventoDto): Promise<Evento> {
    return this.eventoService.create(data);
  }

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Evento | null> {
    return this.eventoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEventoDto): Promise<Evento> {
    return this.eventoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Evento> {
    return this.eventoService.remove(id);
  }
}
