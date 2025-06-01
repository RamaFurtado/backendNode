import z from "zod";
import { Rol } from "@prisma/client";

export const UsuarioRegistroSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
  dni: z.string().min(1, { message: "El DNI es obligatorio" }),
  rol: z.enum(["USUARIO", "ADMIN"]).default("USUARIO"),
  // direccion?: se puede agregar opcionalmente luego si querés
});
export type UsuarioRegistroDTO = z.infer<typeof UsuarioRegistroSchema>;