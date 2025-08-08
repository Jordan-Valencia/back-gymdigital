import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { Prisma, Membresia } from '../../generated/prisma';

@Controller('membresia')
export class MembresiaController {
  constructor(private readonly membresiaService: MembresiaService) {}

  @Post()
  create(@Body() data: Prisma.MembresiaCreateInput): Promise<Membresia> {
    return this.membresiaService.create(data);
  }

  @Get()
  findAll(): Promise<Membresia[]> {
    return this.membresiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Membresia | null> {
    return this.membresiaService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.MembresiaUpdateInput,
  ): Promise<Membresia> {
    return this.membresiaService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Membresia> {
    return this.membresiaService.remove(id);
  }
}
