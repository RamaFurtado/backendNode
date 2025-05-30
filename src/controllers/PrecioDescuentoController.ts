import { PrismaClient, PrecioDescuento } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreatePrecioDescuentoInput = {
  precioId: number;
  descuentoId: number;
};

type UpdatePrecioDescuentoInput = Partial<CreatePrecioDescuentoInput>;

export class PrecioDescuentoController extends BaseController<PrecioDescuento, CreatePrecioDescuentoInput, UpdatePrecioDescuentoInput> {
  constructor(prisma: PrismaClient) {
    const precioDescuentoService = new GenericService<PrecioDescuento, CreatePrecioDescuentoInput, UpdatePrecioDescuentoInput>(
      prisma,
      prisma.precioDescuento
    );
    super(precioDescuentoService);
  }
}
