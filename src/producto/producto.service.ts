import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Producto } from '@prisma/client';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProductoDto): Promise<Producto> {
        return this.prisma.producto.create({
            data: {
                nombre: data.nombre,
                cantidad: data.cantidad,
                stock_minimo: data.stock_minimo,
                precio_venta: data.precio_venta,
                costo: data.costo,
                descripcion: data.descripcion,
                fecha_registro: new Date(),
                CategoriaInventario: {
                    connect: { id: data.categoria_id },
                },
            },
        });
    }

    async findAll(): Promise<Producto[]> {
        return this.prisma.producto.findMany();
    }

    async findOne(id: string): Promise<Producto | null> {
        return this.prisma.producto.findUnique({ where: { id } });
    }

    async update(id: string, data: UpdateProductoDto): Promise<Producto> {
        const updateData: Prisma.ProductoUpdateInput = {
            nombre: data.nombre,
            cantidad: data.cantidad,
            stock_minimo: data.stock_minimo,
            precio_venta: data.precio_venta,
            costo: data.costo,
            descripcion: data.descripcion,
        };
        if (data.categoria_id) {
            updateData.CategoriaInventario = {
                connect: { id: data.categoria_id },
            };
        }
        return this.prisma.producto.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string): Promise<Producto> {
        return this.prisma.producto.delete({ where: { id } });
    }
}
