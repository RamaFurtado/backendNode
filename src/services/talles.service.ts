import { prisma } from '../lib/prisma';

export const crearTalle = async (data: any) => {
  return await prisma.talles.create({ data });
};

export const obtenerTalles = async () => {
  return await prisma.talles.findMany();
};

export const obtenerTallePorId = async (id: number) => {
  return await prisma.talles.findUnique({ where: { id } });
};

export const actualizarTalle = async (id: number, data: any) => {
  return await prisma.talles.update({
    where: { id },
    data,
  });
};

export const desactivarTalle = async (id: number) => {
  return await prisma.talles.update({
    where: { id },
    data: { activo: false },
  });
};
