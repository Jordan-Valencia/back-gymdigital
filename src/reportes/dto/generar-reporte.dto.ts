// src/reportes/dto/generar-reporte.dto.ts
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator'

export enum TipoReporte {
  GENERAL = 'general',
  INGRESOS = 'ingresos',
  GASTOS = 'gastos',
  NOMINA = 'nomina'
}

export enum FormatoReporte {
  PDF = 'pdf',
  EXCEL = 'excel',
  JSON = 'json'
}

export class GenerarReporteDto {
  @IsEnum(TipoReporte)
  tipo: TipoReporte

  @IsDateString()
  fechaInicio: string

  @IsDateString()
  fechaFin: string

  @IsOptional()
  @IsEnum(FormatoReporte)
  formato?: FormatoReporte = FormatoReporte.JSON

  @IsOptional()
  @IsString()
  entrenadorId?: string

  @IsOptional()
  @IsString()
  categoriaId?: string
}
