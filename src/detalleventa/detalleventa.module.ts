import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalleventa.service';
import { DetalleVentaController } from './detalleventa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DetalleVentaService],
  controllers: [DetalleVentaController],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
