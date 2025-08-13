import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { Notificacion } from '@prisma/client';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Controller('notificacion')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Post()
  create(@Body() data: CreateNotificacionDto): Promise<Notificacion> {
    return this.notificacionService.create(data);
  }

  @Get()
  findAll(): Promise<Notificacion[]> {
    return this.notificacionService.findAll();
  }

  @Get('no-leidas')
  findNoLeidas() {
    return this.notificacionService.findNoLeidas();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notificacion | null> {
    return this.notificacionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateNotificacionDto): Promise<Notificacion> {
    return this.notificacionService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notificacion> {
    return this.notificacionService.remove(id);
  }
}
