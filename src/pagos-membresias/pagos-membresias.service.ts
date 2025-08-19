// src/pagos-membresias/pagos-membresias.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePagoMembresiaDto } from './dto/create-pagos-membresia.dto'
import { UpdatePagoMembresiaDto } from './dto/update-pagos-membresia.dto'
import { PagoMembresia, EstadoPago } from '@prisma/client'

@Injectable()
export class PagosMembresiaService {
  constructor(private prisma: PrismaService) {}

  // ===== MÉTODOS CRUD BÁSICOS =====

  async findAll(): Promise<PagoMembresia[]> {
    return this.prisma.pagoMembresia.findMany({
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    })
  }

  async create(createPagoMembresiaDto: CreatePagoMembresiaDto): Promise<PagoMembresia> {
    const { fecha_pago, fecha_vencimiento, estado, ...rest } = createPagoMembresiaDto

    // Normalizar estado a mayúsculas
    const estadoNormalizado = estado.toUpperCase()

    // Validar que el estado sea válido
    if (!Object.values(EstadoPago).includes(estadoNormalizado as EstadoPago)) {
      throw new BadRequestException(`Estado inválido: ${estado}. Estados válidos: ${Object.values(EstadoPago).join(', ')}`)
    }

    // Verificar que la membresía existe
    const membresiaExiste = await this.prisma.membresia.findUnique({
      where: { id: rest.membresia_id }
    })

    if (!membresiaExiste) {
      throw new NotFoundException(`Membresía con ID ${rest.membresia_id} no encontrada`)
    }

    const data: any = {
      ...rest,
      estado: estadoNormalizado as EstadoPago,
      fecha_pago: new Date(fecha_pago)
    }

    if (fecha_vencimiento !== undefined && fecha_vencimiento !== null) {
      data.fecha_vencimiento = new Date(fecha_vencimiento)
    }

    return this.prisma.pagoMembresia.create({
      data,
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      }
    })
  }

  async findOne(id: string): Promise<PagoMembresia> {
    const pago = await this.prisma.pagoMembresia.findUnique({
      where: { id },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      }
    })

    if (!pago) {
      throw new NotFoundException(`Pago de membresía con ID ${id} no encontrado`)
    }

    return pago
  }

  async update(id: string, updatePagoMembresiaDto: UpdatePagoMembresiaDto): Promise<PagoMembresia> {
    await this.findOne(id) // Verifica que existe

    const { fecha_pago, fecha_vencimiento, estado, ...rest } = updatePagoMembresiaDto

    const updateData: any = { ...rest }

    // Normalizar estado a mayúsculas si viene definido
    if (estado !== undefined && estado !== null) {
      const estadoNormalizado = estado.toUpperCase()
      if (!Object.values(EstadoPago).includes(estadoNormalizado as EstadoPago)) {
        throw new BadRequestException(`Estado inválido: ${estado}. Estados válidos: ${Object.values(EstadoPago).join(', ')}`)
      }
      updateData.estado = estadoNormalizado as EstadoPago
    }

    // Manejar fechas
    if (fecha_pago) {
      updateData.fecha_pago = new Date(fecha_pago)
    }

    if (fecha_vencimiento !== undefined) {
      updateData.fecha_vencimiento = fecha_vencimiento ? new Date(fecha_vencimiento) : null
    }

    return this.prisma.pagoMembresia.update({
      where: { id },
      data: updateData,
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      }
    })
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id) // Verifica que existe
    
    await this.prisma.pagoMembresia.delete({
      where: { id }
    })
  }

  // ===== MÉTODOS PARA FACTURACIÓN Y MEMBRESÍAS =====

  async actualizarMembresia(id: string, datos: any) {
    const updateData: any = {}
    
    if (datos.fecha_fin) {
      updateData.fecha_fin = new Date(datos.fecha_fin)
    }
    
    if (datos.fecha_pago) {
      updateData.fecha_pago = new Date(datos.fecha_pago)
    }

    if (datos.fecha_inicio) {
      updateData.fecha_inicio = new Date(datos.fecha_inicio)
    }

    if (datos.precio_pagado !== undefined) {
      updateData.precio_pagado = datos.precio_pagado
    }

    return this.prisma.membresia.update({
      where: { id },
      data: updateData,
      include: {
        Usuario: true,
        Plan: true
      }
    })
  }

  async findMembresiasPorVencer(dias: number = 7) {
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + dias)

    return this.prisma.membresia.findMany({
      where: {
        fecha_fin: {
          gte: new Date(),
          lte: fechaLimite
        }
      },
      include: {
        Usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        Plan: {
          select: {
            id: true,
            nombre: true,
            precio: true
          }
        }
      },
      orderBy: {
        fecha_fin: 'asc'
      }
    })
  }

  async findMembresiasVencidas() {
    return this.prisma.membresia.findMany({
      where: {
        fecha_fin: {
          lt: new Date()
        }
      },
      include: {
        Usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        Plan: {
          select: {
            id: true,
            nombre: true,
            precio: true
          }
        }
      },
      orderBy: {
        fecha_fin: 'desc'
      }
    })
  }

  // ===== MÉTODOS DE CONSULTA ADICIONALES =====

  async findPagosPorPeriodo(fechaInicio: Date, fechaFin: Date) {
    return this.prisma.pagoMembresia.findMany({
      where: {
        fecha_pago: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    })
  }

  async findPagosPorEstado(estado: string) {
    // Normalizar estado antes de buscar
    const estadoNormalizado = estado.toUpperCase()
    
    if (!Object.values(EstadoPago).includes(estadoNormalizado as EstadoPago)) {
      throw new BadRequestException(`Estado inválido: ${estado}. Estados válidos: ${Object.values(EstadoPago).join(', ')}`)
    }

    return this.prisma.pagoMembresia.findMany({
      where: { estado: estadoNormalizado as EstadoPago },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    })
  }

  async findPagosPorMembresia(membresiaId: string) {
    return this.prisma.pagoMembresia.findMany({
      where: { membresia_id: membresiaId },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    })
  }

  async findPagosPorUsuario(usuarioId: string) {
    return this.prisma.pagoMembresia.findMany({
      where: {
        membresia: {
          usuario_id: usuarioId
        }
      },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    })
  }

  async findPagosPendientes() {
    return this.findPagosPorEstado('PENDIENTE')
  }

  async findPagosVencidos() {
    return this.prisma.pagoMembresia.findMany({
      where: {
        estado: EstadoPago.VENCIDO
      },
      include: {
        membresia: {
          include: {
            Usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            },
            Plan: {
              select: {
                id: true,
                nombre: true,
                precio: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_vencimiento: 'asc'
      }
    })
  }

  // ===== MÉTODOS DE ESTADÍSTICAS =====

  async getEstadisticasPagos() {
    const [total, pendientes, pagados, vencidos, parciales] = await Promise.all([
      this.prisma.pagoMembresia.count(),
      this.prisma.pagoMembresia.count({ where: { estado: EstadoPago.PENDIENTE } }),
      this.prisma.pagoMembresia.count({ where: { estado: EstadoPago.PAGADO } }),
      this.prisma.pagoMembresia.count({ where: { estado: EstadoPago.VENCIDO } }),
      this.prisma.pagoMembresia.count({ where: { estado: EstadoPago.PARCIAL } })
    ])

    const totalMontos = await this.prisma.pagoMembresia.aggregate({
      _sum: { monto: true }
    })

    return {
      total,
      porEstado: {
        pendientes,
        pagados,
        vencidos,
        parciales
      },
      totalMonto: totalMontos._sum.monto || 0
    }
  }

  async getIngresosPorPeriodo(fechaInicio: Date, fechaFin: Date) {
    const resultado = await this.prisma.pagoMembresia.aggregate({
      where: {
        fecha_pago: {
          gte: fechaInicio,
          lte: fechaFin
        },
        estado: EstadoPago.PAGADO
      },
      _sum: { monto: true },
      _count: { id: true }
    })

    return {
      totalIngresos: resultado._sum.monto || 0,
      cantidadPagos: resultado._count.id,
      promedioIngreso: resultado._count.id > 0 ? (resultado._sum.monto || 0) / resultado._count.id : 0
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====
  async aplicarDescuento(id: string, descuento: number) {
    const pago = await this.findOne(id)
    const nuevoMonto = pago.monto - descuento

    return this.update(id, {
      monto: nuevoMonto,
      descuento: pago.descuento + descuento
    })
  }

  async aplicarRecargo(id: string, recargo: number) {
    const pago = await this.findOne(id)
    const nuevoMonto = pago.monto + recargo

    return this.update(id, {
      monto: nuevoMonto,
      recargo: pago.recargo + recargo
    })
  }
}
