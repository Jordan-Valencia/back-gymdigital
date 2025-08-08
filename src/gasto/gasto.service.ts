import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Gasto } from '../../generated/prisma';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Injectable()
export class GastoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGastoDto): Promise<Gasto> {
    const createData: Prisma.GastoCreateInput = {
      id: data.id,
      concepto: data.concepto,
      monto: data.monto,
      fecha: new Date(data.fecha),
      categoria: data.categoria,
      descripcion: data.descripcion,
      fecha_registro: new Date(data.fecha_registro),
    };
    return this.prisma.gasto.create({ data: createData });
  }

  async findAll(): Promise<Gasto[]> {
    return this.prisma.gasto.findMany();
  }

  async findOne(id: string): Promise<Gasto | null> {
    return this.prisma.gasto.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateGastoDto): Promise<Gasto> {
    const updateData: Prisma.GastoUpdateInput = { ...data };
    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }
    if (data.fecha_registro) {
      updateData.fecha_registro = new Date(data.fecha_registro);
    }
    return this.prisma.gasto.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Gasto> {
    return this.prisma.gasto.delete({ where: { id } });
  }
}
