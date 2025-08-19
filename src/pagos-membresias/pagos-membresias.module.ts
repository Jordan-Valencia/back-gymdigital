// src/pagos-membresias/pagos-membresias.module.ts
import { Module } from '@nestjs/common'
import { PagosMembresiaService } from './pagos-membresias.service'
import { PagosMembresiaController } from './pagos-membresias.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PagosMembresiaController],
  providers: [PagosMembresiaService],
  exports: [PagosMembresiaService]
})
export class PagosMembresiaModule {}
