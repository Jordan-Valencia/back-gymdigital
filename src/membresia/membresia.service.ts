import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta según tu estructura
import { Prisma, Membresia } from '@prisma/client';

@Injectable()
export class MembresiaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.MembresiaCreateInput): Promise<Membresia> {
    return this.prisma.membresia.create({ data });
  }

  async findAll(): Promise<Membresia[]> {
    return this.prisma.membresia.findMany();
  }

  async findOne(id: string): Promise<Membresia | null> {
    return this.prisma.membresia.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.MembresiaUpdateInput): Promise<Membresia> {
    return this.prisma.membresia.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Membresia> {
    return this.prisma.membresia.delete({ where: { id } });
  }
}
