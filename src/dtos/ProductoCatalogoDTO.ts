import { z } from 'zod';


export const ProductoCatalogoSchema = z.object({
  id: z.number().int(),
  nombre: z.string(),
  marca: z.string(),
  color: z.string(),
  precio: z.number(),
  categoria: z.string(),
  imagenUrl: z.string(),
});
export type ProductoCatalogoDTO = z.infer<typeof ProductoCatalogoSchema>;