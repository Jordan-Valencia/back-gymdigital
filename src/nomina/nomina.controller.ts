// src/nomina/nomina.controller.ts
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
import { NominaService } from './nomina.service'
import { CreateNominaDto } from './dto/create-nomina.dto'
import { UpdateNominaDto } from './dto/update-nomina.dto'
import { CreateHorasEntrenadorDto } from './dto/create-horas-entrenador.dto'
import { UpdateHorasEntrenadorDto } from './dto/update-horas-entrenador.dto'

@Controller()
export class NominaController {
  constructor(private readonly nominaService: NominaService) {}

  // ===== ENDPOINTS NÓMINA =====

  @Get('nomina')
  async findAllNominas() {
    return this.nominaService.findAllNominas()
  }

  @Post('nomina')
  async createNomina(@Body() createNominaDto: CreateNominaDto) {
    return this.nominaService.createNomina(createNominaDto)
  }

  @Get('nomina/:id')
  async findNominaById(@Param('id') id: string) {
    return this.nominaService.findNominaById(id)
  }

  @Put('nomina/:id')
  async updateNomina(
    @Param('id') id: string,
    @Body() updateNominaDto: UpdateNominaDto
  ) {
    return this.nominaService.updateNomina(id, updateNominaDto)
  }

  @Delete('nomina/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNomina(@Param('id') id: string) {
    return this.nominaService.removeNomina(id)
  }

  // ===== ENDPOINTS HORAS ENTRENADOR =====

  @Get('horas-entrenador')
  async findAllHorasEntrenador() {
    return this.nominaService.findAllHorasEntrenador()
  }

  @Post('horas-entrenador')
  async createHorasEntrenador(@Body() createHorasEntrenadorDto: CreateHorasEntrenadorDto) {
    return this.nominaService.createHorasEntrenador(createHorasEntrenadorDto)
  }

  @Get('horas-entrenador/:id')
  async findHorasEntrenadorById(@Param('id') id: string) {
    return this.nominaService.findHorasEntrenadorById(id)
  }

  @Put('horas-entrenador/:id')
  async updateHorasEntrenador(
    @Param('id') id: string,
    @Body() updateHorasEntrenadorDto: UpdateHorasEntrenadorDto
  ) {
    return this.nominaService.updateHorasEntrenador(id, updateHorasEntrenadorDto)
  }

  @Delete('horas-entrenador/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeHorasEntrenador(@Param('id') id: string) {
    return this.nominaService.removeHorasEntrenador(id)
  }

  // ===== ENDPOINTS ADICIONALES =====

  @Get('nomina/entrenador/:entrenadorId')
  async findNominasPorEntrenador(@Param('entrenadorId') entrenadorId: string) {
    return this.nominaService.findNominasPorEntrenador(entrenadorId)
  }

  @Get('nomina/periodo/:año')
  async findNominasPorPeriodo(
    @Param('año') año: string,
    @Query('mes') mes?: string
  ) {
    return this.nominaService.findNominasPorPeriodo(
      parseInt(año),
      mes ? parseInt(mes) : undefined
    )
  }

  @Get('horas-entrenador/entrenador/:entrenadorId')
  async findHorasPorEntrenador(
    @Param('entrenadorId') entrenadorId: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string
  ) {
    return this.nominaService.findHorasPorEntrenador(
      entrenadorId,
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined
    )
  }

  @Get('nomina/calcular-salario/:entrenadorId/:año/:mes')
  async calcularSalarioPorHoras(
    @Param('entrenadorId') entrenadorId: string,
    @Param('año') año: string,
    @Param('mes') mes: string
  ) {
    return this.nominaService.calcularSalarioPorHoras(
      entrenadorId,
      parseInt(año),
      parseInt(mes)
    )
  }
  // src/nomina/nomina.controller.ts (agregar)

@Get('nomina/estadisticas/:entrenadorId')
async getEstadisticasEntrenador(@Param('entrenadorId') entrenadorId: string) {
  return this.nominaService.getEstadisticasEntrenador(entrenadorId)
}

  @Get('nomina/pendientes')
  async findNominasPendientes() {
    return this.nominaService.findNominasPendientes()
  }
}
