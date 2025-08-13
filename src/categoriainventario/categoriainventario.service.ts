import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CategoriaInventario } from '@prisma/client';
import { CreateCategoriaInventarioDto } from './dto/create-categoriainventario.dto';
import { UpdateCategoriaInventarioDto } from './dto/update-categoriainventario.dto';

@Injectable()
export class CategoriaInventarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear una nueva categoría de inventario */
  async create(data: CreateCategoriaInventarioDto): Promise<CategoriaInventario> {
    try {
      return await this.prisma.categoriaInventario.create({ data });
    } catch (error) {
      console.error('Error creando categoría de inventario:', error);
      throw new BadRequestException('No se pudo crear la categoría. Verifica los datos enviados.');
    }
  }

  /** Listar todas las categorías */
  async findAll(): Promise<CategoriaInventario[]> {
    return this.prisma.categoriaInventario.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Buscar una categoría por ID */
  async findOne(id: string): Promise<CategoriaInventario> {
    const categoria = await this.prisma.categoriaInventario.findUnique({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }
    return categoria;
  }

  /** Actualizar una categoría */
  async update(id: string, data: UpdateCategoriaInventarioDto): Promise<CategoriaInventario> {
    const existe = await this.prisma.categoriaInventario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    try {
      return await this.prisma.categoriaInventario.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error actualizando categoría de inventario:', error);
      throw new BadRequestException('No se pudo actualizar la categoría.');
    }
  }

  /** Eliminar una categoría */
  async remove(id: string): Promise<CategoriaInventario> {
    const existe = await this.prisma.categoriaInventario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    try {
      // Opcional: verificar si hay items asociados a esta categoría
      const itemsAsociados = await this.prisma.itemInventario.count({
        where: { categoria_id: id },
      });
      if (itemsAsociados > 0) {
        throw new BadRequestException(
          'No se puede eliminar la categoría porque tiene items asociados.'
        );
      }

      return await this.prisma.categoriaInventario.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando categoría de inventario:', error);
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('No se pudo eliminar la categoría.');
    }
  }
}
