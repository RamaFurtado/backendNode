import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Descuento, PrecioDescuento } from '@prisma/client';

type CreateDescuentoData = {
  porcentaje: number;
  descripcion?: string;
  fechaInicio: string | Date;
  fechaFinal: string | Date;
  activo?: boolean;
};

export class DescuentoService extends GenericService<Descuento, any, any> {
  constructor() {
    super(prisma, prisma.descuento);
  }

  // Sobrescribir el método create para manejar las fechas
  async create(data: CreateDescuentoData): Promise<Descuento> {
    const fechaInicio = this.parseDate(data.fechaInicio);
    const fechaFinal = this.parseDate(data.fechaFinal, true); // true para fin de día

    return prisma.descuento.create({
      data: {
        porcentaje: data.porcentaje,
        descripcion: data.descripcion,
        fechaInicio,
        fechaFinal,
        activo: data.activo ?? true
      }
    });
  }

  // Método auxiliar para convertir fechas
  private parseDate(fecha: string | Date, endOfDay: boolean = false): Date {
    if (fecha instanceof Date) {
      return fecha;
    }

    // Si es string, parsear formato YYYY/MM/DD o YYYY-MM-DD
    const [year, month, day] = fecha.split(/[\/\-]/);
    const parsedDate = new Date(
      parseInt(year), 
      parseInt(month) - 1, 
      parseInt(day),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0
    );

    return parsedDate;
  }

  async obtenerActivos(): Promise<Descuento[]> {
    const hoy = new Date();
    return prisma.descuento.findMany({
      where: {
        fechaInicio: { lte: hoy },
        fechaFinal: { gte: hoy },
        activo: true,
      },
    });
  }

  // Aplicar descuento a un detalle específico (producto + color + talle + etc.)
  async aplicarDescuentoADetalle(
    descuentoId: number, 
    detalleId: number
  ): Promise<PrecioDescuento> {
    // Obtener el detalle con su precio
    const detalle = await prisma.detalle.findUnique({
      where: { id: detalleId },
      include: { precio: true }
    });

    if (!detalle || !detalle.precio) {
      throw new Error('Detalle o precio no encontrado');
    }

    // Obtener el descuento
    const descuento = await prisma.descuento.findUnique({
      where: { id: descuentoId }
    });

    if (!descuento) {
      throw new Error('Descuento no encontrado');
    }

    // Calcular precio final con descuento
    const precioOriginal = detalle.precio.precioVenta || 0;
    const precioFinal = precioOriginal - (precioOriginal * descuento.porcentaje / 100);

    // Crear la relación PrecioDescuento
    return prisma.precioDescuento.create({
      data: {
        precioFinal,
        detalleId,
        descuentoId,
        precioId: detalle.precioId
      }
    });
  }

  // Aplicar descuento a todos los detalles de un producto
  async aplicarDescuentoAProducto(
    descuentoId: number, 
    productoId: number
  ): Promise<PrecioDescuento[]> {
    // Obtener todos los detalles del producto
    const detalles = await prisma.detalle.findMany({
      where: { 
        productoId,
        activo: true 
      },
      include: { precio: true }
    });

    // Obtener el descuento
    const descuento = await prisma.descuento.findUnique({
      where: { id: descuentoId }
    });

    if (!descuento) {
      throw new Error('Descuento no encontrado');
    }

    // Aplicar descuento a cada detalle
    const preciosDescuento = [];
    for (const detalle of detalles) {
      if (detalle.precio) {
        const precioOriginal = detalle.precio.precioVenta || 0;
        const precioFinal = precioOriginal - (precioOriginal * descuento.porcentaje / 100);

        const precioDescuento = await prisma.precioDescuento.create({
          data: {
            precioFinal,
            detalleId: detalle.id,
            descuentoId,
            precioId: detalle.precioId
          }
        });
        preciosDescuento.push(precioDescuento);
      }
    }

    return preciosDescuento;
  }

  // Obtener productos con descuentos aplicados
  async obtenerProductosConDescuento(): Promise<any[]> {
     try {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        detalles: {
          some: {
            preciosDescuento: {
              some: {
                activo: true,
                descuento: {
                  activo: true,
                  fechaInicio: {
                    lte: new Date(),
                  },
                  fechaFinal: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      },
      include: {
        categoria: true,
        detalles: {
          where: {
            preciosDescuento: {
              some: {
                activo: true,
                descuento: {
                  activo: true,
                  fechaInicio: { lte: new Date() },
                  fechaFinal: { gte: new Date() },
                },
              },
            },
          },
          include: {
            precio: true,
            preciosDescuento: {
              where: {
                activo: true,
                descuento: {
                  activo: true,
                  fechaInicio: { lte: new Date() },
                  fechaFinal: { gte: new Date() },
                },
              },
              include: {
                descuento: true,
              },
            },
            imagenes: {
              include: {
                imagen: true,
              },
            },
            talle: true,
          },
        },
      },
    });

    return productos;
  } catch (error) {
    console.error('Error al obtener productos con descuento:', error);
    throw new Error('No se pudieron obtener los productos con descuento');
  }
}

  // Remover descuento de un detalle
  async removerDescuentoDeDetalle(
    descuentoId: number, 
    detalleId: number
  ): Promise<void> {
    await prisma.precioDescuento.deleteMany({
      where: {
        descuentoId,
        detalleId
      }
    });
  }
}