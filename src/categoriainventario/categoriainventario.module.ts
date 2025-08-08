import { Module } from '@nestjs/common';
import { CategoriaInventarioService } from './categoriainventario.service';
import { CategoriaInventarioController} from './categoriainventario.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CategoriaInventarioService],
  controllers: [CategoriaInventarioController],
  exports: [CategoriaInventarioService],
})
export class CategoriaInventarioModule {}
