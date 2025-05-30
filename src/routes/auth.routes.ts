import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate.middleware';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware';
import { LoginRequestSchema } from '../dtos/LoginRequest';
import { UsuarioRegistroSchema } from '../dtos/UsuarioRegistroDTO';
import { CreateUsuarioSchema } from '../dtos/UsuarioDTO';

const prisma = new PrismaClient();
const controller = new AuthController(prisma);
const router = Router();

// Helper para manejar async handlers
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
  return (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      console.error('Auth route error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
  };
};

// ============= RUTAS PÚBLICAS =============

// Login
router.post('/login', 
  validate(LoginRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await controller.login(req, res);
  })
);

// Registro simple
router.post('/register', 
  validate(UsuarioRegistroSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await controller.register(req, res);
  })
);

// Registro con dirección (completo)
router.post('/register-complete', 
  validate(CreateUsuarioSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await controller.registerWithAddress(req, res);
  })
);

// ============= RUTAS PROTEGIDAS =============

// Obtener perfil del usuario autenticado
router.get('/profile', 
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.getProfile(req, res);
  })
);

// Refrescar token
router.post('/refresh-token', 
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.refreshToken(req, res);
  })
);

// Logout
router.post('/logout', 
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.logout(req, res);
  })
);

// ============= RUTAS DE UTILIDAD =============

// Verificar si token es válido (útil para frontend)
router.get('/verify-token', 
  authenticateToken,
  (req: Request, res: Response) => {
    res.json({
      message: 'Token válido',
      usuario: req.usuario
    });
  }
);

// Obtener información pública (opcional auth)
router.get('/public-info', 
  optionalAuth,
  (req: Request, res: Response) => {
    res.json({
      message: 'Información pública',
      authenticated: !!req.usuario,
      usuario: req.usuario || null
    });
  }
);

export default router;