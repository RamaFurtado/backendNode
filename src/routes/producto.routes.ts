// producto.routes.ts - ACTUALIZADO con autenticación
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductoController } from '../controllers/ProductoController';
import { validate } from '../middlewares/validate.middleware';
import { 
  authenticateToken, 
  requireAdmin, 
  requireUser,
  optionalAuth 
} from '../middlewares/auth.middleware';
import { ProductoRequestSchema } from '../dtos/ProductoRequestDTO';

const prisma = new PrismaClient();
const controller = new ProductoController(prisma);
const router = Router();

// Helper para async handlers
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
  return (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      console.error('Route error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
  };
};

// ============= RUTAS PÚBLICAS =============

// Ver todos los productos (público, pero con info de usuario si está autenticado)
router.get('/', 
  optionalAuth, // Token opcional
  asyncHandler(async (req: Request, res: Response) => {
    // Aquí podrías mostrar diferentes productos según si está autenticado
    await controller.getAll(req, res);
  })
);

// Ver producto específico (público)
router.get('/:id', 
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.getById(req, res);
  })
);

// ============= RUTAS PROTEGIDAS - SOLO USUARIOS AUTENTICADOS =============

// ============= RUTAS ADMINISTRATIVAS - SOLO ADMIN =============

// Crear producto (solo admin)
router.post('/', 
  authenticateToken,      // Debe estar autenticado
  requireAdmin,           // Debe ser admin
  validate(ProductoRequestSchema), 
  asyncHandler(async (req: Request, res: Response) => {
    await controller.create(req, res);
  })
);

// Actualizar producto (solo admin)
router.put('/:id', 
  authenticateToken,
  requireAdmin,
  validate(ProductoRequestSchema), 
  asyncHandler(async (req: Request, res: Response) => {
    await controller.update(req, res);
  })
);

// Actualización parcial (solo admin)
router.patch('/:id', 
  authenticateToken,
  requireAdmin,
  // validate(ProductoUpdateSchema), // Si tienes schema parcial
  asyncHandler(async (req: Request, res: Response) => {
    await controller.update(req, res);
  })
);

// Eliminar producto (solo admin)
router.delete('/:id', 
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.delete(req, res);
  })
);

// ============= RUTAS ESPECÍFICAS CON LÓGICA CONDICIONAL =============

// Ejemplo: Crear reseña de producto (solo usuarios autenticados)
router.post('/:id/reviews', 
  authenticateToken,
  requireUser, // Admin o Usuario normal
  asyncHandler(async (req: Request, res: Response) => {
    // Aquí podrías crear una reseña
    // req.usuario contiene la info del usuario autenticado
    const productoId = parseInt(req.params.id);
    const usuarioId = req.usuario!.id;
    
    res.json({
      message: 'Reseña creada',
      productoId,
      usuarioId,
      usuario: req.usuario
    });
  })
);

// Ejemplo: Agregar a favoritos (solo usuarios autenticados)
router.post('/:id/favorite', 
  authenticateToken,
  requireUser,
  asyncHandler(async (req: Request, res: Response) => {
    const productoId = parseInt(req.params.id);
    const usuarioId = req.usuario!.id;
    
    // Lógica para agregar a favoritos
    res.json({
      message: 'Producto agregado a favoritos',
      productoId,
      usuarioId
    });
  })
);

// Ejemplo: Ver estadísticas de producto (solo admin)
router.get('/:id/stats', 
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const productoId = parseInt(req.params.id);
    
    // Lógica para obtener estadísticas
    res.json({
      message: 'Estadísticas del producto',
      productoId,
      // ... estadísticas
    });
  })
);

export default router;