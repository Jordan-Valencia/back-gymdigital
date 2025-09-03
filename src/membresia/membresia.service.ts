import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Membresia } from '@prisma/client';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { Mutex } from 'async-mutex';

@Injectable()
export class MembresiaService {
  private readonly mutex = new Mutex();
  
  constructor(private readonly prisma: PrismaService) {}

  /** Crear una nueva membresía */
  async create(data: CreateMembresiaDto): Promise<Membresia> {
    // Validaciones básicas
    if (!data.usuario_id || !data.plan_id) {
      throw new BadRequestException('Debe indicar un usuario y un plan válidos.');
    }

    // Validar que las fechas sean válidas
    const fechaInicio = new Date(data.fecha_inicio);
    const fechaFin = new Date(data.fecha_fin);
    const fechaPago = new Date(data.fecha_pago);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || isNaN(fechaPago.getTime())) {
      throw new BadRequestException('Las fechas proporcionadas no son válidas.');
    }

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio.');
    }

    if (data.precio_pagado <= 0) {
      throw new BadRequestException('El precio pagado debe ser mayor que 0.');
    }

    // Usar mutex para prevenir condiciones de carrera
    return this.mutex.runExclusive(async () => {
      try {
        // Verificar que el usuario existe
        const usuario = await this.prisma.usuario.findUnique({
          where: { id: data.usuario_id }
        });
        
        if (!usuario) {
          throw new BadRequestException('El usuario especificado no existe.');
        }

        // Verificar que el plan existe
        const plan = await this.prisma.plan.findUnique({
          where: { id: data.plan_id }
        });

        if (!plan) {
          throw new BadRequestException('El plan especificado no existe.');
        }

        // Verificar si ya existe una membresía activa para este usuario
        const membresiaExistente = await this.prisma.membresia.findFirst({
          where: {
            usuario_id: data.usuario_id,
            fecha_fin: {
              gte: new Date() // Membresías que aún no han expirado
            }
          }
        });


        // Verificar si existe una membresía duplicada exacta (mismos parámetros y fechas cercanas)
        const membresiasDuplicadas = await this.prisma.membresia.findMany({
          where: {
            usuario_id: data.usuario_id,
            plan_id: data.plan_id,
            precio_pagado: data.precio_pagado,
            fecha_inicio: {
              gte: new Date(fechaInicio.getTime() - 60000), // 1 minuto antes
              lte: new Date(fechaInicio.getTime() + 60000), // 1 minuto después
            }
          }
        });

        if (membresiasDuplicadas.length > 0) {
          throw new ConflictException('Ya existe una membresía idéntica creada recientemente. Posible duplicación.');
        }

        return await this.prisma.membresia.create({
          data: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            precio_pagado: data.precio_pagado,
            metodo_pago: data.metodo_pago,
            fecha_pago: fechaPago,
            Usuario: {
              connect: { id: data.usuario_id },
            },
            Plan: {
              connect: { id: data.plan_id },
            },
          },
          include: {
            Usuario: true,
            Plan: true
          }
        });
      } catch (error) {
        console.error('Error creando membresía:', error);
        
        if (error instanceof BadRequestException || error instanceof ConflictException) {
          throw error;
        }
        
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe una membresía con estos datos. Verifique la información.');
        }
        
        if (error.code === 'P2025') {
          throw new BadRequestException('Usuario o plan no encontrado. Verifique los datos.');
        }
        
        throw new BadRequestException('No se pudo crear la membresía. Verifica los datos proporcionados.');
      }
    });
  }

  /** Listar todas las membresías */
  async findAll(): Promise<Membresia[]> {
    return this.prisma.membresia.findMany({
      orderBy: { fecha_inicio: 'desc' },
      include: { Usuario: true, Plan: true },
    });
  }

  /** Buscar una membresía por ID */
  async findOne(id: string): Promise<Membresia> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de membresía requerido.');
    }

    const membresia = await this.prisma.membresia.findUnique({
      where: { id },
      include: { Usuario: true, Plan: true },
    });

    if (!membresia) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    return membresia;
  }

  /** Actualizar una membresía */
  async update(id: string, data: Partial<CreateMembresiaDto>): Promise<Membresia> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de membresía requerido.');
    }

    const existe = await this.prisma.membresia.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    return this.mutex.runExclusive(async () => {
      try {
        const updateData: any = {};

        // Validar y procesar fechas si se proporcionan
        if (data.fecha_inicio) {
          const fechaInicio = new Date(data.fecha_inicio);
          if (isNaN(fechaInicio.getTime())) {
            throw new BadRequestException('Fecha de inicio no válida.');
          }
          updateData.fecha_inicio = fechaInicio;
        }

        if (data.fecha_fin) {
          const fechaFin = new Date(data.fecha_fin);
          if (isNaN(fechaFin.getTime())) {
            throw new BadRequestException('Fecha de fin no válida.');
          }
          updateData.fecha_fin = fechaFin;
        }

        if (data.fecha_pago) {
          const fechaPago = new Date(data.fecha_pago);
          if (isNaN(fechaPago.getTime())) {
            throw new BadRequestException('Fecha de pago no válida.');
          }
          updateData.fecha_pago = fechaPago;
        }

        // Validar que fecha_fin sea posterior a fecha_inicio
        const fechaInicio = updateData.fecha_inicio || existe.fecha_inicio;
        const fechaFin = updateData.fecha_fin || existe.fecha_fin;
        if (fechaFin <= fechaInicio) {
          throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio.');
        }

        if (data.precio_pagado !== undefined) {
          if (data.precio_pagado <= 0) {
            throw new BadRequestException('El precio pagado debe ser mayor que 0.');
          }
          updateData.precio_pagado = data.precio_pagado;
        }

        if (data.metodo_pago) {
          updateData.metodo_pago = data.metodo_pago;
        }

        // Validar y conectar usuario si se proporciona
        if (data.usuario_id) {
          const usuario = await this.prisma.usuario.findUnique({
            where: { id: data.usuario_id }
          });
          if (!usuario) {
            throw new BadRequestException('El usuario especificado no existe.');
          }
          updateData.Usuario = { connect: { id: data.usuario_id } };
        }

        // Validar y conectar plan si se proporciona
        if (data.plan_id) {
          const plan = await this.prisma.plan.findUnique({
            where: { id: data.plan_id }
          });
          if (!plan) {
            throw new BadRequestException('El plan especificado no existe.');
          }
          updateData.Plan = { connect: { id: data.plan_id } };
        }

        return await this.prisma.membresia.update({
          where: { id },
          data: updateData,
          include: {
            Usuario: true,
            Plan: true
          }
        });
      } catch (error) {
        console.error('Error actualizando membresía:', error);
        
        if (error instanceof BadRequestException) {
          throw error;
        }
        
        throw new BadRequestException('No se pudo actualizar la membresía. Verifica los datos.');
      }
    });
  }

  /** Eliminar una membresía */
  async remove(id: string): Promise<Membresia> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID de membresía requerido.');
    }

    const existe = await this.prisma.membresia.findUnique({ where: { id } });
    if (!existe) {
      throw new NotFoundException(`No se encontró una membresía con el ID ${id}`);
    }

    try {
      return await this.prisma.membresia.delete({ 
        where: { id },
        include: {
          Usuario: true,
          Plan: true
        }
      });
    } catch (error) {
      console.error('Error eliminando membresía:', error);
      throw new BadRequestException('No se pudo eliminar la membresía. Verifica dependencias.');
    }
  }

  /** Verificar membresías activas para un usuario */
  async findActiveMembresiasByUser(userId: string): Promise<Membresia[]> {
    return this.prisma.membresia.findMany({
      where: {
        usuario_id: userId,
        fecha_fin: {
          gte: new Date()
        }
      },
      include: {
        Usuario: true,
        Plan: true
      },
      orderBy: {
        fecha_fin: 'desc'
      }
    });
  }
}
