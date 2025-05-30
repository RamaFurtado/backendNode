import { PrismaClient, OrdenCompra } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateOrdenCompraInput = {
  usuarioId: number;
  total: number;
  estado: string;
};

type UpdateOrdenCompraInput = Partial<CreateOrdenCompraInput>;

export class OrdenCompraController extends BaseController<OrdenCompra, CreateOrdenCompraInput, UpdateOrdenCompraInput> {
  constructor(prisma: PrismaClient) {
    const ordenCompraService = new GenericService<OrdenCompra, CreateOrdenCompraInput, UpdateOrdenCompraInput>(
      prisma,
      prisma.ordenCompra
    );
    super(ordenCompraService);
  }
}
