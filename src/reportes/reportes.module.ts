// src/reportes/reportes.module.ts
import { Module } from '@nestjs/common'
import { ReportesService } from './reportes.service'
import { ReportesController } from './reportes.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [ReportesService],
  controllers: [ReportesController],
  exports: [ReportesService],
})
export class ReportesModule {}
