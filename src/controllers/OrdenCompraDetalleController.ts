import { PrismaClient, OrdenCompraDetalle } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateOrdenCompraDetalleInput = {
  ordenCompraId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
};

type UpdateOrdenCompraDetalleInput = Partial<CreateOrdenCompraDetalleInput>;

export class OrdenCompraDetalleController extends BaseController<OrdenCompraDetalle, CreateOrdenCompraDetalleInput, UpdateOrdenCompraDetalleInput> {
  constructor(prisma: PrismaClient) {
    const ordenCompraDetalleService = new GenericService<OrdenCompraDetalle, CreateOrdenCompraDetalleInput, UpdateOrdenCompraDetalleInput>(
      prisma,
      prisma.ordenCompraDetalle
    );
    super(ordenCompraDetalleService);
  }
}
