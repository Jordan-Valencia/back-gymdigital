import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Usuario } from '@prisma/client';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

async create(data: CreateUsuarioDto): Promise<Usuario> {
  // Validar que no existe un usuario con el mismo email
  const existingUserByEmail = await this.prisma.usuario.findUnique({
    where: { email: data.email }
  });

  if (existingUserByEmail) {
    throw new ConflictException(`Ya existe un usuario con el email: ${data.email}`);
  }

  // Validar que no existe un usuario con el mismo documento
  const existingUserByDocument = await this.prisma.usuario.findUnique({
    where: { documento: data.documento }
  });

  if (existingUserByDocument) {
    throw new ConflictException(`Ya existe un usuario con el documento: ${data.documento}`);
  }

  try {
    const createData: Prisma.UsuarioCreateInput = {
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      documento: data.documento,
      activo: data.activo,
      notas: data.notas,
      fecha_registro: new Date(),
      fecha_nacimiento: new Date(data.fecha_nacimiento), 
    };

    return await this.prisma.usuario.create({ data: createData });
  } catch (error) {
    console.error('Error creando usuario:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target?.includes('email')) {
          throw new ConflictException('El email ya está registrado por otro usuario');
        }
        if (target?.includes('documento')) {
          throw new ConflictException('El documento ya está registrado por otro usuario');
        }
      }
    }
    
    throw new BadRequestException('No se pudo crear el usuario. Verifica los datos.');
  }
}



  /** Listar todos los usuarios */
  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      orderBy: { fecha_registro: 'desc' },
    });
  }

  /** Buscar un usuario por ID */
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
    }
    return usuario;
  }

  /** Buscar un usuario por email */
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  /** Buscar un usuario por documento */
  async findByDocument(documento: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { documento } });
  }

  /** Actualizar un usuario */
  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
  const existe = await this.prisma.usuario.findUnique({ where: { id } });
  if (!existe) {
    throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
  }

  // Validar email único si está cambiando
  if (data.email && data.email !== existe.email) {
    const existingUserByEmail = await this.prisma.usuario.findUnique({
      where: { email: data.email }
    });

    if (existingUserByEmail) {
      throw new ConflictException(`Ya existe otro usuario con el email: ${data.email}`);
    }
  }

  // Validar documento único si está cambiando
  if (data.documento && data.documento !== existe.documento) {
    const existingUserByDocument = await this.prisma.usuario.findUnique({
      where: { documento: data.documento }
    });

    if (existingUserByDocument) {
      throw new ConflictException(`Ya existe otro usuario con el documento: ${data.documento}`);
    }
  }

  try {
    const updateData: Prisma.UsuarioUpdateInput = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.documento !== undefined) updateData.documento = data.documento;
    if (data.activo !== undefined) updateData.activo = data.activo;
    if (data.notas !== undefined) updateData.notas = data.notas;
    
    // Corrección: manejar fecha_nacimiento de esta forma
    updateData.fecha_nacimiento = data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : undefined;

    return await this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target?.includes('email')) {
          throw new ConflictException('El email ya está registrado por otro usuario');
        }
        if (target?.includes('documento')) {
          throw new ConflictException('El documento ya está registrado por otro usuario');
        }
      }
    }
    
    throw new BadRequestException('No se pudo actualizar el usuario.');
  }
}

  /** Eliminar un usuario */
  async remove(id: string): Promise<Usuario> {
    const existe = await this.prisma.usuario.findUnique({ 
      where: { id },
      include: {
        Membresia: true,
        
      }
    });

    if (!existe) {
      throw new NotFoundException(`No se encontró un usuario con ID ${id}`);
    }

    // Verificar si tiene membresías activas
    if (existe.Membresia && existe.Membresia.length > 0) {
      throw new BadRequestException('No se puede eliminar el usuario porque tiene membresías asociadas. Desactívalo en su lugar.');
    }

    try {
      return await this.prisma.usuario.delete({ where: { id } });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('No se puede eliminar el usuario porque tiene datos relacionados. Desactívalo en su lugar.');
        }
      }
      
      throw new BadRequestException('No se pudo eliminar el usuario.');
    }
  }

  /** Buscar usuarios activos */
  async findActivos(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  /** Buscar usuarios por nombre (búsqueda parcial) */
  async findByName(nombre: string): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      where: {
        nombre: {
          contains: nombre,
          mode: 'insensitive',
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  /** Buscar usuarios con cumpleaños hoy */
  async findCumpleanosHoy(): Promise<Usuario[]> {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();

    return this.prisma.usuario.findMany({
      where: {
        activo: true,
        fecha_nacimiento: {
          not: undefined,
        },
        AND: [
          {
            fecha_nacimiento: {
              not: undefined,
            },
          },
        ],
      },
    }).then(usuarios => {
      return usuarios.filter(usuario => {
        if (!usuario.fecha_nacimiento) return false;
        const fechaNac = new Date(usuario.fecha_nacimiento);
        return fechaNac.getMonth() + 1 === mes && fechaNac.getDate() === dia;
      });
    });
  }

  /** Buscar usuarios con cumpleaños próximos (en los siguientes X días) */
  async findCumpleanosProximos(dias: number = 7): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        activo: true,
        fecha_nacimiento: {
          not: undefined,
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const hoy = new Date();
    return usuarios.filter(usuario => {
      if (!usuario.fecha_nacimiento) return false;
      
      const fechaNac = new Date(usuario.fecha_nacimiento);
      const cumpleanosEsteAno = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
      
      // Si ya pasó este año, calcular para el próximo año
      if (cumpleanosEsteAno < hoy) {
        cumpleanosEsteAno.setFullYear(hoy.getFullYear() + 1);
      }
      
      const diffTime = cumpleanosEsteAno.getTime() - hoy.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 && diffDays <= dias;
    }).sort((a, b) => {
      const fechaNacA = new Date(a.fecha_nacimiento!);
      const fechaNacB = new Date(b.fecha_nacimiento!);
      const cumpleA = new Date(hoy.getFullYear(), fechaNacA.getMonth(), fechaNacA.getDate());
      const cumpleB = new Date(hoy.getFullYear(), fechaNacB.getMonth(), fechaNacB.getDate());
      
      if (cumpleA < hoy) cumpleA.setFullYear(hoy.getFullYear() + 1);
      if (cumpleB < hoy) cumpleB.setFullYear(hoy.getFullYear() + 1);
      
      return cumpleA.getTime() - cumpleB.getTime();
    });
  }

  /** Obtener estadísticas de usuarios */
  async getEstadisticas() {
    const [total, activos, inactivos, conCumpleanos] = await Promise.all([
      this.prisma.usuario.count(),
      this.prisma.usuario.count({ where: { activo: true } }),
      this.prisma.usuario.count({ where: { activo: false } }),
      this.findCumpleanosHoy(),
    ]);

    const proximosCumpleanos = await this.findCumpleanosProximos(7);

    return {
      total,
      activos,
      inactivos,
      cumpleanosHoy: conCumpleanos.length,
      proximosCumpleanos: proximosCumpleanos.length,
    };
  }
}
