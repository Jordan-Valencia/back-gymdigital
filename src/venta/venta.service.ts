import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Venta } from '@prisma/client';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear una venta */
  async create(data: CreateVentaDto): Promise<Venta> {
    try {
      return await this.prisma.venta.create({
        data: {
          fecha_venta: new Date(data.fecha_venta),
          total: data.total,
          metodo_pago: data.metodo_pago,
          notas: data.notas,
          Usuario: data.usuario_id ? { connect: { id: data.usuario_id } } : undefined,
        },
      });
    } catch (error) {
      console.error('Error creando venta:', error);
      throw new BadRequestException('No se pudo crear la venta. Verifica los datos.');
    }
  }

  /** Listar ventas */
  async findAll(): Promise<Venta[]> {
    return this.prisma.venta.findMany({
      orderBy: { fecha_venta: 'desc' },
      include: { Usuario: true }, // así el frontend sabe quién hizo la compra
    });
  }

  /** Buscar venta por ID */
  async findOne(id: string): Promise<Venta> {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      include: { Usuario: true },
    });
    if (!venta) {
      throw new NotFoundException(`No se encontró una venta con el ID ${id}`);
    }
    return venta;
  }

  /** Actualizar venta */
  async update(id: string, data: UpdateVentaDto): Promise<Venta> {
    const existe = await this.prisma.venta.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una venta con el ID ${id}`);
    }

    try {
      const { usuario_id, fecha_venta, ...rest } = data;
      const updateData: Prisma.VentaUpdateInput = { ...rest };

      if (fecha_venta) {
        updateData.fecha_venta = new Date(fecha_venta);
      }
      if (usuario_id) {
        updateData.Usuario = { connect: { id: usuario_id } };
      }

      return await this.prisma.venta.update({
        where: { id },
        data: updateData,
        include: { Usuario: true },
      });
    } catch (error) {
      console.error('Error actualizando venta:', error);
      throw new BadRequestException('No se pudo actualizar la venta.');
    }
  }

  /** Eliminar venta */
  async remove(id: string): Promise<Venta> {
    const existe = await this.prisma.venta.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una venta con el ID ${id}`);
    }

    try {
      return await this.prisma.venta.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando venta:', error);
      throw new BadRequestException('No se pudo eliminar la venta.');
    }
  }
}
