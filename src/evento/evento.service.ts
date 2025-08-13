import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Evento } from '@prisma/client';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear evento */
  async create(data: CreateEventoDto): Promise<Evento> {
    try {
      return await this.prisma.evento.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha_inicio: new Date(data.fecha_inicio),
          fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
          tipo: data.tipo,
          color: data.color,
          fecha_registro: new Date(), // generado automáticamente
        },
      });
    } catch (error) {
      console.error('Error creando evento:', error);
      throw new BadRequestException('No se pudo crear el evento. Verifica los datos.');
    }
  }

  /** Listar eventos */
  async findAll(): Promise<Evento[]> {
    return this.prisma.evento.findMany({
      orderBy: { fecha_inicio: 'asc' },
    });
  }

  /** Buscar un evento por ID */
  async findOne(id: string): Promise<Evento> {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      throw new NotFoundException(`No se encontró un evento con el ID ${id}`);
    }
    return evento;
  }

  /** Actualizar evento */
  async update(id: string, data: UpdateEventoDto): Promise<Evento> {
    const existe = await this.prisma.evento.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un evento con el ID ${id}`);
    }

    try {
      const updateData: Prisma.EventoUpdateInput = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        color: data.color,
      };

      if (data.fecha_inicio) {
        updateData.fecha_inicio = new Date(data.fecha_inicio);
      }
      if (data.fecha_fin) {
        updateData.fecha_fin = new Date(data.fecha_fin);
      }

      return await this.prisma.evento.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando evento:', error);
      throw new BadRequestException('No se pudo actualizar el evento.');
    }
  }

  /** Eliminar evento */
  async remove(id: string): Promise<Evento> {
    const existe = await this.prisma.evento.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un evento con el ID ${id}`);
    }

    try {
      return await this.prisma.evento.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando evento:', error);
      throw new BadRequestException('No se pudo eliminar el evento.');
    }
  }
}
