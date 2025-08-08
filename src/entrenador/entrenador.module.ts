import { Module } from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { EntrenadorController } from './entrenador.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntrenadorService],
  controllers: [EntrenadorController],
  exports: [EntrenadorService],
})
export class EntrenadorModule {}
