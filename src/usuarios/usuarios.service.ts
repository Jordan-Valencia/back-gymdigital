import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Usuario } from '@prisma/client';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un usuario */
  async create(data: CreateUsuarioDto): Promise<Usuario> {
    try {
      const createData: Prisma.UsuarioCreateInput = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        fecha_nacimiento: new Date(data.fecha_nacimiento), // Conversión segura a Date
        activo: data.activo,
        notas: data.notas,
        fecha_registro: new Date(), // Generada automáticamente
      };

      return await this.prisma.usuario.create({ data: createData });
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw new BadRequestException('No se pudo crear el usuario. Verifica los datos.');
    }
  }

  /** Listar todos los usuarios */
  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      orderBy: { fecha_registro: 'desc' },
    });
  }

  /** Buscar un usuario por ID */
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
    }
    return usuario;
  }

  /** Actualizar un usuario */
  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
    }

    try {
      const updateData: Prisma.UsuarioUpdateInput = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        activo: data.activo,
        notas: data.notas,
      };

      if (data.fecha_nacimiento) {
        updateData.fecha_nacimiento = new Date(data.fecha_nacimiento);
      }

      return await this.prisma.usuario.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new BadRequestException('No se pudo actualizar el usuario.');
    }
  }

  /** Eliminar un usuario */
  async remove(id: string): Promise<Usuario> {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
    }

    return this.prisma.usuario.delete({ where: { id } });
  }
}
