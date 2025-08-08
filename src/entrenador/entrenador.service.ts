import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Entrenador } from '../../generated/prisma';
import { CreateEntrenadorDto } from './dto/create-entrenador.dto';
import { UpdateEntrenadorDto } from './dto/update-entrenador.dto';

@Injectable()
export class EntrenadorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEntrenadorDto): Promise<Entrenador> {
    const createData: Prisma.EntrenadorCreateInput = {
      id: data.id,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      especialidad: data.especialidad,
      tarifa_hora: data.tarifa_hora,
      fecha_registro: new Date(data.fecha_registro),
      activo: data.activo,
    };
    return this.prisma.entrenador.create({ data: createData });
  }

  async findAll(): Promise<Entrenador[]> {
    return this.prisma.entrenador.findMany();
  }

  async findOne(id: string): Promise<Entrenador | null> {
    return this.prisma.entrenador.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateEntrenadorDto): Promise<Entrenador> {
    const updateData: Prisma.EntrenadorUpdateInput = { ...data };

    if (data.fecha_registro) {
      updateData.fecha_registro = new Date(data.fecha_registro);
    }

    return this.prisma.entrenador.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Entrenador> {
    return this.prisma.entrenador.delete({ where: { id } });
  }
}
