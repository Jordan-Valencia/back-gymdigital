// src/facturas/facturas.module.ts
import { Module } from '@nestjs/common'
import { FacturasService } from './generar-factura.dto.ts.service'
import { FacturasController } from './generar-factura.dto.ts.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService]
})
export class FacturasModule {}
