import { PrismaClient, Descuento } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateDescuentoInput = {
  codigo: string;
  porcentaje: number;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
};

type UpdateDescuentoInput = Partial<CreateDescuentoInput>;

export class DescuentoController extends BaseController<Descuento, CreateDescuentoInput, UpdateDescuentoInput> {
  constructor(prisma: PrismaClient) {
    const descuentoService = new GenericService<Descuento, CreateDescuentoInput, UpdateDescuentoInput>(
      prisma,
      prisma.descuento
    );
    super(descuentoService);
  }
}
