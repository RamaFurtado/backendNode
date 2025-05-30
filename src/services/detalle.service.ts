import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Detalle } from '@prisma/client';

export class DetalleService extends GenericService<Detalle, any, any> {
  constructor() {
    super(prisma, prisma.detalle);
  }

  async obtenerTodosConRelaciones() {
    return this.modelDelegate.findMany({
      include: {
        producto: true,
        ordenCompra: true,
      },
    });
  }

  async obtenerPorIdConRelaciones(id: number) {
    return this.modelDelegate.findUnique({
      where: { id },
      include: {
        producto: true,
        ordenCompra: true,
      },
    });
  }

  async desactivar(id: number): Promise<Detalle> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
