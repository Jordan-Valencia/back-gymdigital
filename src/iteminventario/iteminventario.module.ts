import { Module } from '@nestjs/common';
import { ItemInventarioService } from './iteminventario.service';
import { ItemInventarioController } from './iteminventario.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ItemInventarioService],
  controllers: [ItemInventarioController],
  exports: [ItemInventarioService],
})
export class ItemInventarioModule {}
