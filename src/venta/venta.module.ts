import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VentaService],
  controllers: [VentaController],
  exports: [VentaService],
})
export class VentaModule {}
