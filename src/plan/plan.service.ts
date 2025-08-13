import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Plan } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crear un nuevo plan con validaciones */
  async create(data: CreatePlanDto): Promise<Plan> {
    try {
      // Validar campos obligatorios aquí también si lo consideras necesario
      if (!data.nombre || !data.descripcion || data.precio === undefined) {
        throw new BadRequestException('Faltan campos obligatorios para crear el plan.');
      }

      return await this.prisma.plan.create({
        data: {
          nombre: data.nombre.trim(),
          descripcion: data.descripcion.trim(),
          precio: data.precio,
        },
      });
    } catch (error) {
      console.error('Error creando plan:', error);
      throw new BadRequestException('No se pudo crear el plan. Verifica los datos enviados.');
    }
  }

  /** Listar todos los planes */
  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany();
  }

  /** Obtener un plan por su ID */
  async findOne(id: string): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`No se encontró un plan con el ID ${id}`);
    }
    return plan;
  }

  /** Actualizar un plan existente */
  async update(id: string, data: UpdatePlanDto): Promise<Plan> {
    const existe = await this.prisma.plan.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un plan con el ID ${id}`);
    }

    try {
      return await this.prisma.plan.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error actualizando plan:', error);
      throw new BadRequestException('No se pudo actualizar el plan. Verifica los datos enviados.');
    }
  }

  /** Eliminar un plan por su ID */
  async remove(id: string): Promise<Plan> {
    const existe = await this.prisma.plan.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró un plan con el ID ${id}`);
    }

    try {
      return await this.prisma.plan.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando plan:', error);
      throw new BadRequestException('No se pudo eliminar el plan.');
    }
  }
}
