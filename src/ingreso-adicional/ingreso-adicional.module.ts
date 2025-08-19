// src/ingresos-adicionales/ingresos-adicionales.module.ts
import { Module } from '@nestjs/common'
import { IngresosAdicionalesService } from './ingreso-adicional.service'
import { IngresosAdicionalesController } from './ingreso-adicional.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [IngresosAdicionalesController],
  providers: [IngresosAdicionalesService],
  exports: [IngresosAdicionalesService]
})
export class IngresosAdicionalesModule {}
