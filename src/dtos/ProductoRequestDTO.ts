import { z } from "zod";
import { Sexo, TipoProducto } from '@prisma/client';


const TipoProductoEnum = z.enum(['REMERA', 'SHORT', 'ZAPATILLA', 'ACCESORIO']);

export const ProductoRequestSchema = z.object({
  nombre: z.string().min(1),
  sexo: z.nativeEnum(Sexo).optional(),
  tipoProducto: z.string().min(1),
  categoriaNombre: z.string().min(1),
  talle: z.string().min(1),
  color: z.string().min(1),
  marca: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  estado: z.coerce.boolean().optional().default(true),
  precioCompra: z.coerce.number().positive().optional(),
  precioVenta: z.coerce.number().positive().optional(),
  imagenesUrls: z.array(z.string().url()).min(1)
});
export const ProductoUpdateSchema = ProductoRequestSchema.partial();

export type ProductoRequestDTO = z.infer<typeof ProductoRequestSchema>;