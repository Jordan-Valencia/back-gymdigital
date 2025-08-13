import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, DetalleVenta } from '@prisma/client';
import { CreateDetalleVentaDto } from './dto/create-detalleventa.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalleventa.dto';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const createData: Prisma.DetalleVentaCreateInput = {
      id: data.id,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      subtotal: data.subtotal,
      Venta: { connect: { id: data.venta_id } },
      Producto: { connect: { id: data.producto_id } },
    };
    return this.prisma.detalleVenta.create({ data: createData });
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.prisma.detalleVenta.findMany();
  }

  async findOne(id: string): Promise<DetalleVenta | null> {
    return this.prisma.detalleVenta.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const updateData: Prisma.DetalleVentaUpdateInput = { ...data };

    if (data.venta_id) {
      updateData.Venta = { connect: { id: data.venta_id } };
      delete updateData.Venta;
    }
    if (data.producto_id) {
      updateData.Producto = { connect: { id: data.producto_id } };
      delete updateData.Producto;
    }
    return this.prisma.detalleVenta.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<DetalleVenta> {
    return this.prisma.detalleVenta.delete({ where: { id } });
  }
}
