import { z } from 'zod';

export const CreateDescuentoSchema = z.object({
  porcentaje: z.number().min(0).max(100, 'Porcentaje inválido'),
  descripcion: z.string().optional(),
  fechaInicio: z.string().refine((str) => {
    // Validar formato YYYY/MM/DD o YYYY-MM-DD
    const regex = /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/;
    return regex.test(str);
  }, 'Formato de fecha inválido. Use YYYY/MM/DD o YYYY-MM-DD').transform((str) => {
    const [year, month, day] = str.split(/[\/\-]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }),
  fechaFinal: z.string().refine((str) => {
    // Validar formato YYYY/MM/DD o YYYY-MM-DD
    const regex = /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/;
    return regex.test(str);
  }, 'Formato de fecha inválido. Use YYYY/MM/DD o YYYY-MM-DD').transform((str) => {
    const [year, month, day] = str.split(/[\/\-]/);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
  }),
  activo: z.boolean().default(true),
});

export type CreateDescuentoInput = z.infer<typeof CreateDescuentoSchema>;
export type UpdateDescuentoInput = Partial<CreateDescuentoInput>;