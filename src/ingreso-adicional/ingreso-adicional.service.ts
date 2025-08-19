// src/ingresos-adicionales/ingresos-adicionales.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateIngresoAdicionalDto } from './dto/create-ingreso-adicional.dto'
import { UpdateIngresoAdicionalDto } from './dto/update-ingreso-adicional.dto'
import { IngresoAdicional } from '@prisma/client'

@Injectable()
export class IngresosAdicionalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<IngresoAdicional[]> {
    return this.prisma.ingresoAdicional.findMany({
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async create(createIngresoAdicionalDto: CreateIngresoAdicionalDto): Promise<IngresoAdicional> {
    const { fecha, ...rest } = createIngresoAdicionalDto
    
    return this.prisma.ingresoAdicional.create({
      data: {
        ...rest,
        fecha: new Date(fecha),
        fecha_registro: new Date()
      }
    })
  }

  async findOne(id: string): Promise<IngresoAdicional> {
    const ingreso = await this.prisma.ingresoAdicional.findUnique({
      where: { id }
    })

    if (!ingreso) {
      throw new NotFoundException(`Ingreso adicional con ID ${id} no encontrado`)
    }

    return ingreso
  }

  async update(id: string, updateIngresoAdicionalDto: UpdateIngresoAdicionalDto): Promise<IngresoAdicional> {
    await this.findOne(id)

    const { fecha, ...rest } = updateIngresoAdicionalDto

    return this.prisma.ingresoAdicional.update({
      where: { id },
      data: {
        ...rest,
        ...(fecha && { fecha: new Date(fecha) })
      }
    })
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    
    await this.prisma.ingresoAdicional.delete({
      where: { id }
    })
  }

  // ===== MÉTODOS ADICIONALES =====

  async findByCategoria(categoria: string): Promise<IngresoAdicional[]> {
    return this.prisma.ingresoAdicional.findMany({
      where: { categoria },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async findByPeriodo(fechaInicio: Date, fechaFin: Date): Promise<IngresoAdicional[]> {
    return this.prisma.ingresoAdicional.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async findByMetodoPago(metodoPago: string): Promise<IngresoAdicional[]> {
    return this.prisma.ingresoAdicional.findMany({
      where: { metodo_pago: metodoPago },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async getEstadisticasPorCategoria() {
    const estadisticas = await this.prisma.ingresoAdicional.groupBy({
      by: ['categoria'],
      _sum: {
        monto: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          monto: 'desc'
        }
      }
    })

    return estadisticas.map(stat => ({
      categoria: stat.categoria,
      totalMonto: stat._sum.monto || 0,
      cantidad: stat._count.id,
      promedio: stat._count.id > 0 ? (stat._sum.monto || 0) / stat._count.id : 0
    }))
  }

  async getEstadisticasPorMes(año: number) {
    const estadisticas = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM fecha) as mes,
        SUM(monto) as total_monto,
        COUNT(*) as cantidad
      FROM ingresos_adicionales 
      WHERE EXTRACT(YEAR FROM fecha) = ${año}
      GROUP BY EXTRACT(MONTH FROM fecha)
      ORDER BY mes
    ` as Array<{
      mes: number;
      total_monto: number;
      cantidad: number;
    }>

    return estadisticas
  }

  async getTotalPorPeriodo(fechaInicio: Date, fechaFin: Date) {
    const resultado = await this.prisma.ingresoAdicional.aggregate({
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
      totalMonto: resultado._sum.monto || 0,
      cantidad: resultado._count.id,
      promedio: resultado._count.id > 0 ? (resultado._sum.monto || 0) / resultado._count.id : 0
    }
  }

  async getCategoriasDisponibles(): Promise<string[]> {
    const categorias = await this.prisma.ingresoAdicional.findMany({
      select: {
        categoria: true
      },
      distinct: ['categoria'],
      orderBy: {
        categoria: 'asc'
      }
    })

    return categorias.map(c => c.categoria)
  }

  async getMetodosPagoDisponibles(): Promise<string[]> {
    const metodos = await this.prisma.ingresoAdicional.findMany({
      select: {
        metodo_pago: true
      },
      distinct: ['metodo_pago'],
      orderBy: {
        metodo_pago: 'asc'
      }
    })

    return metodos.map(m => m.metodo_pago)
  }
}
