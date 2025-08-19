// src/reportes/reportes.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GenerarReporteDto } from './dto/generar-reporte.dto'
import PDFDocument from 'pdfkit'
import * as ExcelJS from 'exceljs'

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  async generarReporteGeneral(filtros: GenerarReporteDto) {
    const fechaInicio = new Date(filtros.fechaInicio)
    const fechaFin = new Date(filtros.fechaFin)

    // Obtener ingresos
    const [membresias, ventas, ingresosAdicionales] = await Promise.all([
      this.prisma.membresia.findMany({
        where: {
          fecha_pago: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: { Usuario: true, Plan: true }
      }),
      this.prisma.venta.findMany({
        where: {
          fecha_venta: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: { Usuario: true, DetalleVenta: true }
      }),
      this.prisma.ingresoAdicional.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        }
      })
    ])

    // Obtener gastos
    const [gastosDetallados, nominas] = await Promise.all([
      this.prisma.gastoDetallado.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: { categoria: true }
      }),
      this.prisma.nomina.findMany({
        where: {
          AND: [
            { año: { gte: fechaInicio.getFullYear() } },
            { año: { lte: fechaFin.getFullYear() } }
          ]
        },
        include: { entrenador: true }
      })
    ])

    // Calcular totales
    const totalIngresoMembresias = membresias.reduce((sum, m) => sum + m.precio_pagado, 0)
    const totalIngresoVentas = ventas.reduce((sum, v) => sum + v.total, 0)
    const totalIngresosAdicionales = ingresosAdicionales.reduce((sum, i) => sum + i.monto, 0)
    const totalIngresos = totalIngresoMembresias + totalIngresoVentas + totalIngresosAdicionales

    const totalGastosDetallados = gastosDetallados.reduce((sum, g) => sum + g.monto, 0)
    const totalNomina = nominas.reduce((sum, n) => sum + n.total_pagar, 0)
    const totalGastos = totalGastosDetallados + totalNomina

    const utilidadNeta = totalIngresos - totalGastos

    return {
      periodo: {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      },
      resumen: {
        totalIngresos,
        totalGastos,
        utilidadNeta,
        margenUtilidad: totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0
      },
      ingresos: {
        membresias: {
          total: totalIngresoMembresias,
          cantidad: membresias.length,
          detalle: membresias
        },
        ventas: {
          total: totalIngresoVentas,
          cantidad: ventas.length,
          detalle: ventas
        },
        adicionales: {
          total: totalIngresosAdicionales,
          cantidad: ingresosAdicionales.length,
          detalle: ingresosAdicionales
        }
      },
      gastos: {
        detallados: {
          total: totalGastosDetallados,
          cantidad: gastosDetallados.length,
          detalle: gastosDetallados
        },
        nomina: {
          total: totalNomina,
          cantidad: nominas.length,
          detalle: nominas
        }
      }
    }
  }

  async generarReporteIngresos(filtros: GenerarReporteDto) {
    const fechaInicio = new Date(filtros.fechaInicio)
    const fechaFin = new Date(filtros.fechaFin)

    const [membresias, ventas, ingresosAdicionales] = await Promise.all([
      this.prisma.membresia.findMany({
        where: {
          fecha_pago: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: { Usuario: true, Plan: true }
      }),
      this.prisma.venta.findMany({
        where: {
          fecha_venta: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: { Usuario: true, DetalleVenta: { include: { Producto: true } } }
      }),
      this.prisma.ingresoAdicional.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        }
      })
    ])

    return {
      periodo: {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      },
      membresias,
      ventas,
      ingresosAdicionales,
      totales: {
        membresias: membresias.reduce((sum, m) => sum + m.precio_pagado, 0),
        ventas: ventas.reduce((sum, v) => sum + v.total, 0),
        adicionales: ingresosAdicionales.reduce((sum, i) => sum + i.monto, 0)
      }
    }
  }

  async generarReporteGastos(filtros: GenerarReporteDto) {
    const fechaInicio = new Date(filtros.fechaInicio)
    const fechaFin = new Date(filtros.fechaFin)

    const gastosDetallados = await this.prisma.gastoDetallado.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        },
        ...(filtros.categoriaId && { categoria_id: filtros.categoriaId })
      },
      include: { categoria: true }
    })

    const gastosPorCategoria = await this.prisma.gastoDetallado.groupBy({
      by: ['categoria_id'],
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      _sum: {
        monto: true
      },
      _count: {
        id: true
      }
    })

    return {
      periodo: {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      },
      gastosDetallados,
      gastosPorCategoria,
      total: gastosDetallados.reduce((sum, g) => sum + g.monto, 0)
    }
  }

  async generarReporteNomina(filtros: GenerarReporteDto) {
    const fechaInicio = new Date(filtros.fechaInicio)
    const fechaFin = new Date(filtros.fechaFin)

    const nominas = await this.prisma.nomina.findMany({
      where: {
        AND: [
          { año: { gte: fechaInicio.getFullYear() } },
          { año: { lte: fechaFin.getFullYear() } }
        ],
        ...(filtros.entrenadorId && { entrenador_id: filtros.entrenadorId })
      },
      include: { entrenador: true }
    })

    const horasTrabajadas = await this.prisma.horasEntrenador.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        },
        ...(filtros.entrenadorId && { entrenador_id: filtros.entrenadorId })
      },
      include: { entrenador: true }
    })

    return {
      periodo: {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      },
      nominas,
      horasTrabajadas,
      totales: {
        nomina: nominas.reduce((sum, n) => sum + n.total_pagar, 0),
        horas: horasTrabajadas.reduce((sum, h) => sum + h.horas, 0)
      }
    }
  }

  async exportarReporteExcel(tipo: string, filtros: any): Promise<Buffer> {
    let datos: any
    
    switch (tipo) {
      case 'general':
        datos = await this.generarReporteGeneral(filtros)
        break
      case 'ingresos':
        datos = await this.generarReporteIngresos(filtros)
        break
      case 'gastos':
        datos = await this.generarReporteGastos(filtros)
        break
      case 'nomina':
        datos = await this.generarReporteNomina(filtros)
        break
      default:
        throw new Error('Tipo de reporte no válido')
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Reporte ${tipo}`)

    // Configurar encabezados según el tipo de reporte
    if (tipo === 'general') {
      worksheet.addRow(['REPORTE FINANCIERO GENERAL'])
      worksheet.addRow(['Período:', `${filtros.fechaInicio} - ${filtros.fechaFin}`])
      worksheet.addRow([])
      worksheet.addRow(['RESUMEN'])
      worksheet.addRow(['Total Ingresos:', datos.resumen.totalIngresos])
      worksheet.addRow(['Total Gastos:', datos.resumen.totalGastos])
      worksheet.addRow(['Utilidad Neta:', datos.resumen.utilidadNeta])
      worksheet.addRow(['Margen de Utilidad:', `${datos.resumen.margenUtilidad.toFixed(2)}%`])
    }

    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
  }

  async exportarReportePDF(tipo: string, filtros: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        let datos: any
        
        switch (tipo) {
          case 'general':
            datos = await this.generarReporteGeneral(filtros)
            break
          case 'ingresos':
            datos = await this.generarReporteIngresos(filtros)
            break
          case 'gastos':
            datos = await this.generarReporteGastos(filtros)
            break
          case 'nomina':
            datos = await this.generarReporteNomina(filtros)
            break
          default:
            throw new Error('Tipo de reporte no válido')
        }

        const doc = new PDFDocument({ margin: 50 })
        const buffers: Buffer[] = []

        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        // Título
        doc.fontSize(20)
           .text(`REPORTE ${tipo.toUpperCase()}`, 50, 50, { align: 'center' })

        // Período
        doc.fontSize(12)
           .text(`Período: ${filtros.fechaInicio} - ${filtros.fechaFin}`, 50, 100)

        if (tipo === 'general') {
          doc.text('RESUMEN FINANCIERO:', 50, 140)
          doc.text(`Total Ingresos: $${datos.resumen.totalIngresos.toLocaleString('es-CO')}`, 50, 160)
          doc.text(`Total Gastos: $${datos.resumen.totalGastos.toLocaleString('es-CO')}`, 50, 180)
          doc.text(`Utilidad Neta: $${datos.resumen.utilidadNeta.toLocaleString('es-CO')}`, 50, 200)
          doc.text(`Margen: ${datos.resumen.margenUtilidad.toFixed(2)}%`, 50, 220)
        }

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}
