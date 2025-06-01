// producto.routes.ts - ACTUALIZADO con autenticación
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductoController } from '../controllers/ProductoController';
import { validate } from '../middlewares/validate.middleware';
import { 
  authenticateToken, 
  requireAdmin, 
  optionalAuth 
} from '../middlewares/auth.middleware';
import { ProductoRequestSchema } from '../dtos/ProductoRequestDTO';

import upload from '../middlewares/upload.middleware'; // Middleware para manejar la subida de imágenes
import { uploadImage } from '../lib/cloudinaryUploader';

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

router.get('/', 
  optionalAuth, 
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


// ============= RUTAS ADMINISTRATIVAS - SOLO ADMIN =============

// Crear producto (solo admin)
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.array('imagenes'), // ← esto está bien
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Debes subir al menos una imagen' });
    }

    // Subir imágenes a Cloudinary
    const imagenesUrls: string[] = await Promise.all(
      files.map(file => uploadImage(file.buffer, 'productos'))
    );

    // Adjuntar al body para que el controller las reciba
    req.body.imagenesUrls = imagenesUrls;

    // Llamar al controlador
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


// Eliminar producto (solo admin)
router.delete('/:id', 
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    await controller.delete(req, res);
  })
);


export default router;