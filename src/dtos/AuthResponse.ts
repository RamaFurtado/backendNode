import z from "zod";

export const AuthResponseSchema = z.object({
  jwt: z.string(),
});
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;