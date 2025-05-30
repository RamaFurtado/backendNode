import { PrismaClient, Talles } from '@prisma/client';
import { GenericService } from '../services/generic.service';
import { BaseController } from './BaseController';

type CreateTallesInput = {
  talle: string;
};

type UpdateTallesInput = Partial<CreateTallesInput>;

export class TallesController extends BaseController<Talles, CreateTallesInput, UpdateTallesInput> {
  constructor(prisma: PrismaClient) {
    const tallesService = new GenericService<Talles, CreateTallesInput, UpdateTallesInput>(
      prisma,
      prisma.talles
    );
    super(tallesService);
  }
}
