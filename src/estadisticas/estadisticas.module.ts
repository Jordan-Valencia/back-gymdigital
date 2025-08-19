// src/estadisticas/estadisticas.module.ts
import { Module } from '@nestjs/common'
import { EstadisticasService } from './estadisticas.service'
import { EstadisticasController } from './estadisticas.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
  exports: [EstadisticasService],
})
export class EstadisticasModule {}
