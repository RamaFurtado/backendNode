
import { PrismaClient, Categoria } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateCategoriaInput = {
  nombre: string;
  descripcion?: string;
};

type UpdateCategoriaInput = {
  nombre?: string;
  descripcion?: string;
};

export class CategoriaController extends BaseController<Categoria, CreateCategoriaInput, UpdateCategoriaInput> {
  constructor(prisma: PrismaClient) {
    const categoriaService = new GenericService<Categoria, CreateCategoriaInput, UpdateCategoriaInput>(
      prisma,
      prisma.categoria
    );
    super(categoriaService);
  }
}
