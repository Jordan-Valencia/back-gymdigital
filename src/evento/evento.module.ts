import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventoService],
  controllers: [EventoController],
  exports: [EventoService],
})
export class EventoModule {}
