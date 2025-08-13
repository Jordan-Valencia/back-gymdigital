import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() data: CreatePlanDto): Promise<Plan> {
    return this.planService.create(data);
  }

  @Get()
  findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Plan | null> {
    return this.planService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePlanDto): Promise<Plan> {
    return this.planService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Plan> {
    return this.planService.remove(id);
  }
}
