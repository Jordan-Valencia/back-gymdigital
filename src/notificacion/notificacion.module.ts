import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificacionService],
  controllers: [NotificacionController],
  exports: [NotificacionService],
})
export class NotificacionModule {}
