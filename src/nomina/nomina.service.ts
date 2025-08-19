// src/nomina/nomina.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNominaDto } from './dto/create-nomina.dto';
import { UpdateNominaDto } from './dto/update-nomina.dto';
import { CreateHorasEntrenadorDto } from './dto/create-horas-entrenador.dto';
import { UpdateHorasEntrenadorDto } from './dto/update-horas-entrenador.dto';
import { Nomina, HorasEntrenador } from '@prisma/client';

@Injectable()
export class NominaService {
    constructor(private prisma: PrismaService) {}

    // ===== NÓMINA =====

    async findAllNominas(): Promise<Nomina[]> {
        return this.prisma.nomina.findMany({
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: [{ año: 'desc' }, { mes: 'desc' }],
        });
    }

    async createNomina(createNominaDto: CreateNominaDto): Promise<Nomina> {
        const { fecha_pago, ...rest } = createNominaDto;

        // Verificar que no exista ya una nómina para ese entrenador en ese mes/año
        const existingNomina = await this.prisma.nomina.findFirst({
            where: {
                entrenador_id: rest.entrenador_id,
                mes: rest.mes,
                año: rest.año,
            },
        });

        if (existingNomina) {
            throw new BadRequestException(
                `Ya existe una nómina para este entrenador en ${rest.mes}/${rest.año}`,
            );
        }

        return this.prisma.nomina.create({
            data: {
                ...rest,
                fecha_pago: fecha_pago ? new Date(fecha_pago) : null,
                fecha_registro: new Date(),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });
    }

    async findNominaById(id: string): Promise<Nomina> {
        const nomina = await this.prisma.nomina.findUnique({
            where: { id },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });

        if (!nomina) {
            throw new NotFoundException(`Nómina con ID ${id} no encontrada`);
        }

        return nomina;
    }

    async updateNomina(
        id: string,
        updateNominaDto: UpdateNominaDto,
    ): Promise<Nomina> {
        await this.findNominaById(id);

        const { fecha_pago, ...rest } = updateNominaDto;

        return this.prisma.nomina.update({
            where: { id },
            data: {
                ...rest,
                ...(fecha_pago && { fecha_pago: new Date(fecha_pago) }),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });
    }

    async removeNomina(id: string): Promise<void> {
        await this.findNominaById(id);

        await this.prisma.nomina.delete({
            where: { id },
        });
    }

    // ===== HORAS ENTRENADOR =====

    async findAllHorasEntrenador(): Promise<HorasEntrenador[]> {
        return this.prisma.horasEntrenador.findMany({
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: {
                fecha: 'desc',
            },
        });
    }

    async createHorasEntrenador(
        createHorasEntrenadorDto: CreateHorasEntrenadorDto,
    ): Promise<HorasEntrenador> {
        const { fecha, ...rest } = createHorasEntrenadorDto;

        return this.prisma.horasEntrenador.create({
            data: {
                ...rest,
                fecha: new Date(fecha),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });
    }

    async findHorasEntrenadorById(id: string): Promise<HorasEntrenador> {
        const horas = await this.prisma.horasEntrenador.findUnique({
            where: { id },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });

        if (!horas) {
            throw new NotFoundException(
                `Registro de horas con ID ${id} no encontrado`,
            );
        }

        return horas;
    }

    async updateHorasEntrenador(
        id: string,
        updateHorasEntrenadorDto: UpdateHorasEntrenadorDto,
    ): Promise<HorasEntrenador> {
        await this.findHorasEntrenadorById(id);

        const { fecha, ...rest } = updateHorasEntrenadorDto;

        return this.prisma.horasEntrenador.update({
            where: { id },
            data: {
                ...rest,
                ...(fecha && { fecha: new Date(fecha) }),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });
    }

    async removeHorasEntrenador(id: string): Promise<void> {
        await this.findHorasEntrenadorById(id);

        await this.prisma.horasEntrenador.delete({
            where: { id },
        });
    }

    // ===== MÉTODOS ADICIONALES =====

    async findNominasPorEntrenador(entrenadorId: string) {
        return this.prisma.nomina.findMany({
            where: { entrenador_id: entrenadorId },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: [{ año: 'desc' }, { mes: 'desc' }],
        });
    }

    async findNominasPorPeriodo(año: number, mes?: number) {
        return this.prisma.nomina.findMany({
            where: {
                año,
                ...(mes && { mes }),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: [{ mes: 'asc' }],
        });
    }

    async findHorasPorEntrenador(
        entrenadorId: string,
        fechaInicio?: Date,
        fechaFin?: Date,
    ) {
        return this.prisma.horasEntrenador.findMany({
            where: {
                entrenador_id: entrenadorId,
                ...(fechaInicio &&
                    fechaFin && {
                        fecha: {
                            gte: fechaInicio,
                            lte: fechaFin,
                        },
                    }),
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: {
                fecha: 'desc',
            },
        });
    }

    async calcularSalarioPorHoras(
        entrenadorId: string,
        año: number,
        mes: number,
    ) {
        // Obtener tarifa del entrenador
        const entrenador = await this.prisma.entrenador.findUnique({
            where: { id: entrenadorId },
            select: { tarifa_hora: true, nombre: true },
        });

        if (!entrenador) {
            throw new NotFoundException('Entrenador no encontrado');
        }

        if (!entrenador.tarifa_hora || entrenador.tarifa_hora <= 0) {
            throw new BadRequestException(
                'El entrenador no tiene tarifa por hora configurada',
            );
        }

        // Obtener horas del mes
        const fechaInicio = new Date(año, mes - 1, 1);
        const fechaFin = new Date(año, mes, 0);

        const horasDelMes = await this.prisma.horasEntrenador.findMany({
            where: {
                entrenador_id: entrenadorId,
                fecha: {
                    gte: fechaInicio,
                    lte: fechaFin,
                },
            },
        });

        const totalHoras = horasDelMes.reduce((sum, h) => sum + h.horas, 0);
        const salarioCalculado = totalHoras * entrenador.tarifa_hora;

        return {
            totalHoras,
            tarifaHora: entrenador.tarifa_hora,
            salarioCalculado,
            nombreEntrenador: entrenador.nombre,
            periodo: { año, mes },
            detalleHoras: horasDelMes.map(h => ({
                fecha: h.fecha,
                horas: h.horas,
                subtotal: h.horas * (entrenador.tarifa_hora ?? 0)
            }))
        };
    }

    async findNominasPendientes() {
        return this.prisma.nomina.findMany({
            where: {
                OR: [{ estado: 'PENDIENTE' }, { estado: 'VENCIDO' }],
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
            orderBy: [{ año: 'desc' }, { mes: 'desc' }],
        });
    }

    async getEstadisticasEntrenador(entrenadorId: string) {
        const [nominas, horas, entrenador] = await Promise.all([
            this.prisma.nomina.findMany({
                where: { entrenador_id: entrenadorId },
            }),
            this.prisma.horasEntrenador.findMany({
                where: { entrenador_id: entrenadorId },
            }),
            this.prisma.entrenador.findUnique({
                where: { id: entrenadorId },
                select: { 
                    nombre: true, 
                    tarifa_hora: true,
                    fecha_registro: true 
                }
            })
        ]);

        if (!entrenador) {
            throw new NotFoundException('Entrenador no encontrado');
        }

        const totalPagado = nominas.reduce((sum, n) => sum + n.total_pagar, 0);
        const totalHoras = horas.reduce((sum, h) => sum + h.horas, 0);

        // Estadísticas del año actual
        const añoActual = new Date().getFullYear();
        const nominasEsteAño = nominas.filter(n => n.año === añoActual);
        const horasEsteAño = horas.filter(h => h.fecha.getFullYear() === añoActual);

        const totalPagadoEsteAño = nominasEsteAño.reduce((sum, n) => sum + n.total_pagar, 0);
        const totalHorasEsteAño = horasEsteAño.reduce((sum, h) => sum + h.horas, 0);

        return {
            entrenador: {
                nombre: entrenador.nombre,
                tarifa_hora: entrenador.tarifa_hora,
                fecha_registro: entrenador.fecha_registro
            },
            estadisticasGenerales: {
                totalNominas: nominas.length,
                totalPagado,
                totalHoras,
                promedioMensual: nominas.length > 0 ? totalPagado / nominas.length : 0,
                promedioHorasPorMes: nominas.length > 0 ? totalHoras / nominas.length : 0,
            },
            estadisticasAñoActual: {
                nominasEsteAño: nominasEsteAño.length,
                totalPagadoEsteAño,
                totalHorasEsteAño,
                promedioMensualEsteAño: nominasEsteAño.length > 0 ? totalPagadoEsteAño / nominasEsteAño.length : 0
            }
        };
    }

    // ===== MÉTODOS PARA AUTOMATIZACIÓN =====

    async generarNominaPorHoras(entrenadorId: string, año: number, mes: number) {
        // Verificar que no exista ya una nómina
        const existingNomina = await this.prisma.nomina.findFirst({
            where: {
                entrenador_id: entrenadorId,
                mes,
                año
            }
        });

        if (existingNomina) {
            throw new BadRequestException(
                `Ya existe una nómina para este entrenador en ${mes}/${año}`
            );
        }

        // Calcular salario basado en horas
        const calculoSalario = await this.calcularSalarioPorHoras(entrenadorId, año, mes);

        if (calculoSalario.totalHoras === 0) {
            throw new BadRequestException(
                `No se encontraron horas registradas para el entrenador en ${mes}/${año}`
            );
        }

        // Crear la nómina automáticamente
        const nomina = await this.prisma.nomina.create({
            data: {
                entrenador_id: entrenadorId,
                mes,
                año,
                salario_base: calculoSalario.salarioCalculado,
                bonificaciones: 0,
                deducciones: 0,
                total_pagar: calculoSalario.salarioCalculado,
                estado: 'PENDIENTE',
                notas: `Nómina generada automáticamente basada en ${calculoSalario.totalHoras} horas trabajadas`,
                fecha_registro: new Date()
            },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            }
        });

        return {
            nomina,
            calculoDetallado: calculoSalario
        };
    }

    async actualizarEstadoNomina(id: string, nuevoEstado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO') {
        await this.findNominaById(id);

        const datosActualizacion: any = { estado: nuevoEstado };
        
        if (nuevoEstado === 'PAGADO') {
            datosActualizacion.fecha_pago = new Date();
        }

        return this.prisma.nomina.update({
            where: { id },
            data: datosActualizacion,
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        tarifa_hora: true,
                    },
                },
            },
        });
    }

    async getResumenNominasPorAño(año: number) {
        const nominas = await this.prisma.nomina.findMany({
            where: { año },
            include: {
                entrenador: {
                    select: {
                        id: true,
                        nombre: true,
                        tarifa_hora: true,
                    },
                },
            },
        });

        const totalPagado = nominas.reduce((sum, n) => sum + n.total_pagar, 0);
        const nominasPendientes = nominas.filter(n => n.estado === 'PENDIENTE');
        const nominasPagadas = nominas.filter(n => n.estado === 'PAGADO');

        const resumenPorEntrenador = nominas.reduce((acc, nomina) => {
            const entrenadorId = nomina.entrenador_id;
            if (!acc[entrenadorId]) {
                acc[entrenadorId] = {
                    entrenador: nomina.entrenador,
                    totalPagado: 0,
                    nominasCount: 0,
                    pendientes: 0,
                    pagadas: 0
                };
            }
            acc[entrenadorId].totalPagado += nomina.total_pagar;
            acc[entrenadorId].nominasCount += 1;
            if (nomina.estado === 'PENDIENTE') acc[entrenadorId].pendientes += 1;
            if (nomina.estado === 'PAGADO') acc[entrenadorId].pagadas += 1;
            return acc;
        }, {} as Record<string, any>);

        return {
            año,
            resumenGeneral: {
                totalNominas: nominas.length,
                totalPagado,
                nominasPendientes: nominasPendientes.length,
                nominasPagadas: nominasPagadas.length,
                montoPendiente: nominasPendientes.reduce((sum, n) => sum + n.total_pagar, 0)
            },
            resumenPorEntrenador: Object.values(resumenPorEntrenador)
        };
    }
}
