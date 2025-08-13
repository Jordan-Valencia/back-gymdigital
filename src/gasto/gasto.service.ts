import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Gasto } from '@prisma/client';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Injectable()
export class GastoService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un gasto */
  async create(data: CreateGastoDto): Promise<Gasto> {
    try {
      return await this.prisma.gasto.create({
        data: {
          concepto: data.concepto,
          monto: data.monto,
          fecha: new Date(data.fecha),
          categoria: data.categoria,
          descripcion: data.descripcion,
          fecha_registro: new Date(), // generado automáticamente
        },
      });
    } catch (error) {
      console.error('Error creando gasto:', error);
      throw new BadRequestException('No se pudo crear el gasto. Verifica los datos.');
    }
  }

  /** Listar todos los gastos */
  async findAll(): Promise<Gasto[]> {
    return this.prisma.gasto.findMany({
      orderBy: { fecha: 'desc' },
    });
  }

  /** Buscar un gasto por ID */
  async findOne(id: string): Promise<Gasto> {
    const gasto = await this.prisma.gasto.findUnique({
      where: { id },
    });

    if (!gasto) {
      throw new NotFoundException(`No se encontró un gasto con el ID ${id}`);
    }

    return gasto;
  }

  /** Actualizar un gasto */
  async update(id: string, data: UpdateGastoDto): Promise<Gasto> {
    const existe = await this.prisma.gasto.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un gasto con el ID ${id}`);
    }

    try {
      const updateData: Prisma.GastoUpdateInput = {
        concepto: data.concepto,
        monto: data.monto,
        categoria: data.categoria,
        descripcion: data.descripcion,
      };

      if (data.fecha) {
        updateData.fecha = new Date(data.fecha);
      }

      return await this.prisma.gasto.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando gasto:', error);
      throw new BadRequestException('No se pudo actualizar el gasto.');
    }
  }

  /** Eliminar un gasto */
  async remove(id: string): Promise<Gasto> {
    const existe = await this.prisma.gasto.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un gasto con el ID ${id}`);
    }

    try {
      return await this.prisma.gasto.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      throw new BadRequestException('No se pudo eliminar el gasto.');
    }
  }
}
