import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, HoraTrabajada } from '../../generated/prisma';
import { CreateHoraTrabajadaDto } from './dto/create-horatrabajada.dto';
import { UpdateHoraTrabajadaDto } from './dto/update-horatrabajada.dto';

@Injectable()
export class HoraTrabajadaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateHoraTrabajadaDto): Promise<HoraTrabajada> {
    const createData: Prisma.HoraTrabajadaCreateInput = {
      id: data.id,
      fecha: new Date(data.fecha),
      horas: data.horas,
      descripcion: data.descripcion,
      fecha_registro: new Date(data.fecha_registro),
      Entrenador: {
        connect: { id: data.entrenador_id },
      },
    };
    return this.prisma.horaTrabajada.create({ data: createData });
  }

  async findAll(): Promise<HoraTrabajada[]> {
    return this.prisma.horaTrabajada.findMany();
  }

  async findOne(id: string): Promise<HoraTrabajada | null> {
    return this.prisma.horaTrabajada.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateHoraTrabajadaDto): Promise<HoraTrabajada> {
    const updateData: Prisma.HoraTrabajadaUpdateInput = { ...data };

    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }
    if (data.fecha_registro) {
      updateData.fecha_registro = new Date(data.fecha_registro);
    }
    if (data.entrenador_id) {
      updateData.Entrenador = {
        connect: { id: data.entrenador_id },
      };
      delete updateData.Entrenador;
    }

    return this.prisma.horaTrabajada.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<HoraTrabajada> {
    return this.prisma.horaTrabajada.delete({ where: { id } });
  }
}
