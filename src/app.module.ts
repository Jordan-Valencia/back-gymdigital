import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductoModule } from './producto/producto.module';
import { MembresiaModule } from './membresia/membresia.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriaInventarioModule } from './categoriainventario/categoriainventario.module';
import { DetalleVentaModule } from './detalleventa/detalleventa.module';
import { EntrenadorModule } from './entrenador/entrenador.module';
import { GastoModule } from './gasto/gasto.module';
import { ItemGaleriaModule } from './itemgaleria/itemgaleria.module';
import { ItemInventarioModule } from './iteminventario/iteminventario.module';
import { PlanModule } from './plan/plan.module';
import { EventoModule } from './evento/evento.module';
import { VentaModule } from './venta/venta.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [UsuariosModule, ProductoModule, MembresiaModule, PrismaModule, CategoriaInventarioModule, DetalleVentaModule, EntrenadorModule, GastoModule, ItemGaleriaModule, ItemInventarioModule, PlanModule, EventoModule, VentaModule, NotificacionModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
