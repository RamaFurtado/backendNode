import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Categoria } from '@prisma/client';

export class CategoriaService extends GenericService<Categoria, any, any> {
  constructor() {
    super(prisma, prisma.categoria);
  }

  async desactivate(id: number): Promise<Categoria> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }
}
