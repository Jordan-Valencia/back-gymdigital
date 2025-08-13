import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    try {
      const hoy = new Date();
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      // Ejecutamos consultas en paralelo
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

        // Eventos próximos (fecha futura)
        this.prisma.evento.count({
          where: { fecha_inicio: { gt: hoy } }
        }),

        // Inventario solo con cantidad y stock_minimo
        this.prisma.itemInventario.findMany({
          select: { cantidad: true, stock_minimo: true }
        })
      ]);

      // Calcular inventario bajo
      const inventarioBajo = inventarioList.filter(
        item => item.cantidad <= item.stock_minimo
      ).length;

      return {
        miembrosActivos,
        ingresosMes: ingresosMesAgg._sum.total ?? 0, // manejo de null
        ventasHoy,
        entrenadores,
        eventosProximos,
        inventarioBajo
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener las estadísticas del dashboard'
      );
    }
  }
}
