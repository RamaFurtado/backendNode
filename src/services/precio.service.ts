import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Precio } from '@prisma/client';

export class PrecioService extends GenericService<Precio, any, any> {
  constructor() {
    super(prisma, prisma.precio);
  }

  async obtenerTodosConProducto() {
    return this.modelDelegate.findMany({ include: { producto: true } });
  }

  async obtenerPorIdConProducto(id: number) {
    return this.modelDelegate.findUnique({ where: { id }, include: { producto: true } });
  }

  async desactivar(id: number): Promise<Precio> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
