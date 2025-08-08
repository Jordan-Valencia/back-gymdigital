import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ItemInventario } from '../../generated/prisma';
import { CreateItemInventarioDto } from './dto/create-iteminventario.dto';
import { UpdateItemInventarioDto } from './dto/update-iteminventario.dto';

@Injectable()
export class ItemInventarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateItemInventarioDto): Promise<ItemInventario> {
    const createData: Prisma.ItemInventarioCreateInput = {
      id: data.id,
      nombre: data.nombre,
      cantidad: data.cantidad,
      stock_minimo: data.stock_minimo,
      precio_unitario: data.precio_unitario,
      descripcion: data.descripcion,
      fecha_registro: new Date(data.fecha_registro),
      CategoriaInventario: {
        connect: { id: data.categoria_id },
      },
    };
    return this.prisma.itemInventario.create({ data: createData });
  }

  async findAll(): Promise<ItemInventario[]> {
    return this.prisma.itemInventario.findMany();
  }

  async findOne(id: string): Promise<ItemInventario | null> {
    return this.prisma.itemInventario.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateItemInventarioDto): Promise<ItemInventario> {
  const { categoria_id, fecha_registro, ...rest } = data;
  const updateData: Prisma.ItemInventarioUpdateInput = {
    ...rest,
  };

  if (fecha_registro) {
    updateData.fecha_registro = new Date(fecha_registro);
  }

  if (categoria_id) {
    updateData.CategoriaInventario = {
      connect: { id: categoria_id },
    };
  }

  return this.prisma.itemInventario.update({
    where: { id },
    data: updateData,
  });
}




  async remove(id: string): Promise<ItemInventario> {
    return this.prisma.itemInventario.delete({ where: { id } });
  }
}
