// usuarios.module.ts
import { Module } from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import { UsuarioController } from './usuarios.controller';
import { PrismaModule } from '../prisma/prisma.module'; // ruta según tu estructura

@Module({
  imports: [PrismaModule],  // Importar aquí PrismaModule
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuariosModule {}
