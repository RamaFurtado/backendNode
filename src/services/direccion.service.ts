import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Direccion } from '@prisma/client';

export class DireccionService extends GenericService<Direccion, any, any> {
  constructor() {
    super(prisma, prisma.direccion);
  }

  async obtenerTodosConUsuario() {
    return this.modelDelegate.findMany({ include: { usuario: true } });
  }

  async obtenerPorIdConUsuario(id: number) {
    return this.modelDelegate.findUnique({ where: { id }, include: { usuario: true } });
  }

  async desactivar(id: number): Promise<Direccion> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
