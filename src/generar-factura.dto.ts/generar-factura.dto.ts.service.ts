// src/facturas/facturas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GenerarFacturaDto } from './dto/generar-factura.dto'
import PDFDocument from 'pdfkit'
import { Response } from 'express'

@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) {}

  async generarFacturaMembresia(membresiaId: string): Promise<Buffer> {
    const membresia = await this.prisma.membresia.findUnique({
      where: { id: membresiaId },
      include: {
        Usuario: true,
        Plan: true
      }
    })

    if (!membresia) {
      throw new NotFoundException(`Membresía con ID ${membresiaId} no encontrada`)
    }

    return this.crearPDFFactura(membresia, 'MEMBRESIA')
  }

  private async crearPDFFactura(data: any, tipo: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const buffers: Buffer[] = []

        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        // Header
        doc.fontSize(20)
           .text('FACTURA DE MEMBRESÍA', 50, 50, { align: 'center' })

        doc.fontSize(12)
           .text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 50, 100)
           .text(`Factura #: ${this.generarNumeroFactura()}`, 50, 120)

        // Información del cliente
        doc.text('INFORMACIÓN DEL CLIENTE:', 50, 160)
           .text(`Nombre: ${data.usuario.nombre}`, 50, 180)
           .text(`Email: ${data.usuario.email}`, 50, 200)
           .text(`Teléfono: ${data.usuario.telefono || 'No especificado'}`, 50, 220)

        // Información del servicio
        doc.text('DETALLE DEL SERVICIO:', 50, 260)
           .text(`Plan: ${data.plan.nombre}`, 50, 280)
           .text(`Fecha Inicio: ${new Date(data.fecha_inicio).toLocaleDateString('es-ES')}`, 50, 300)
           .text(`Fecha Fin: ${new Date(data.fecha_fin).toLocaleDateString('es-ES')}`, 50, 320)

        // Total
        doc.fontSize(14)
           .text(`TOTAL A PAGAR: $${data.precio_pagado.toLocaleString('es-CO')}`, 50, 360, { align: 'right' })

        // Footer
        doc.fontSize(10)
           .text('Gracias por confiar en nuestros servicios', 50, 450, { align: 'center' })

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  private generarNumeroFactura(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `F-${timestamp}-${random}`
  }

  async generarFacturaVenta(ventaId: string): Promise<Buffer> {
    const venta = await this.prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        Usuario: true,
        DetalleVenta : {
          include: {
            Producto: true
          }
        }
      }
    })

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${ventaId} no encontrada`)
    }

    return this.crearPDFFacturaVenta(venta)
  }

  private async crearPDFFacturaVenta(venta: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const buffers: Buffer[] = []

        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        // Header
        doc.fontSize(20)
           .text('FACTURA DE VENTA', 50, 50, { align: 'center' })

        doc.fontSize(12)
           .text(`Fecha: ${new Date(venta.fecha_venta).toLocaleDateString('es-ES')}`, 50, 100)
           .text(`Factura #: ${this.generarNumeroFactura()}`, 50, 120)

        // Información del cliente
        if (venta.usuario) {
          doc.text('INFORMACIÓN DEL CLIENTE:', 50, 160)
             .text(`Nombre: ${venta.usuario.nombre}`, 50, 180)
             .text(`Email: ${venta.usuario.email}`, 50, 200)
        }

        // Detalle de productos
        doc.text('DETALLE DE LA COMPRA:', 50, 240)
        
        let yPosition = 260
        venta.items.forEach((item: any) => {
          doc.text(`${item.producto.nombre} x${item.cantidad}`, 50, yPosition)
             .text(`$${item.precio_unitario.toLocaleString('es-CO')}`, 300, yPosition)
             .text(`$${item.subtotal.toLocaleString('es-CO')}`, 450, yPosition)
          yPosition += 20
        })

        // Total
        doc.fontSize(14)
           .text(`TOTAL: $${venta.total.toLocaleString('es-CO')}`, 50, yPosition + 40, { align: 'right' })

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}
