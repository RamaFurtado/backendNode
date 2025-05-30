import { prisma } from '../lib/prisma';

export const crearUsuarioDireccion = async (data: any) => {
  return prisma.usuarioDireccion.create({
    data,
    include: { usuario: true },
  });
};

export const obtenerDireccionesUsuario = async () => {
  return prisma.usuarioDireccion.findMany({
    include: { usuario: true },
  });
};

export const obtenerDireccionPorId = async (id: number) => {
  return prisma.usuarioDireccion.findUnique({
    where: { id },
    include: { usuario: true },
  });
};

export const actualizarDireccion = async (id: number, data: any) => {
  return prisma.usuarioDireccion.update({
    where: { id },
    data,
  });
};

export const desactivarDireccion = async (id: number) => {
  return prisma.usuarioDireccion.update({
    where: { id },
    data: { activo: false },
  });
};
