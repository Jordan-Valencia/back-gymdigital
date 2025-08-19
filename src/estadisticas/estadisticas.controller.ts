// src/estadisticas/estadisticas.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) {}
    // src/estadisticas/estadisticas.controller.ts (reemplazar el método existente)

    @Get('financieras')
    async obtenerEstadisticasFinancieras(
        @Query('inicio') inicio?: string,
        @Query('fin') fin?: string,
    ) {
        const fechaInicio = inicio ? new Date(inicio) : undefined;
        const fechaFin = fin ? new Date(fin) : undefined;
        return this.estadisticasService.obtenerEstadisticasCompletas(
            fechaInicio,
            fechaFin,
        );
    }

    @Get('dashboard')
    async obtenerEstadisticasDashboard() {
        return this.estadisticasService.obtenerEstadisticasDashboard();
    }
    // src/estadisticas/estadisticas.controller.ts (agregar)

    @Get('ingresos-diarios')
    async obtenerIngresosDiarios(
        @Query('mes') mes?: string,
        @Query('año') año?: string,
    ) {
        return this.estadisticasService.obtenerIngresosDiarios(
            mes ? parseInt(mes) : new Date().getMonth() + 1,
            año ? parseInt(año) : new Date().getFullYear(),
        );
    }
}
