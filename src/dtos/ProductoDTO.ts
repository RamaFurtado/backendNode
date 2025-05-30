import { z } from "zod";
import { Sexo } from '@prisma/client';

const CategoriaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
});

const TalleSchema = z.object({
  id: z.number(),
  talle: z.string(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
});

const ImagenSchema = z.object({
  id: z.number(),
  url: z.string(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
});

const PrecioSchema = z.object({
  id: z.number(),
  precioCompra: z.number().optional(),
  precioVenta: z.number().optional(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
});

const DetalleImagenSchema = z.object({
  id: z.number(),
  detalleId: z.number().optional(),
  imagenId: z.number().optional(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
  imagen: ImagenSchema.optional(),
});

const DetalleSchema = z.object({
  id: z.number(),
  estado: z.boolean().optional(),
  color: z.string().optional(),
  marca: z.string().optional(),
  stock: z.number(),
  productoId: z.number().optional(),
  precioId: z.number().optional(),
  talleId: z.number().optional(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
  precio: PrecioSchema.optional(),
  talle: TalleSchema.optional(),
  imagenes: z.array(DetalleImagenSchema),
});

export const ProductoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  sexo: z.nativeEnum(Sexo).optional(),
  tipoProducto: z.string(),
  categoriaId: z.number().optional(),
  activo: z.boolean(),
  fechaCreacion: z.date(),
  fechaActualizacion: z.date(),
  categoria: CategoriaSchema.optional(),
  detalles: z.array(DetalleSchema),
});

export type ProductoDTO = z.infer<typeof ProductoSchema>;
export type CategoriaDTO = z.infer<typeof CategoriaSchema>;
export type DetalleDTO = z.infer<typeof DetalleSchema>;
export type TalleDTO = z.infer<typeof TalleSchema>;
export type ImagenDTO = z.infer<typeof ImagenSchema>;
export type PrecioDTO = z.infer<typeof PrecioSchema>;