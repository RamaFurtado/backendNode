import { z } from 'zod';

export const CreateDireccionSchema = z.object({
  calle: z.string(),
  numero: z.string(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string(),
  codigoPostal: z.string()
});

export type CreateDireccionInput = z.infer<typeof CreateDireccionSchema>;
