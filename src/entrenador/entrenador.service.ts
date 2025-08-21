import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Entrenador } from '@prisma/client';
import { CreateEntrenadorDto } from './dto/create-entrenador.dto';
import { UpdateEntrenadorDto } from './dto/update-entrenador.dto';

@Injectable()
export class EntrenadorService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo entrenador */
  async create(data: CreateEntrenadorDto): Promise<Entrenador> {
    try { 
      console.log('Creando entrenador:', data);
      return await this.prisma.entrenador.create({
        data: {
          nombre: data.nombre,
          telefono: data.telefono,
          email: data.email,
          especialidad: data.especialidad,
          fecha_registro: new Date(), // ✅ generado automáticamente
          activo: data.activo,
          tarifa_hora: data.tarifa_hora, // ✅ agregar el campo requerido
        },
      });
    } catch (error) {
      console.error('Error creando entrenador:', error);
      throw new BadRequestException('No se pudo crear el entrenador. Verifica los datos.');
    }
  }

  /** Listar todos los entrenadores */
  async findAll(): Promise<Entrenador[]> {
    return this.prisma.entrenador.findMany({
      orderBy: { fecha_registro: 'desc' },
    });
  }

  /** Buscar entrenador por ID */
  async findOne(id: string): Promise<Entrenador> {
    const entrenador = await this.prisma.entrenador.findUnique({ where: { id } });
    if (!entrenador) {
      throw new NotFoundException(`No se encontró un entrenador con el ID ${id}`);
    }
    return entrenador;
  }

  /** Actualizar entrenador */
  async update(id: string, data: UpdateEntrenadorDto): Promise<Entrenador> {
    console.log('editando entrenador:', data);
    const existe = await this.prisma.entrenador.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un entrenador con el ID ${id}`);
    }

    try {
      const updateData: Prisma.EntrenadorUpdateInput = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        especialidad: data.especialidad,
        activo: data.activo,
        tarifa_hora: data.tarifa_hora,
      };

      return await this.prisma.entrenador.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando entrenador:', error);
      throw new BadRequestException('No se pudo actualizar el entrenador.');
    }
  }

  /** Eliminar entrenador */
  async remove(id: string): Promise<Entrenador> {
    const existe = await this.prisma.entrenador.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un entrenador con el ID ${id}`);
    }

    try {
      return await this.prisma.entrenador.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando entrenador:', error);
      throw new BadRequestException('No se pudo eliminar el entrenador.');
    }
  }
}
