import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { OrdenCompra } from '@prisma/client';

export class OrdenCompraService extends GenericService<OrdenCompra, any, any> {
  constructor() {
    super(prisma, prisma.ordenCompra);
  }

  async obtenerTodosConRelaciones() {
    return this.modelDelegate.findMany({
      include: {
        usuario: true,
        direccion: true,
        detalles: true,
      },
    });
  }

  async obtenerPorIdConRelaciones(id: number) {
    return this.modelDelegate.findUnique({
      where: { id },
      include: {
        usuario: true,
        direccion: true,
        detalles: true,
      },
    });
  }

  async desactivar(id: number): Promise<OrdenCompra> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
