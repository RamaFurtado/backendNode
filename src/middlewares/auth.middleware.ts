import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';

// Extender el tipo Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        email: string;
        rol: Rol;
      };
    }
  }
}

export interface JWTPayload {
  id: number;
  email: string;
  rol: Rol;
  iat?: number;
  exp?: number;
}

// Middleware principal de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token válido en el header Authorization' 
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'tu_secreto'
    ) as JWTPayload;

    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicie sesión nuevamente' 
      });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido' 
      });
      return;
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al verificar el token' 
    });
    return;
  }
};

// Middleware para verificar roles específicos
export const requireRole = (...roles: Rol[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ 
        error: 'Usuario no autenticado',
        message: 'Debe estar autenticado para acceder a este recurso' 
      });
      return;
    }

    if (!roles.includes(req.usuario.rol)) {
      res.status(403).json({ 
        error: 'Permisos insuficientes',
        message: `Se requiere uno de los siguientes roles: ${roles.join(', ')}` 
      });
      return;
    }

    next();
  };
};

// Middleware específicos por rol
export const requireAdmin = requireRole(Rol.ADMIN);
export const requireUser = requireRole(Rol.USUARIO, Rol.ADMIN);

// Middleware opcional - no falla si no hay token
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next(); // Continúa sin usuario
    return;
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'tu_secreto'
    ) as JWTPayload;

    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
  } catch (error) {
    // Si el token es inválido, simplemente continúa sin usuario
    console.warn('Token opcional inválido:', error);
  }

  next();
};

// Middleware para verificar que el usuario esté activo
export const requireActiveUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.usuario) {
    res.status(401).json({ 
      error: 'Usuario no autenticado',
      message: 'Debe estar autenticado para acceder a este recurso' 
    });
    return;
  }

  try {
    // Aquí podrías verificar en la DB si el usuario sigue activo
    // const { prisma } = require('../lib/prisma');
    // const usuario = await prisma.usuario.findUnique({
    //   where: { id: req.usuario.id }
    // });
    // 
    // if (!usuario || !usuario.activo) {
    //   return res.status(403).json({ 
    //     error: 'Usuario desactivado',
    //     message: 'Su cuenta ha sido desactivada' 
    //   });
    // }

    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al verificar el estado del usuario' 
    });
    return;
  }
};