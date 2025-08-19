// src/gastos/gastos.module.ts
import { Module } from '@nestjs/common'
import { GastosService } from './gastos.service'
import { GastosController } from './gastos.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService]
})
export class GastosModule {}
