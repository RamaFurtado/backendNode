import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { GenericService } from './generic.service';
import { Usuario, Rol } from '@prisma/client';

export class UsuarioService extends GenericService<Usuario, any, any> {
  constructor() {
    super(prisma, prisma.usuario);
  }

  // Crear usuario simple
  async create(data: {
    nombre: string;
    email: string;
    password: string;
    dni: string;
    rol?: string;
  }): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.modelDelegate.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
        dni: data.dni,
        rol: (data.rol as Rol) ?? Rol.USUARIO,
      },
    });
  }

  // Crear usuario junto con su dirección y relación intermedia
  async createWithDireccion(data: {
    nombre: string;
    email: string;
    password: string;
    dni: string;
    rol?: string;
    direccion: {
      calle?: string;
      numero?: string;
      ciudad?: string;
      provincia?: string;
      pais?: string;
      codigoPostal?: string;
      localidad?: string;
    };
  }): Promise<Usuario> {
    console.log('🚀 Iniciando createWithDireccion');
    console.log('📥 Data recibida:', JSON.stringify(data, null, 2));

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log('🔐 Password hasheado');

      return await prisma.$transaction(async (tx) => {
        console.log('📦 Iniciando transacción');

        // 1. Crear la dirección
        console.log('🏠 Creando dirección...');
        const direccionCreada = await tx.direccion.create({
          data: data.direccion,
        });
        console.log('✅ Dirección creada:', direccionCreada);

        // 2. Crear el usuario
        console.log('👤 Creando usuario...');
        const usuarioCreado = await tx.usuario.create({
          data: {
            nombre: data.nombre,
            email: data.email,
            password: hashedPassword,
            dni: data.dni,
            rol: (data.rol as Rol) ?? Rol.USUARIO,
          },
        });
        console.log('✅ Usuario creado:', usuarioCreado);

        // 3. Crear relación en UsuarioDireccion
        console.log('🔗 Creando relación...');
        console.log('🔗 Datos para relación:', {
          usuarioId: usuarioCreado.id,
          direccionId: direccionCreada.id,
          activo: true
        });

        const relacionCreada = await tx.usuarioDireccion.create({
          data: {
            usuarioId: usuarioCreado.id,
            direccionId: direccionCreada.id,
            activo: true,
          },
        });
        console.log('✅ Relación creada:', relacionCreada);

        // 4. Retornar el usuario con direcciones asociadas
        console.log('🔍 Buscando usuario con relaciones...');
        const usuarioConDirecciones = await tx.usuario.findUnique({
          where: { id: usuarioCreado.id },
          include: {
            direcciones: {
              include: {
                direccion: true
              }
            },
          },
        });

        console.log('✅ Usuario final:', JSON.stringify(usuarioConDirecciones, null, 2));

        if (!usuarioConDirecciones) {
          throw new Error('Error al recuperar el usuario creado');
        }

        return usuarioConDirecciones;
      });
    } catch (error) {
      console.error('❌ Error en createWithDireccion:', error);
      throw error;
    }
  }

  async getAll(): Promise<Usuario[]> {
    return this.modelDelegate.findMany();
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.modelDelegate.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    return this.modelDelegate.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.modelDelegate.delete({ where: { id } });
  }

  async findAllWithRelations() {
    return this.modelDelegate.findMany({
      include: {
        direcciones: {
          include: {
            direccion: true
          }
        },
        ordenes: true,
      },
    });
  }

  async findByIdWithRelations(id: number) {
    return this.modelDelegate.findUnique({
      where: { id },
      include: {
        direcciones: {
          include: {
            direccion: true
          }
        },
        ordenes: true,
      },
    });
  }

  async deactivate(id: number): Promise<Usuario> {
    return this.modelDelegate.update({
      where: { id },
      data: { activo: false },
    });
  }

  async login(email: string, password: string): Promise<{ token: string; usuario: Usuario }> {
    const usuario = await this.modelDelegate.findUnique({ where: { email } });
    if (!usuario) throw new Error('Usuario o contraseña incorrectos');
    if (!usuario.activo) throw new Error('Usuario desactivado');

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) throw new Error('Usuario o contraseña incorrectos');

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'tu_secreto',
      { expiresIn: '1d' }
    );

    return { token, usuario };
  }
  async findByEmail(email: string): Promise<Usuario | null> {
  return this.modelDelegate.findUnique({ 
    where: { email },
    include: {
      direcciones: {
        include: {
          direccion: true
        }
      }
    }
  });
}

// Verificar si un email ya existe
async emailExists(email: string): Promise<boolean> {
  const usuario = await this.modelDelegate.findUnique({
    where: { email },
    select: { id: true }
  });
  return !!usuario;
}

// Cambiar contraseña
async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
  const usuario = await this.modelDelegate.findUnique({ where: { id } });
  if (!usuario) throw new Error('Usuario no encontrado');

  const passwordValido = await bcrypt.compare(currentPassword, usuario.password);
  if (!passwordValido) throw new Error('Contraseña actual incorrecta');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await this.modelDelegate.update({
    where: { id },
    data: { password: hashedNewPassword }
  });
}

// Resetear contraseña (para funcionalidad "Olvidé mi contraseña")
async resetPassword(email: string, newPassword: string): Promise<void> {
  const usuario = await this.modelDelegate.findUnique({ where: { email } });
  if (!usuario) throw new Error('Usuario no encontrado');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await this.modelDelegate.update({
    where: { email },
    data: { password: hashedPassword }
  });
}

// Actualizar último acceso
async updateLastAccess(id: number): Promise<void> {
  await this.modelDelegate.update({
    where: { id },
    data: { 
      // Si tienes un campo lastLogin en tu modelo:
      // lastLogin: new Date()
      fechaActualizacion: new Date()
    }
  });
}

// Obtener usuarios por rol
async findByRole(rol: Rol): Promise<Usuario[]> {
  return this.modelDelegate.findMany({
    where: { rol },
    select: {
      id: true,
      nombre: true,
      email: true,
      dni: true,
      rol: true,
      activo: true,
      fechaCreacion: true
      // No incluir password
    }
  });
}
}