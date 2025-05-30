import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Descuento } from '@prisma/client';

export class DescuentoService extends GenericService<Descuento, any, any> {
  constructor() {
    super(prisma, prisma.descuento);
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
}
