import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Notificacion } from '@prisma/client';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificacionDto): Promise<Notificacion> {
    const createData: Prisma.NotificacionCreateInput = {
      id: data.id,
      tipo: data.tipo,
      mensaje: data.mensaje,
      leida: data.leida,
      fecha_creacion: new Date(data.fecha_creacion),
      referencia_id: data.referencia_id,
      referencia_tipo: data.referencia_tipo,
    };
    return this.prisma.notificacion.create({ data: createData });
  }

  async findAll(): Promise<Notificacion[]> {
    return this.prisma.notificacion.findMany();
  }

  async findOne(id: string): Promise<Notificacion | null> {
    return this.prisma.notificacion.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateNotificacionDto): Promise<Notificacion> {
    const updateData: Prisma.NotificacionUpdateInput = { ...data };
    if (data.fecha_creacion) {
      updateData.fecha_creacion = new Date(data.fecha_creacion);
    }
    return this.prisma.notificacion.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Notificacion> {
    return this.prisma.notificacion.delete({ where: { id } });
  }
}
