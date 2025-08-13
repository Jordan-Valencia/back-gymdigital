import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ItemInventario } from '@prisma/client';
import { CreateItemInventarioDto } from './dto/create-iteminventario.dto';
import { UpdateItemInventarioDto } from './dto/update-iteminventario.dto';

@Injectable()
export class ItemInventarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo ítem de inventario */
  async create(data: CreateItemInventarioDto): Promise<ItemInventario> {
    try {
      return await this.prisma.itemInventario.create({
        data: {
          nombre: data.nombre,
          cantidad: data.cantidad,
          stock_minimo: data.stock_minimo,
          precio_unitario: data.precio_unitario,
          descripcion: data.descripcion,
          fecha_registro: new Date(), // ✅ Generado automáticamente
          CategoriaInventario: {
            connect: { id: data.categoria_id },
          },
        },
      });
    } catch (error) {
      console.error('Error creando ItemInventario:', error);
      throw new BadRequestException('No se pudo crear el ítem de inventario. Verifica los datos.');
    }
  }

  /** Listar todos los ítems */
  async findAll(): Promise<ItemInventario[]> {
    return this.prisma.itemInventario.findMany({
      orderBy: { fecha_registro: 'desc' },
      include: { CategoriaInventario: true },
    });
  }

  /** Buscar un ítem por ID */
  async findOne(id: string): Promise<ItemInventario> {
    const item = await this.prisma.itemInventario.findUnique({
      where: { id },
      include: { CategoriaInventario: true },
    });

    if (!item) {
      throw new NotFoundException(`No se encontró un ítem de inventario con el ID ${id}`);
    }
    return item;
  }

  /** Actualizar un ítem */
  async update(id: string, data: UpdateItemInventarioDto): Promise<ItemInventario> {
    const existe = await this.prisma.itemInventario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un ítem de inventario con el ID ${id}`);
    }

    try {
      const { categoria_id, fecha_registro, ...rest } = data;

      const updateData: Prisma.ItemInventarioUpdateInput = { ...rest };

      if (fecha_registro) {
        updateData.fecha_registro = new Date(fecha_registro);
      }

      if (categoria_id) {
        updateData.CategoriaInventario = {
          connect: { id: categoria_id },
        };
      }

      return await this.prisma.itemInventario.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando ItemInventario:', error);
      throw new BadRequestException('No se pudo actualizar el ítem de inventario.');
    }
  }

  /** Eliminar un ítem */
  async remove(id: string): Promise<ItemInventario> {
    const existe = await this.prisma.itemInventario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un ítem de inventario con el ID ${id}`);
    }

    try {
      return await this.prisma.itemInventario.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando ItemInventario:', error);
      throw new BadRequestException('No se pudo eliminar el ítem de inventario.');
    }
  }
}
