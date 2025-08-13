import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ItemGaleria } from '@prisma/client';
import { CreateItemGaleriaDto } from './dto/create-itemgaleria.dto';
import { UpdateItemGaleriaDto } from './dto/update-itemgaleria.dto';

@Injectable()
export class ItemGaleriaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo elemento en la galería */
  async create(data: CreateItemGaleriaDto): Promise<ItemGaleria> {
    try {
      return await this.prisma.itemGaleria.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          ruta_imagen: data.ruta_imagen,
          fecha: new Date(data.fecha),
          fecha_registro: new Date(), // ✅ generado aquí automáticamente
        },
      });
    } catch (error) {
      console.error('Error creando ItemGaleria:', error);
      throw new BadRequestException('No se pudo crear el elemento de galería. Verifica los datos.');
    }
  }

  /** Listar todas las imágenes de galería */
  async findAll(): Promise<ItemGaleria[]> {
    return this.prisma.itemGaleria.findMany({
      orderBy: { fecha_registro: 'desc' },
    });
  }

  /** Buscar un ítem por ID */
  async findOne(id: string): Promise<ItemGaleria> {
    const item = await this.prisma.itemGaleria.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`No se encontró un elemento de galería con el ID ${id}`);
    }
    return item;
  }

  /** Actualizar un ítem por ID */
  async update(id: string, data: UpdateItemGaleriaDto): Promise<ItemGaleria> {
    const existe = await this.prisma.itemGaleria.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un elemento de galería con el ID ${id}`);
    }

    try {
      const updateData: Prisma.ItemGaleriaUpdateInput = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        ruta_imagen: data.ruta_imagen,
      };

      if (data.fecha) {
        updateData.fecha = new Date(data.fecha);
      }

      return await this.prisma.itemGaleria.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando ItemGaleria:', error);
      throw new BadRequestException('No se pudo actualizar el elemento de galería.');
    }
  }

  /** Eliminar un ítem por ID */
  async remove(id: string): Promise<ItemGaleria> {
    const existe = await this.prisma.itemGaleria.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un elemento de galería con el ID ${id}`);
    }

    try {
      return await this.prisma.itemGaleria.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando ItemGaleria:', error);
      throw new BadRequestException('No se pudo eliminar el elemento de galería.');
    }
  }
}
