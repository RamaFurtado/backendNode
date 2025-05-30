import { PrismaClient, Imagen } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateImagenInput = {
  url: string;
  productoId: number;
  descripcion?: string;
};

type UpdateImagenInput = Partial<CreateImagenInput>;

export class ImagenController extends BaseController<Imagen, CreateImagenInput, UpdateImagenInput> {
  constructor(prisma: PrismaClient) {
    const imagenService = new GenericService<Imagen, CreateImagenInput, UpdateImagenInput>(
      prisma,
      prisma.imagen
    );
    super(imagenService);
  }
}
