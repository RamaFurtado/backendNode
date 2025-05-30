import { PrismaClient } from '@prisma/client';

export class GenericService<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected modelDelegate: any;

  constructor(prisma: PrismaClient, modelDelegate: any) {
    this.prisma = prisma;
    this.modelDelegate = modelDelegate;
  }

  async create(data: CreateInput): Promise<T> {
    return this.modelDelegate.create({ data });
  }

  async getById(id: number): Promise<T> {
    const entity = await this.modelDelegate.findUnique({ where: { id } });
    if (!entity) throw new Error('Entidad no encontrada');
    return entity;
  }

  async getAll(): Promise<T[]> {
    return this.modelDelegate.findMany();
  }

  async update(id: number, data: UpdateInput): Promise<T> {
    const exists = await this.modelDelegate.findUnique({ where: { id } });
    if (!exists) throw new Error('Entidad no encontrada para actualizar');
    return this.modelDelegate.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    const exists = await this.modelDelegate.findUnique({ where: { id } });
    if (!exists) throw new Error('Entidad no encontrada para eliminar');
    await this.modelDelegate.delete({ where: { id } });
  }
}