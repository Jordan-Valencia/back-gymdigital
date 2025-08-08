import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Usuario } from '../../generated/prisma';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const createData: Prisma.UsuarioCreateInput = {
      ...data,
      fecha_registro: new Date(),
    };
    return this.prisma.usuario.create({ data: createData });
  }

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Usuario> {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
