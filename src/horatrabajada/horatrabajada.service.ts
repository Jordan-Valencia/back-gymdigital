import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, HoraTrabajada } from '@prisma/client';
import { CreateHoraTrabajadaDto } from './dto/create-horatrabajada.dto';
import { UpdateHoraTrabajadaDto } from './dto/update-horatrabajada.dto';

@Injectable()
export class HoraTrabajadaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo registro de hora trabajada */
  async create(data: CreateHoraTrabajadaDto): Promise<HoraTrabajada> {
    try {
      return await this.prisma.horaTrabajada.create({
        data: {
          fecha: new Date(data.fecha),
          horas: data.horas,
          descripcion: data.descripcion,
          fecha_registro: new Date(), // generado automáticamente
          Entrenador: {
            connect: { id: data.entrenador_id },
          },
        },
      });
    } catch (error) {
      console.error('Error creando HoraTrabajada:', error);
      throw new BadRequestException('No se pudo crear el registro de horas trabajadas. Verifica los datos.');
    }
  }

  /** Listar todos los registros */
  async findAll(): Promise<HoraTrabajada[]> {
    return this.prisma.horaTrabajada.findMany({
      orderBy: { fecha_registro: 'desc' },
      include: { Entrenador: true },
    });
  }

  /** Buscar un registro por ID */
  async findOne(id: string): Promise<HoraTrabajada> {
    const hora = await this.prisma.horaTrabajada.findUnique({
      where: { id },
      include: { Entrenador: true },
    });
    if (!hora) {
      throw new NotFoundException(`No se encontró registro de horas trabajadas con ID ${id}`);
    }
    return hora;
  }

  /** Actualizar un registro */
  async update(id: string, data: UpdateHoraTrabajadaDto): Promise<HoraTrabajada> {
    const existe = await this.prisma.horaTrabajada.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró registro de horas trabajadas con ID ${id}`);
    }

    try {
      const updateData: Prisma.HoraTrabajadaUpdateInput = {};

      if (data.fecha) {
        updateData.fecha = new Date(data.fecha);
      }

      if (data.horas !== undefined) {
        updateData.horas = data.horas;
      }

      if (data.descripcion !== undefined) {
        updateData.descripcion = data.descripcion;
      }

      if (data.entrenador_id) {
        updateData.Entrenador = {
          connect: { id: data.entrenador_id },
        };
      }

      // No es recomendable actualizar fecha_registro, por eso no lo actualizamos

      return await this.prisma.horaTrabajada.update({
        where: { id },
        data: updateData,
        include: { Entrenador: true },
      });
    } catch (error) {
      console.error('Error actualizando HoraTrabajada:', error);
      throw new BadRequestException('No se pudo actualizar el registro de horas trabajadas.');
    }
  }

  /** Eliminar un registro */
  async remove(id: string): Promise<HoraTrabajada> {
    const existe = await this.prisma.horaTrabajada.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró registro de horas trabajadas con ID ${id}`);
    }

    try {
      return await this.prisma.horaTrabajada.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando HoraTrabajada:', error);
      throw new BadRequestException('No se pudo eliminar el registro de horas trabajadas.');
    }
  }
}
