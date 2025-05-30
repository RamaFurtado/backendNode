import { PrismaClient, Detalle } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateDetalleInput = {
  productoId: number;
  talle: string;
  stock: number;
};

type UpdateDetalleInput = Partial<CreateDetalleInput>;

export class DetalleController extends BaseController<Detalle, CreateDetalleInput, UpdateDetalleInput> {
  constructor(prisma: PrismaClient) {
    const detalleService = new GenericService<Detalle, CreateDetalleInput, UpdateDetalleInput>(
      prisma,
      prisma.detalle
    );
    super(detalleService);
  }
}
