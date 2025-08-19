import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { ReportesService } from './reportes.service'
import { GenerarReporteDto } from './dto/generar-reporte.dto'

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  async generarReporte(@Body() generarReporteDto: GenerarReporteDto) {
    switch (generarReporteDto.tipo) {
      case 'general':
        return this.reportesService.generarReporteGeneral(generarReporteDto)
      case 'ingresos':
        return this.reportesService.generarReporteIngresos(generarReporteDto)
      case 'gastos':
        return this.reportesService.generarReporteGastos(generarReporteDto)
      case 'nomina':
        return this.reportesService.generarReporteNomina(generarReporteDto)
      default:
        return { message: 'Tipo de reporte no soportado' }
    }
  }

  @Post('exportar/excel')
  async exportarExcel(
    @Body() body: { tipo: string; filtros: any },
    @Res() res: FastifyReply
  ) {
    try {
      const buffer = await this.reportesService.exportarReporteExcel(body.tipo, body.filtros)
      res
        .status(HttpStatus.OK)
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="reporte_${body.tipo}_${Date.now()}.xlsx"`)
        .header('Content-Length', buffer.length.toString())
        .send(buffer)
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error exportando Excel', error: error.message })
    }
  }

  @Post('exportar/pdf')
  async exportarPDF(
    @Body() body: { tipo: string; filtros: any },
    @Res() res: FastifyReply
  ) {
    try {
      const buffer = await this.reportesService.exportarReportePDF(body.tipo, body.filtros)
      res
        .status(HttpStatus.OK)
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', `attachment; filename="reporte_${body.tipo}_${Date.now()}.pdf"`)
        .header('Content-Length', buffer.length.toString())
        .send(buffer)
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error exportando PDF', error: error.message })
    }
  }
}
