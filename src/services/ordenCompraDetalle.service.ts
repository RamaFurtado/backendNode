import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { OrdenCompraDetalle } from '@prisma/client';

export class OrdenCompraDetalleService extends GenericService<OrdenCompraDetalle, any, any> {
  constructor() {
    super(prisma, prisma.ordenCompraDetalle);
  }

  async obtenerTodosConRelaciones() {
    return this.modelDelegate.findMany({
      include: {
        ordenCompra: true,
        producto: true,
      },
    });
  }

  async obtenerPorIdConRelaciones(id: number) {
    return this.modelDelegate.findUnique({
      where: { id },
      include: {
        ordenCompra: true,
        producto: true,
      },
    });
  }

  async desactivar(id: number): Promise<OrdenCompraDetalle> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
