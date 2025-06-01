import { z } from 'zod';

export const CreateDescuentoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  porcentaje: z.number().min(0).max(100, 'Porcentaje inválido'),
  activo: z.boolean().default(true),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});

export type CreateDescuentoInput = z.infer<typeof CreateDescuentoSchema>;
export type UpdateDescuentoInput = Partial<CreateDescuentoInput>;
