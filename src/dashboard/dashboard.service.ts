import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    // Ejecutamos consultas paralelas para que sea más rápido
    const [
      miembrosActivos,
      ingresosMesAgg,
      ventasHoy,
      entrenadores,
      eventosProximos,
      inventarioList
    ] = await Promise.all([
      // Usuarios activos
      this.prisma.usuario.count({ where: { activo: true } }),

      // Suma de ventas del mes
      this.prisma.venta.aggregate({
        _sum: { total: true },
        where: { fecha_venta: { gte: primerDiaMes } }
      }),

      // Ventas de hoy
      this.prisma.venta.count({
        where: { fecha_venta: { gte: inicioHoy } }
      }),

      // Entrenadores activos
      this.prisma.entrenador.count({ where: { activo: true } }),

      // Eventos próximos
      this.prisma.evento.count({
        where: { fecha_inicio: { gt: hoy } }
      }),

      // Inventario (traemos solo cantidad y stock_minimo)
      this.prisma.itemInventario.findMany({
        select: { cantidad: true, stock_minimo: true }
      })
    ]);

    // Calcular inventario bajo en JS
    const inventarioBajo = inventarioList.filter(
      item => item.cantidad <= item.stock_minimo
    ).length;

    return {
      miembrosActivos,
      ingresosMes: ingresosMesAgg._sum.total || 0,
      ventasHoy,
      entrenadores,
      eventosProximos,
      inventarioBajo
    };
  }
}
