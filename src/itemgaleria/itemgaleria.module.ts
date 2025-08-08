import { Module } from '@nestjs/common';
import { ItemGaleriaService } from './itemgaleria.service';
import { ItemGaleriaController } from './itemgaleria.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ItemGaleriaService],
  controllers: [ItemGaleriaController],
  exports: [ItemGaleriaService],
})
export class ItemGaleriaModule {}
