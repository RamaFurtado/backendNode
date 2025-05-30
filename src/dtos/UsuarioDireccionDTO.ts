import z from "zod";


export const UsuarioDireccionSchema = z.object({
  usuarioId: z.number().int(),
  direccionId: z.number().int(),
});
export type UsuarioDireccionDTO = z.infer<typeof UsuarioDireccionSchema>;