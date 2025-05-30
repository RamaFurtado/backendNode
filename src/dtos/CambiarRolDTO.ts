import { Rol } from "@prisma/client";
import z from "zod";

export const CambiarRolSchema = z.object({
  id: z.number().int(),
  nuevoRol: z.nativeEnum(Rol),
});
export type CambiarRolDTO = z.infer<typeof CambiarRolSchema>;