import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CategoriaInventario } from '@prisma/client';
import { CreateCategoriaInventarioDto } from './dto/create-categoriainventario.dto';
import { UpdateCategoriaInventarioDto } from './dto/update-categoriainventario.dto';

@Injectable()
export class CategoriaInventarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoriaInventarioDto): Promise<CategoriaInventario> {
  return this.prisma.categoriaInventario.create({ data });
}


  async findAll(): Promise<CategoriaInventario[]> {
    return this.prisma.categoriaInventario.findMany();
  }

  async findOne(id: string): Promise<CategoriaInventario | null> {
    return this.prisma.categoriaInventario.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCategoriaInventarioDto): Promise<CategoriaInventario> {
    return this.prisma.categoriaInventario.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<CategoriaInventario> {
    return this.prisma.categoriaInventario.delete({ where: { id } });
  }
}
