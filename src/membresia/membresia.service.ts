import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Membresia } from '@prisma/client';

@Injectable()
export class MembresiaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear una nueva membresía */
  async create(data: Prisma.MembresiaCreateInput): Promise<Membresia> {
    try {
      // Validar datos mínimos
      if (!data.Usuario || !data.Plan) {
        throw new BadRequestException('Debe indicar un usuario y un plan válidos.');
      }

      return await this.prisma.membresia.create({ data });
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
  async update(id: string, data: Prisma.MembresiaUpdateInput): Promise<Membresia> {
    const existe = await this.prisma.membresia.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    try {
      return await this.prisma.membresia.update({
        where: { id },
        data,
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
