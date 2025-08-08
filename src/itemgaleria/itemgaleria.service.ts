import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ItemGaleria } from '../../generated/prisma';
import { CreateItemGaleriaDto } from './dto/create-itemgaleria.dto';
import { UpdateItemGaleriaDto } from './dto/update-itemgaleria.dto';

@Injectable()
export class ItemGaleriaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateItemGaleriaDto): Promise<ItemGaleria> {
    const createData: Prisma.ItemGaleriaCreateInput = {
      id: data.id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      ruta_imagen: data.ruta_imagen,
      fecha: new Date(data.fecha),
      fecha_registro: new Date(data.fecha_registro),
    };
    return this.prisma.itemGaleria.create({ data: createData });
  }

  async findAll(): Promise<ItemGaleria[]> {
    return this.prisma.itemGaleria.findMany();
  }

  async findOne(id: string): Promise<ItemGaleria | null> {
    return this.prisma.itemGaleria.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateItemGaleriaDto): Promise<ItemGaleria> {
    const updateData: Prisma.ItemGaleriaUpdateInput = { ...data };

    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }
    if (data.fecha_registro) {
      updateData.fecha_registro = new Date(data.fecha_registro);
    }

    return this.prisma.itemGaleria.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<ItemGaleria> {
    return this.prisma.itemGaleria.delete({ where: { id } });
  }
}
