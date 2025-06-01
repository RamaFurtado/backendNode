import { Request, Response } from 'express';
import { PrismaClient, Rol } from '@prisma/client';
import { UsuarioService } from '../services/usuario.service';
import { LoginRequestDTO } from '../dtos/LoginRequest';
import { UsuarioRegistroDTO } from '../dtos/UsuarioRegistroDTO';
import { CreateUsuarioInput } from '../dtos/UsuarioDTO';


export class AuthController {
  private usuarioService: UsuarioService;

  constructor(prisma: PrismaClient) {
    this.usuarioService = new UsuarioService();
  }

  // Login de usuario
  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequestDTO = req.body;

      const resultado = await this.usuarioService.login(email, password);

      // No devolver la contraseña en la respuesta
      const { password: _, ...usuarioSinPassword } = resultado.usuario;

      res.json({
        message: 'Login exitoso',
        token: resultado.token,
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error instanceof Error) {
        // Errores específicos del servicio
        if (error.message.includes('Usuario o contraseña incorrectos')) {
          return res.status(401).json({ 
            error: 'Credenciales inválidas',
            message: 'Email o contraseña incorrectos' 
          });
        }
        
        if (error.message.includes('Usuario desactivado')) {
          return res.status(403).json({ 
            error: 'Cuenta desactivada',
            message: 'Su cuenta ha sido desactivada. Contacte al administrador.' 
          });
        }
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al procesar el login'
      });
    }
  }

  // Registro de usuario simple
  async register(req: Request, res: Response) {
    try {
      const data: UsuarioRegistroDTO = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await this.usuarioService.findByEmail?.(data.email);
      if (usuarioExistente) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario con este email'
        });
      }

      const nuevoUsuario = await this.usuarioService.create({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        dni: data.dni,
        rol: data.rol || Rol.USUARIO
      });

      // No devolver la contraseña
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en register:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          error: 'Email ya registrado',
          message: 'El email ya está en uso'
        });
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al registrar el usuario'
      });
    }
  }

  // Registro con dirección
  async registerWithAddress(req: Request, res: Response) {
    try {
      const data: CreateUsuarioInput = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await this.usuarioService.findByEmail?.(data.email);
      if (usuarioExistente) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario con este email'
        });
      }

      let nuevoUsuario;

      if (data.direccion) {
        // Crear usuario con dirección
        nuevoUsuario = await this.usuarioService.createWithDireccion({
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          dni: data.dni,
          rol: data.rol,
          direccion: data.direccion
        });
      } else {
        // Crear usuario simple
        nuevoUsuario = await this.usuarioService.create({
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          dni: data.dni,
          rol: data.rol
        });
      }

      // No devolver la contraseña
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en registerWithAddress:', error);
      
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          error: 'Email ya registrado',
          message: 'El email ya está en uso'
        });
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al registrar el usuario'
      });
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          error: 'No autenticado',
          message: 'Usuario no autenticado'
        });
      }

      const usuario = await this.usuarioService.findByIdWithRelations(req.usuario.id);
      
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'El usuario no existe'
        });
      }

      // No devolver la contraseña
      const { password: _, ...usuarioSinPassword } = usuario;

      res.json({
        message: 'Perfil obtenido exitosamente',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al obtener el perfil'
      });
    }
  }

  // Refrescar token (opcional - para tokens de corta duración)
  async refreshToken(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          error: 'No autenticado',
          message: 'Usuario no autenticado'
        });
      }

      // Generar nuevo token
      const jwt = require('jsonwebtoken');
      const newToken = jwt.sign(
        { 
          id: req.usuario.id, 
          email: req.usuario.email, 
          rol: req.usuario.rol 
        },
        process.env.JWT_SECRET || 'tu_secreto',
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Token refrescado exitosamente',
        token: newToken
      });
    } catch (error) {
      console.error('Error en refreshToken:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al refrescar el token'
      });
    }
  }

  // Logout (opcional - para invalidar tokens del lado del servidor)
  async logout(req: Request, res: Response) {
    try {
      // En una implementación con blacklist de tokens, aquí agregarías el token actual
      // await addTokenToBlacklist(req.headers.authorization?.split(' ')[1]);
      
      res.json({
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Error al cerrar sesión'
      });
    }
  }
}