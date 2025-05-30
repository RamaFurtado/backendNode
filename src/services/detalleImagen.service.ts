import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { DetalleImagen, Imagen } from '@prisma/client';

export class DetalleImagenService extends GenericService<DetalleImagen, any, any> {
  constructor() {
    super(prisma, prisma.detalleImagen);
  }

  async create(data: { detalleId: number; imagenId: number }): Promise<DetalleImagen> {
    const { detalleId, imagenId } = data;

    const detalle = await prisma.detalle.findUnique({ where: { id: detalleId } });
    if (!detalle) throw new Error('Detalle no encontrado');

    const imagen = await prisma.imagen.findUnique({ where: { id: imagenId } });
    if (!imagen) throw new Error('Imagen no encontrada');

    const existeRelacion = await prisma.detalleImagen.findFirst({
      where: { detalleId, imagenId },
    });
    if (existeRelacion) throw new Error('Ya existe la relación');

    return prisma.detalleImagen.create({ data });
  }

  async obtenerImagenesPorDetalle(detalleId: number): Promise<Imagen[]> {
  const relaciones = await prisma.detalleImagen.findMany({
    where: { detalleId },
    include: { imagen: true },
  });

  return relaciones
    .map(rel => rel.imagen)
    .filter((img): img is Imagen => img !== null);
}
  async eliminarPorDetalle(detalleId: number): Promise<void> {
    await prisma.detalleImagen.deleteMany({ where: { detalleId } });
  }

  async eliminarPorImagen(imagenId: number): Promise<void> {
    await prisma.detalleImagen.deleteMany({ where: { imagenId } });
  }
}
