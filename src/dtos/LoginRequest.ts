import z from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email({ message: "Ingrese un email válido" }),
  password: z.string().min(1, { message: "La contraseña no puede estar vacía" }),
});
export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;