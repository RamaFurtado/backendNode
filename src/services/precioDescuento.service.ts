import { prisma } from '../lib/prisma';

export const crearPrecioDescuento = async (data: any) => {
  return prisma.precioDescuento.create({
    data,
    include: {
      precio: true,
      descuento: true,
    },
  });
};

export const obtenerPreciosDescuento = async () => {
  return prisma.precioDescuento.findMany({
    include: {
      precio: true,
      descuento: true,
    },
  });
};

export const obtenerPrecioDescuentoPorId = async (id: number) => {
  return prisma.precioDescuento.findUnique({
    where: { id },
    include: {
      precio: true,
      descuento: true,
    },
  });
};

export const actualizarPrecioDescuento = async (id: number, data: any) => {
  return prisma.precioDescuento.update({
    where: { id },
    data,
  });
};

export const desactivarPrecioDescuento = async (id: number) => {
  return prisma.precioDescuento.update({
    where: { id },
    data: { activo: false },
  });
};
