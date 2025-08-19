// src/estadisticas/estadisticas.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadisticasService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerEstadisticasFinancieras(fechaInicio?: Date, fechaFin?: Date) {
        const ingresos = await this.prisma.membresia.aggregate({
            where: {
                AND: [
                    {
                        fecha_pago: {
                            gte: fechaInicio ?? new Date('1970-01-01'),
                        },
                    },
                    { fecha_pago: { lte: fechaFin ?? new Date() } },
                ],
            },
            _sum: { precio_pagado: true },
        });

        const gastosDetallados = await this.prisma.gastoDetallado.aggregate({
            where: {
                AND: [
                    { fecha: { gte: fechaInicio ?? new Date('1970-01-01') } },
                    { fecha: { lte: fechaFin ?? new Date() } },
                ],
            },
            _sum: { monto: true },
        });

        const nominas = await this.prisma.nomina.aggregate({
            where: {
                AND: [
                    { año: { gte: fechaInicio?.getFullYear() ?? 1970 } },
                    {
                        año: {
                            lte:
                                fechaFin?.getFullYear() ??
                                new Date().getFullYear(),
                        },
                    },
                ],
            },
            _sum: { total_pagar: true },
        });

        return {
            ingresos: ingresos._sum.precio_pagado ?? 0,
            gastos:
                (gastosDetallados._sum.monto ?? 0) +
                (nominas._sum.total_pagar ?? 0),
            utilidad:
                (ingresos._sum.precio_pagado ?? 0) -
                (gastosDetallados._sum.monto ?? 0) -
                (nominas._sum.total_pagar ?? 0),
        };
    }
    // src/estadisticas/estadisticas.service.ts (agregar estos métodos)

    async obtenerEstadisticasCompletas(fechaInicio?: Date, fechaFin?: Date) {
        const fechaInicioReal =
            fechaInicio ?? new Date(new Date().getFullYear(), 0, 1);
        const fechaFinReal = fechaFin ?? new Date();

        const [
            ingresosMembresías,
            ingresosVentas,
            ingresosAdicionales,
            gastosDetallados,
            nominas,
            membresiasActivas,
            membresiasPorVencer,
            membresiasVencidas,
        ] = await Promise.all([
            this.prisma.membresia.aggregate({
                where: {
                    fecha_pago: { gte: fechaInicioReal, lte: fechaFinReal },
                },
                _sum: { precio_pagado: true },
                _count: { id: true },
            }),
            this.prisma.venta.aggregate({
                where: {
                    fecha_venta: { gte: fechaInicioReal, lte: fechaFinReal },
                },
                _sum: { total: true },
                _count: { id: true },
            }),
            this.prisma.ingresoAdicional.aggregate({
                where: {
                    fecha: { gte: fechaInicioReal, lte: fechaFinReal },
                },
                _sum: { monto: true },
                _count: { id: true },
            }),
            this.prisma.gastoDetallado.aggregate({
                where: {
                    fecha: { gte: fechaInicioReal, lte: fechaFinReal },
                },
                _sum: { monto: true },
                _count: { id: true },
            }),
            this.prisma.nomina.aggregate({
                _sum: { total_pagar: true },
                _count: { id: true },
            }),
            this.prisma.membresia.count({
                where: {
                    fecha_fin: { gt: new Date() },
                },
            }),
            this.prisma.membresia.count({
                where: {
                    fecha_fin: {
                        gt: new Date(),
                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
                    },
                },
            }),
            this.prisma.membresia.count({
                where: {
                    fecha_fin: { lt: new Date() },
                },
            }),
        ]);

        const totalIngresos =
            (ingresosMembresías._sum.precio_pagado || 0) +
            (ingresosVentas._sum.total || 0) +
            (ingresosAdicionales._sum.monto || 0);

        const totalGastos =
            (gastosDetallados._sum.monto || 0) +
            (nominas._sum.total_pagar || 0);
        const utilidadNeta = totalIngresos - totalGastos;

        return {
            periodo: {
                fechaInicio: fechaInicioReal,
                fechaFin: fechaFinReal,
            },
            ingresos: {
                total: totalIngresos,
                membresias: ingresosMembresías._sum.precio_pagado || 0,
                ventas: ingresosVentas._sum.total || 0,
                adicionales: ingresosAdicionales._sum.monto || 0,
            },
            gastos: {
                total: totalGastos,
                detallados: gastosDetallados._sum.monto || 0,
                nomina: nominas._sum.total_pagar || 0,
            },
            utilidadNeta,
            margenUtilidad:
                totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0,
            estadisticasGenerales: {
                membresiasActivas,
                membresiasPorVencer,
                membresiasVencidas,
                totalTransacciones:
                    (ingresosMembresías._count.id || 0) +
                    (ingresosVentas._count.id || 0) +
                    (ingresosAdicionales._count.id || 0),
            },
        };
    }

    async obtenerEstadisticasDashboard() {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

        const [estadisticasMesActual, estadisticasMesAnterior] =
            await Promise.all([
                this.obtenerEstadisticasCompletas(inicioMes, hoy),
                this.obtenerEstadisticasCompletas(mesAnterior, finMesAnterior),
            ]);

        // Calcular crecimiento
        const crecimientoIngresos =
            estadisticasMesAnterior.ingresos.total > 0
                ? ((estadisticasMesActual.ingresos.total -
                      estadisticasMesAnterior.ingresos.total) /
                      estadisticasMesAnterior.ingresos.total) *
                  100
                : 0;

        return {
            mesActual: estadisticasMesActual,
            mesAnterior: estadisticasMesAnterior,
            crecimiento: {
                ingresos: crecimientoIngresos,
                gastos:
                    estadisticasMesAnterior.gastos.total > 0
                        ? ((estadisticasMesActual.gastos.total -
                              estadisticasMesAnterior.gastos.total) /
                              estadisticasMesAnterior.gastos.total) *
                          100
                        : 0,
            },
        };
    }
    // src/estadisticas/estadisticas.service.ts (agregar)

    async obtenerIngresosDiarios(mes: number, año: number) {
        const fechaInicio = new Date(año, mes - 1, 1);
        const fechaFin = new Date(año, mes, 0);

        const [membresias, ventas, ingresosAdicionales] = await Promise.all([
            this.prisma.membresia.findMany({
                where: {
                    fecha_pago: {
                        gte: fechaInicio,
                        lte: fechaFin,
                    },
                },
            }),
            this.prisma.venta.findMany({
                where: {
                    fecha_venta: {
                        gte: fechaInicio,
                        lte: fechaFin,
                    },
                },
            }),
            this.prisma.ingresoAdicional.findMany({
                where: {
                    fecha: {
                        gte: fechaInicio,
                        lte: fechaFin,
                    },
                },
            }),
        ]);

        // Agrupar por días
        const diasDelMes = fechaFin.getDate();
        const ingresosPorDia = Array.from({ length: diasDelMes }, (_, i) => {
            const dia = i + 1;
            const fechaDia = new Date(año, mes - 1, dia);

            const ingresoMembresias = membresias
                .filter((m) => new Date(m.fecha_pago).getDate() === dia)
                .reduce((sum, m) => sum + m.precio_pagado, 0);

            const ingresoVentas = ventas
                .filter((v) => new Date(v.fecha_venta).getDate() === dia)
                .reduce((sum, v) => sum + v.total, 0);

            const ingresoAdicionales = ingresosAdicionales
                .filter((i) => new Date(i.fecha).getDate() === dia)
                .reduce((sum, i) => sum + i.monto, 0);

            return {
                dia,
                fecha: fechaDia,
                membresias: ingresoMembresias,
                ventas: ingresoVentas,
                adicionales: ingresoAdicionales,
                total: ingresoMembresias + ingresoVentas + ingresoAdicionales,
            };
        });

        return {
            mes,
            año,
            datos: ingresosPorDia,
            resumen: {
                totalMembresias: ingresosPorDia.reduce(
                    (sum, d) => sum + d.membresias,
                    0,
                ),
                totalVentas: ingresosPorDia.reduce(
                    (sum, d) => sum + d.ventas,
                    0,
                ),
                totalAdicionales: ingresosPorDia.reduce(
                    (sum, d) => sum + d.adicionales,
                    0,
                ),
                granTotal: ingresosPorDia.reduce((sum, d) => sum + d.total, 0),
            },
        };
    }
}
