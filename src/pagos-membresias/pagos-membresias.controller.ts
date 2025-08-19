// src/pagos-membresias/pagos-membresias.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PagosMembresiaService } from './pagos-membresias.service';
import { CreatePagoMembresiaDto } from './dto/create-pagos-membresia.dto';
import { UpdatePagoMembresiaDto } from './dto/update-pagos-membresia.dto';

@Controller()
export class PagosMembresiaController {
    constructor(
        private readonly pagosMembresiaService: PagosMembresiaService,
    ) {}

    // ===== ENDPOINTS PAGOS MEMBRESÍAS =====

    @Get('pagos-membresias')
    async findAll() {
        return this.pagosMembresiaService.findAll();
    }

    @Post('pagos-membresias')
    async create(@Body() createPagoMembresiaDto: CreatePagoMembresiaDto) {
        return this.pagosMembresiaService.create(createPagoMembresiaDto);
    }

    @Get('pagos-membresias/:id')
    async findOne(@Param('id') id: string) {
        return this.pagosMembresiaService.findOne(id);
    }

    @Put('pagos-membresias/:id')
    async update(
        @Param('id') id: string,
        @Body() updatePagoMembresiaDto: UpdatePagoMembresiaDto,
    ) {
        return this.pagosMembresiaService.update(id, updatePagoMembresiaDto);
    }
    @Delete('pagos-membresias/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.pagosMembresiaService.remove(id);
    }

    // ===== ENDPOINTS FACTURACIÓN =====

    @Get('membresias/por-vencer')
    async findMembresiasPorVencer(@Query('dias') dias?: string) {
        const diasNumber = dias ? parseInt(dias) : 7;
        return this.pagosMembresiaService.findMembresiasPorVencer(diasNumber);
    }

    @Get('membresias/vencidas')
    async findMembresiasVencidas() {
        return this.pagosMembresiaService.findMembresiasVencidas();
    }

    @Get('pagos-membresias/periodo')
    async findPagosPorPeriodo(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.pagosMembresiaService.findPagosPorPeriodo(
            new Date(fechaInicio),
            new Date(fechaFin),
        );
    }

    @Get('pagos-membresias/estado/:estado')
    async findPagosPorEstado(@Param('estado') estado: string) {
        return this.pagosMembresiaService.findPagosPorEstado(estado);
    }
}
