import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { HoraTrabajadaService } from './horatrabajada.service';
import { HoraTrabajada } from '../../generated/prisma';
import { CreateHoraTrabajadaDto } from './dto/create-horatrabajada.dto';
import { UpdateHoraTrabajadaDto } from './dto/update-horatrabajada.dto';

@Controller('hora-trabajada')
export class HoraTrabajadaController {
  constructor(private readonly horaTrabajadaService: HoraTrabajadaService) {}

  @Post()
  create(@Body() data: CreateHoraTrabajadaDto): Promise<HoraTrabajada> {
    return this.horaTrabajadaService.create(data);
  }

  @Get()
  findAll(): Promise<HoraTrabajada[]> {
    return this.horaTrabajadaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<HoraTrabajada | null> {
    return this.horaTrabajadaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateHoraTrabajadaDto): Promise<HoraTrabajada> {
    return this.horaTrabajadaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<HoraTrabajada> {
    return this.horaTrabajadaService.remove(id);
  }
}
