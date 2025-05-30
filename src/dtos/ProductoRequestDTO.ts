import { z } from "zod";
import { Sexo, TipoProducto, Rol } from '@prisma/client';


const TipoProductoEnum = z.enum(['REMERA', 'SHORT', 'ZAPATILLA', 'ACCESORIO']);

export const ProductoRequestSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre no debe estar vacío" }),
  sexo: z.nativeEnum(Sexo, { errorMap: () => ({ message: "El sexo no debe ser nulo" }) }).optional(),
  tipoProducto: z.string().min(1, { message: "El tipo de producto no debe estar vacío" }),
  categoriaNombre: z.string().min(1, { message: "La categoría no debe ser nula" }),
  talle: z.string().min(1, { message: "El talle no debe ser nulo" }),
  color: z.string().min(1, { message: "El color no debe estar vacío" }),
  marca: z.string().min(1, { message: "La marca no debe estar vacía" }),
  stock: z.number().int().min(0, { message: "El stock no puede ser negativo" }),
  estado: z.boolean().optional().default(true),
  precioCompra: z.number().positive({ message: "El precio de compra debe ser positivo" }).optional(),
  precioVenta: z.number().positive({ message: "El precio de venta debe ser positivo" }).optional(),
  imagenesUrls: z.array(z.string().url()).min(1, { message: "Debe haber al menos una imagen" }),
});
export const ProductoUpdateSchema = ProductoRequestSchema.partial();

export type ProductoRequestDTO = z.infer<typeof ProductoRequestSchema>;