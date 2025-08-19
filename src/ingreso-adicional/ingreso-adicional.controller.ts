// src/ingresos-adicionales/ingresos-adicionales.controller.ts
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
  HttpStatus
} from '@nestjs/common'
import { IngresosAdicionalesService } from './ingreso-adicional.service'
import { CreateIngresoAdicionalDto } from './dto/create-ingreso-adicional.dto'
import { UpdateIngresoAdicionalDto } from './dto/update-ingreso-adicional.dto'

@Controller('ingresos-adicionales')
export class IngresosAdicionalesController {
  constructor(private readonly ingresosAdicionalesService: IngresosAdicionalesService) {}

  @Get()
  async findAll() {
    return this.ingresosAdicionalesService.findAll()
  }

  @Post()
  async create(@Body() createIngresoAdicionalDto: CreateIngresoAdicionalDto) {
    return this.ingresosAdicionalesService.create(createIngresoAdicionalDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingresosAdicionalesService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngresoAdicionalDto: UpdateIngresoAdicionalDto
  ) {
    return this.ingresosAdicionalesService.update(id, updateIngresoAdicionalDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.ingresosAdicionalesService.remove(id)
  }

  // ===== ENDPOINTS ADICIONALES =====

  @Get('categoria/:categoria')
  async findByCategoria(@Param('categoria') categoria: string) {
    return this.ingresosAdicionalesService.findByCategoria(categoria)
  }

  @Get('periodo')
  async findByPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return this.ingresosAdicionalesService.findByPeriodo(
      new Date(fechaInicio),
      new Date(fechaFin)
    )
  }

  @Get('metodo-pago/:metodoPago')
  async findByMetodoPago(@Param('metodoPago') metodoPago: string) {
    return this.ingresosAdicionalesService.findByMetodoPago(metodoPago)
  }

  @Get('estadisticas/categorias')
  async getEstadisticasPorCategoria() {
    return this.ingresosAdicionalesService.getEstadisticasPorCategoria()
  }

  @Get('estadisticas/mes/:año')
  async getEstadisticasPorMes(@Param('año') año: string) {
    return this.ingresosAdicionalesService.getEstadisticasPorMes(parseInt(año))
  }

  @Get('estadisticas/total-periodo')
  async getTotalPorPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return this.ingresosAdicionalesService.getTotalPorPeriodo(
      new Date(fechaInicio),
      new Date(fechaFin)
    )
  }

  @Get('config/categorias')
  async getCategoriasDisponibles() {
    return this.ingresosAdicionalesService.getCategoriasDisponibles()
  }

  @Get('config/metodos-pago')
  async getMetodosPagoDisponibles() {
    return this.ingresosAdicionalesService.getMetodosPagoDisponibles()
  }
}
