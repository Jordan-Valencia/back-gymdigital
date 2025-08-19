// src/nomina/nomina.module.ts
import { Module } from '@nestjs/common'
import { NominaService } from './nomina.service'
import { NominaController } from './nomina.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [NominaController],
  providers: [NominaService],
  exports: [NominaService]
})
export class NominaModule {}
