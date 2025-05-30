import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Imagen } from '@prisma/client';

export class ImagenService extends GenericService<Imagen, any, any> {
  constructor() {
    super(prisma, prisma.imagen);
  }

  async obtenerTodosConProducto() {
    return this.modelDelegate.findMany({ include: { producto: true } });
  }

  async obtenerPorIdConProducto(id: number) {
    return this.modelDelegate.findUnique({ where: { id }, include: { producto: true } });
  }

  async desactivar(id: number): Promise<Imagen> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
