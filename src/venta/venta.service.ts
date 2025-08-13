import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Venta } from '@prisma/client';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVentaDto): Promise<Venta> {
    const createData: Prisma.VentaCreateInput = {
      id: data.id,
      fecha_venta: new Date(data.fecha_venta),
      total: data.total,
      metodo_pago: data.metodo_pago,
      notas: data.notas,
      Usuario: data.usuario_id ? { connect: { id: data.usuario_id } } : undefined,
    };
    return this.prisma.venta.create({ data: createData });
  }

  async findAll(): Promise<Venta[]> {
    return this.prisma.venta.findMany();
  }

  async findOne(id: string): Promise<Venta | null> {
    return this.prisma.venta.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateVentaDto): Promise<Venta> {
    const { usuario_id, fecha_venta, ...rest } = data;

    const updateData: Prisma.VentaUpdateInput = {
      ...rest,
    };

    if (fecha_venta) {
      updateData.fecha_venta = new Date(fecha_venta);
    }

    if (usuario_id) {
      updateData.Usuario = { connect: { id: usuario_id } };
    }

    return this.prisma.venta.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Venta> {
    return this.prisma.venta.delete({ where: { id } });
  }
}
