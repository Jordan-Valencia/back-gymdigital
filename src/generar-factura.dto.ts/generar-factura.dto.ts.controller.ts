import { Controller, Post, Param, Header, HttpStatus } from '@nestjs/common'
import { FacturasService } from './generar-factura.dto.ts.service'

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post('membresia/:id')
  @Header('Content-Type', 'application/pdf')
  async generarFacturaMembresia(@Param('id') id: string) {
    try {
      const pdfBuffer = await this.facturasService.generarFacturaMembresia(id)
      return {
        statusCode: HttpStatus.OK,
        headers: {
          'Content-Disposition': `attachment; filename="factura-membresia-${id}.pdf"`,
          'Content-Length': pdfBuffer.length,
        },
        body: pdfBuffer,
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error generando factura',
        error: error.message,
      }
    }
  }

  @Post('venta/:id')
  @Header('Content-Type', 'application/pdf')
  async generarFacturaVenta(@Param('id') id: string) {
    try {
      const pdfBuffer = await this.facturasService.generarFacturaVenta(id)
      return {
        statusCode: HttpStatus.OK,
        headers: {
          'Content-Disposition': `attachment; filename="factura-venta-${id}.pdf"`,
          'Content-Length': pdfBuffer.length,
        },
        body: pdfBuffer,
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error generando factura',
        error: error.message,
      }
    }
  }
}