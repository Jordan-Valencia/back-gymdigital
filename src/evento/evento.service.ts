import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Evento } from '../../generated/prisma';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEventoDto): Promise<Evento> {
    const createData: Prisma.EventoCreateInput = {
      id: data.id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
      tipo: data.tipo,
      color: data.color,
      fecha_registro: new Date(data.fecha_registro),
    };
    return this.prisma.evento.create({ data: createData });
  }

  async findAll(): Promise<Evento[]> {
    return this.prisma.evento.findMany();
  }

  async findOne(id: string): Promise<Evento | null> {
    return this.prisma.evento.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateEventoDto): Promise<Evento> {
    const updateData: Prisma.EventoUpdateInput = { ...data };

    if (data.fecha_inicio) {
      updateData.fecha_inicio = new Date(data.fecha_inicio);
    }
    if (data.fecha_fin) {
      updateData.fecha_fin = new Date(data.fecha_fin);
    }
    if (data.fecha_registro) {
      updateData.fecha_registro = new Date(data.fecha_registro);
    }

    return this.prisma.evento.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Evento> {
    return this.prisma.evento.delete({ where: { id } });
  }
}
