import { PrismaClient, Direccion } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateDireccionInput = {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  usuarioId: number;
};

type UpdateDireccionInput = Partial<CreateDireccionInput>;

export class DireccionController extends BaseController<Direccion, CreateDireccionInput, UpdateDireccionInput> {
  constructor(prisma: PrismaClient) {
    const direccionService = new GenericService<Direccion, CreateDireccionInput, UpdateDireccionInput>(
      prisma,
      prisma.direccion
    );
    super(direccionService);
  }
}
