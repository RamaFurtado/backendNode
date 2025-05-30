import { PrismaClient, Precio } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreatePrecioInput = {
  productoId: number;
  valor: number;
  fechaInicio: Date;
  fechaFin?: Date | null;
};

type UpdatePrecioInput = Partial<CreatePrecioInput>;

export class PrecioController extends BaseController<Precio, CreatePrecioInput, UpdatePrecioInput> {
  constructor(prisma: PrismaClient) {
    const precioService = new GenericService<Precio, CreatePrecioInput, UpdatePrecioInput>(
      prisma,
      prisma.precio
    );
    super(precioService);
  }
}
