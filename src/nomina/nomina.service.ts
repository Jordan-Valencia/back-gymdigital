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
                        tarifa_mensual: true,
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
                        tarifa_mensual: true,
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
                        tarifa_mensual: true,
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
                        tarifa_mensual: true,
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
            select: { tarifa_hora: true },
        });

        if (!entrenador) {
            throw new NotFoundException('Entrenador no encontrado');
        }

        if (!entrenador.tarifa_hora) {
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
            periodo: { año, mes },
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
                    },
                },
            },
            orderBy: [{ año: 'desc' }, { mes: 'desc' }],
        });
    }
    // src/nomina/nomina.service.ts (agregar)

    async getEstadisticasEntrenador(entrenadorId: string) {
        const [nominas, horas] = await Promise.all([
            this.prisma.nomina.findMany({
                where: { entrenador_id: entrenadorId },
            }),
            this.prisma.horasEntrenador.findMany({
                where: { entrenador_id: entrenadorId },
            }),
        ]);

        const totalPagado = nominas.reduce((sum, n) => sum + n.total_pagar, 0);
        const totalHoras = horas.reduce((sum, h) => sum + h.horas, 0);

        return {
            totalNominas: nominas.length,
            totalPagado,
            totalHoras,
            promedioMensual:
                nominas.length > 0 ? totalPagado / nominas.length : 0,
            promedioHorasPorMes:
                nominas.length > 0 ? totalHoras / nominas.length : 0,
        };
    }
}
