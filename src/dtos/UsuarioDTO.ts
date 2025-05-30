
import { z } from 'zod';
import { Rol } from '@prisma/client';
import { CreateDireccionSchema } from './DireccionDTO';

export const CreateUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  dni: z.string().min(1, 'El DNI es obligatorio'),
  rol: z.nativeEnum(Rol).default('USUARIO'),
  direccion: CreateDireccionSchema.optional()
});

export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>;
export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;
