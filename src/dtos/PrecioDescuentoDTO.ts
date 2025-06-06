import { z } from 'zod';


export const PrecioDescuentoSchema = z.object({
  precioId: z.number().int(),
  descuentoId: z.number().int(),
});
export type PrecioDescuentoDTO = z.infer<typeof PrecioDescuentoSchema>;
