// src/gastos/gastos.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDetalladoDto } from './dto/create-gasto-detallado.dto';
import { UpdateGastoDetalladoDto } from './dto/update-gasto-detallado.dto';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';

@Controller()
export class GastosController {
    constructor(private readonly gastosService: GastosService) {}

    // ===== ENDPOINTS GASTOS DETALLADOS =====

    @Get('gastos-detallados')
    async findAllGastosDetallados() {
        return this.gastosService.findAllGastosDetallados();
    }

    @Post('gastos-detallados')
    async createGastoDetallado(
        @Body() createGastoDetalladoDto: CreateGastoDetalladoDto,
    ) {
        return this.gastosService.createGastoDetallado(createGastoDetalladoDto);
    }

    @Get('gastos-detallados/:id')
    async findGastoDetalladoById(@Param('id') id: string) {
        return this.gastosService.findGastoDetalladoById(id);
    }

    @Put('gastos-detallados/:id')
    async updateGastoDetallado(
        @Param('id') id: string,
        @Body() updateGastoDetalladoDto: UpdateGastoDetalladoDto,
    ) {
        return this.gastosService.updateGastoDetallado(
            id,
            updateGastoDetalladoDto,
        );
    }
    @Get('gastos-detallados/vencidos')
    async findGastosVencidos() {
        return this.gastosService.findGastosPorEstado('VENCIDO');
    }

    @Get('gastos-detallados/pendientes')
    async findGastosPendientes() {
        return this.gastosService.findGastosPorEstado('PENDIENTE');
    }
    @Delete('gastos-detallados/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeGastoDetallado(@Param('id') id: string) {
        return this.gastosService.removeGastoDetallado(id);
    }
    @Get('gasto')
    async findAllGastosSimples() {
        return this.gastosService.findAllGastosSimples();
    }

    @Post('gasto')
    async createGastoSimple(@Body() createGastoDto: any) {
        return this.gastosService.createGastoSimple(createGastoDto);
    }
    // ===== ENDPOINTS CATEGORÍAS DE GASTOS =====

    @Get('categorias-gastos')
    async findAllCategoriasGastos() {
        return this.gastosService.findAllCategoriasGastos();
    }

    @Post('categorias-gastos')
    async createCategoriaGasto(
        @Body() createCategoriaGastoDto: CreateCategoriaGastoDto,
    ) {
        return this.gastosService.createCategoriaGasto(createCategoriaGastoDto);
    }

    @Get('categorias-gastos/:id')
    async findCategoriaGastoById(@Param('id') id: string) {
        return this.gastosService.findCategoriaGastoById(id);
    }

    @Put('categorias-gastos/:id')
    async updateCategoriaGasto(
        @Param('id') id: string,
        @Body() updateCategoriaGastoDto: UpdateCategoriaGastoDto,
    ) {
        return this.gastosService.updateCategoriaGasto(
            id,
            updateCategoriaGastoDto,
        );
    }

    @Delete('categorias-gastos/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeCategoriaGasto(@Param('id') id: string) {
        return this.gastosService.removeCategoriaGasto(id);
    }

    // ===== ENDPOINTS ADICIONALES =====

    @Get('gastos-detallados/categoria/:categoriaId')
    async findGastosPorCategoria(@Param('categoriaId') categoriaId: string) {
        return this.gastosService.findGastosPorCategoria(categoriaId);
    }

    @Get('gastos-detallados/estado/:estado')
    async findGastosPorEstado(@Param('estado') estado: string) {
        return this.gastosService.findGastosPorEstado(estado);
    }

    @Get('gastos-detallados/periodo')
    async findGastosPorPeriodo(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.gastosService.findGastosPorPeriodo(
            new Date(fechaInicio),
            new Date(fechaFin),
        );
    }
}
