import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Membresia } from '@prisma/client';
import { CreateMembresiaDto } from './dto/create-membresia.dto';

@Injectable()
export class MembresiaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear una nueva membresía */
  async create(data: CreateMembresiaDto): Promise<Membresia> {
    try {
      if (!data.usuario_id || !data.plan_id) {
        throw new BadRequestException('Debe indicar un usuario y un plan válidos.');
      }

      return await this.prisma.membresia.create({
        data: {
          fecha_inicio: new Date(data.fecha_inicio),
          fecha_fin: new Date(data.fecha_fin),
          precio_pagado: data.precio_pagado,
          metodo_pago: data.metodo_pago,
          fecha_pago: new Date(data.fecha_pago),
          Usuario: {
            connect: { id: data.usuario_id },
          },
          Plan: {
            connect: { id: data.plan_id },
          },
        },
      });
    } catch (error) {
      console.error('Error creando membresía:', error);
      throw new BadRequestException('No se pudo crear la membresía. Verifica los datos.');
    }
  }

  /** Listar todas las membresías */
  async findAll(): Promise<Membresia[]> {
    return this.prisma.membresia.findMany({
      orderBy: { fecha_inicio: 'desc' },
      include: { Usuario: true, Plan: true },
    });
  }

  /** Buscar una membresía por ID */
  async findOne(id: string): Promise<Membresia> {
    const membresia = await this.prisma.membresia.findUnique({
      where: { id },
      include: { Usuario: true, Plan: true },
    });

    if (!membresia) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    return membresia;
  }

  /** Actualizar una membresía */
  async update(id: string, data: Partial<CreateMembresiaDto>): Promise<Membresia> {
    const existe = await this.prisma.membresia.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    try {
      const updateData: any = {
        fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
        fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
        precio_pagado: data.precio_pagado,
        metodo_pago: data.metodo_pago,
        fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : undefined,
      };

      if (data.usuario_id) {
        updateData.Usuario = { connect: { id: data.usuario_id } };
      }

      if (data.plan_id) {
        updateData.Plan = { connect: { id: data.plan_id } };
      }

      // Elimina las propiedades undefined para evitar errores
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      );

      return await this.prisma.membresia.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando membresía:', error);
      throw new BadRequestException('No se pudo actualizar la membresía. Verifica los datos.');
    }
  }

  /** Eliminar una membresía */
  async remove(id: string): Promise<Membresia> {
    const existe = await this.prisma.membresia.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    try {
      return await this.prisma.membresia.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando membresía:', error);
      throw new BadRequestException('No se pudo eliminar la membresía. Verifica dependencias.');
    }
  }
}
