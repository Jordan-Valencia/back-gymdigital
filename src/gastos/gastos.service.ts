// src/gastos/gastos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateGastoDetalladoDto } from './dto/create-gasto-detallado.dto'
import { UpdateGastoDetalladoDto } from './dto/update-gasto-detallado.dto'
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto'
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto'
import { GastoDetallado, CategoriaGasto } from '@prisma/client'

@Injectable()
export class GastosService {
  constructor(private prisma: PrismaService) {}

  // ===== GASTOS DETALLADOS =====
  
  async findAllGastosDetallados(): Promise<GastoDetallado[]> {
    return this.prisma.gastoDetallado.findMany({
      include: {
        categoria: true
      },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async createGastoDetallado(createGastoDetalladoDto: CreateGastoDetalladoDto): Promise<GastoDetallado> {
    const { fecha, fecha_vencimiento, ...rest } = createGastoDetalladoDto
    
    return this.prisma.gastoDetallado.create({
      data: {
        ...rest,
        fecha: new Date(fecha),
        fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
        fecha_registro: new Date()
      },
      include: {
        categoria: true
      }
    })
  }

  async findGastoDetalladoById(id: string): Promise<GastoDetallado> {
    const gasto = await this.prisma.gastoDetallado.findUnique({
      where: { id },
      include: {
        categoria: true
      }
    })

    if (!gasto) {
      throw new NotFoundException(`Gasto detallado con ID ${id} no encontrado`)
    }

    return gasto
  }

  async updateGastoDetallado(id: string, updateGastoDetalladoDto: UpdateGastoDetalladoDto): Promise<GastoDetallado> {
    await this.findGastoDetalladoById(id)

    const { fecha, fecha_vencimiento, ...rest } = updateGastoDetalladoDto

    return this.prisma.gastoDetallado.update({
      where: { id },
      data: {
        ...rest,
        ...(fecha && { fecha: new Date(fecha) }),
        ...(fecha_vencimiento && { fecha_vencimiento: new Date(fecha_vencimiento) })
      },
      include: {
        categoria: true
      }
    })
  }

  async removeGastoDetallado(id: string): Promise<void> {
    await this.findGastoDetalladoById(id)
    
    await this.prisma.gastoDetallado.delete({
      where: { id }
    })
  }

  // ===== CATEGORÍAS DE GASTOS =====

  async findAllCategoriasGastos(): Promise<CategoriaGasto[]> {
    return this.prisma.categoriaGasto.findMany({
      include: {
        gastos_detallados: {
          select: {
            id: true,
            concepto: true,
            monto: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    })
  }

  async createCategoriaGasto(createCategoriaGastoDto: CreateCategoriaGastoDto): Promise<CategoriaGasto> {
    return this.prisma.categoriaGasto.create({
      data: createCategoriaGastoDto
    })
  }

  async findCategoriaGastoById(id: string): Promise<CategoriaGasto> {
    const categoria = await this.prisma.categoriaGasto.findUnique({
      where: { id },
      include: {
        gastos_detallados: true
      }
    })

    if (!categoria) {
      throw new NotFoundException(`Categoría de gasto con ID ${id} no encontrada`)
    }

    return categoria
  }

  async updateCategoriaGasto(id: string, updateCategoriaGastoDto: UpdateCategoriaGastoDto): Promise<CategoriaGasto> {
    await this.findCategoriaGastoById(id)

    return this.prisma.categoriaGasto.update({
      where: { id },
      data: updateCategoriaGastoDto
    })
  }

  async removeCategoriaGasto(id: string): Promise<void> {
    const categoria = await this.findCategoriaGastoById(id)

    // Verificar si tiene gastos asociados
    const gastosAsociados = await this.prisma.gastoDetallado.count({
      where: { categoria_id: id }
    })

    if (gastosAsociados > 0) {
      throw new NotFoundException(
        `No se puede eliminar la categoría porque tiene ${gastosAsociados} gastos asociados`
      )
    }

    await this.prisma.categoriaGasto.delete({
      where: { id }
    })
  }

  // ===== MÉTODOS ADICIONALES =====

  async findGastosPorCategoria(categoriaId: string) {
    return this.prisma.gastoDetallado.findMany({
      where: { categoria_id: categoriaId },
      include: {
        categoria: true
      },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async findGastosPorEstado(estado: string) {
    return this.prisma.gastoDetallado.findMany({
      where: { estado: estado as any },
      include: {
        categoria: true
      },
      orderBy: {
        fecha: 'desc'
      }
    })
  }

  async findGastosPorPeriodo(fechaInicio: Date, fechaFin: Date) {
    return this.prisma.gastoDetallado.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      include: {
        categoria: true
      },
      orderBy: {
        fecha: 'desc'
      }
    })
  }
  // src/gastos/gastos.service.ts (agregar estos métodos)

async findAllGastosSimples() {
  // Si tienes tabla gastos separada de gastos_detallados
  return this.prisma.gasto.findMany({
    orderBy: {
      fecha: 'desc'
    }
  })
}

async createGastoSimple(createGastoDto: any) {
  return this.prisma.gasto.create({
    data: {
      ...createGastoDto,
      fecha: new Date(createGastoDto.fecha),
      fecha_registro: new Date()
    }
  })
}

}
