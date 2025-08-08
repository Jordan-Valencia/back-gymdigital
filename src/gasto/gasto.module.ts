import { Module } from '@nestjs/common';
import { GastoService } from './gasto.service';
import { GastoController } from './gasto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GastoService],
  controllers: [GastoController],
  exports: [GastoService],
})
export class GastoModule {}
