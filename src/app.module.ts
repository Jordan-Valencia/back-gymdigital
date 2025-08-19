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
import { ItemGaleriaModule } from './itemgaleria/itemgaleria.module';
import { ItemInventarioModule } from './iteminventario/iteminventario.module';
import { PlanModule } from './plan/plan.module';
import { EventoModule } from './evento/evento.module';
import { VentaModule } from './venta/venta.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NominaModule } from './nomina/nomina.module';
import { TrelloModule } from './trello/trello.module';
import { GastosModule } from './gastos/gastos.module';
import { IngresosAdicionalesModule } from './ingreso-adicional/ingreso-adicional.module';
import { PagosMembresiaModule } from './pagos-membresias/pagos-membresias.module';
import { FacturasModule } from './generar-factura.dto.ts/generar-factura.dto.ts.module';
import { ReportesModule } from './reportes/reportes.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [UsuariosModule, ProductoModule, MembresiaModule, PrismaModule, CategoriaInventarioModule, DetalleVentaModule, EntrenadorModule, ItemGaleriaModule, ItemInventarioModule, PlanModule, EventoModule, VentaModule, NotificacionModule, DashboardModule, NominaModule, TrelloModule, GastosModule, IngresosAdicionalesModule, PagosMembresiaModule, FacturasModule, ReportesModule, EstadisticasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
