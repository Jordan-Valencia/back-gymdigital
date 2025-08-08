import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Plan } from '../../generated/prisma';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({ data });
  }

  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany();
  }

  async findOne(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdatePlanDto): Promise<Plan> {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Plan> {
    return this.prisma.plan.delete({ where: { id } });
  }
}
