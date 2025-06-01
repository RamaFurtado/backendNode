import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';


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
    next(); 
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
   
    console.warn('Token opcional inválido:', error);
  }

  next();
};


export const requireSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const usuario = req.usuario;

  if (!usuario) {
    res.status(401).json({
      error: 'Usuario no autenticado',
      message: 'Debe estar autenticado para acceder a este recurso'
    });
    return;
  }
  if (usuario.rol === Rol.ADMIN || usuario.id === Number(req.params.id)) {
    next();
    return;
  }

  res.status(403).json({
    error: 'Acceso denegado',
    message: 'No tiene permiso para realizar esta acción'
  });
};

