import z from "zod";

export const UsuarioResponseSchema = z.object({
  id: z.number().int(),
  nombre: z.string(),
  email: z.string(),
  dni: z.string(),
  rol: z.string(),
});