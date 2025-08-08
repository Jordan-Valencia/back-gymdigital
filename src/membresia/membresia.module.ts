import { Module } from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { MembresiaController } from './membresia.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembresiaController],
  providers: [MembresiaService],
})
export class MembresiaModule {}
