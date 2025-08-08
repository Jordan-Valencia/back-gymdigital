import { Module } from '@nestjs/common';
import { HoraTrabajadaService } from './horatrabajada.service';
import { HoraTrabajadaController } from './horatrabajada.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HoraTrabajadaService],
  controllers: [HoraTrabajadaController],
  exports: [HoraTrabajadaService],
})
export class HoraTrabajadaModule {}
