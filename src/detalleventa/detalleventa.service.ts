import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, DetalleVenta } from '@prisma/client';
import { CreateDetalleVentaDto } from './dto/create-detalleventa.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalleventa.dto';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo detalle de venta */
  async create(data: CreateDetalleVentaDto): Promise<DetalleVenta> {
    try {
      return await this.prisma.detalleVenta.create({
        data: {
          cantidad: data.cantidad,
          precio_unitario: data.precio_unitario,
          subtotal: data.subtotal,
          Venta: { connect: { id: data.venta_id } },
          Producto: { connect: { id: data.producto_id } },
        },
        include: { Venta: true, Producto: true },
      });
    } catch (error) {
      console.error('Error creando detalle de venta:', error);
      throw new BadRequestException('No se pudo crear el detalle de venta. Verifica los datos.');
    }
  }

  /** Listar todos los detalles */
  async findAll(): Promise<DetalleVenta[]> {
    return this.prisma.detalleVenta.findMany({
      include: { Venta: true, Producto: true },
      orderBy: { id: 'desc' },
    });
  }

  /** Buscar un detalle por ID */
  async findOne(id: string): Promise<DetalleVenta> {
    const detalle = await this.prisma.detalleVenta.findUnique({
      where: { id },
      include: { Venta: true, Producto: true },
    });
    if (!detalle) {
      throw new NotFoundException(`No se encontró un detalle de venta con ID ${id}`);
    }
    return detalle;
  }

  /** Actualizar un detalle por ID */
  async update(id: string, data: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const existe = await this.prisma.detalleVenta.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un detalle de venta con ID ${id}`);
    }

    try {
      const updateData: Prisma.DetalleVentaUpdateInput = {
        cantidad: data.cantidad,
        precio_unitario: data.precio_unitario,
        subtotal: data.subtotal,
      };

      if (data.venta_id) {
        updateData.Venta = { connect: { id: data.venta_id } };
      }
      if (data.producto_id) {
        updateData.Producto = { connect: { id: data.producto_id } };
      }

      return await this.prisma.detalleVenta.update({
        where: { id },
        data: updateData,
        include: { Venta: true, Producto: true },
      });
    } catch (error) {
      console.error('Error actualizando detalle de venta:', error);
      throw new BadRequestException('No se pudo actualizar el detalle de venta.');
    }
  }

  /** Eliminar un detalle de venta por ID */
  async remove(id: string): Promise<DetalleVenta> {
    const existe = await this.prisma.detalleVenta.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un detalle de venta con ID ${id}`);
    }

    try {
      return await this.prisma.detalleVenta.delete({
        where: { id },
        include: { Venta: true, Producto: true },
      });
    } catch (error) {
      console.error('Error eliminando detalle de venta:', error);
      throw new BadRequestException('No se pudo eliminar el detalle de venta.');
    }
  }
}
