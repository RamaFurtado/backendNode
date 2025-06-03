import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { DescuentoController } from '../controllers/DescuentoController';
import { validate } from '../middlewares/validate.middleware';
import { CreateDescuentoSchema } from '../dtos/DescuentoDTO';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const controller = new DescuentoController(prisma);
const router = Router();

// Rutas CRUD básicas protegidas (solo admin)
router.post('/', authenticateToken, requireAdmin, validate(CreateDescuentoSchema), controller.create.bind(controller));
router.put('/:id', authenticateToken, requireAdmin, validate(CreateDescuentoSchema), controller.update.bind(controller));
router.delete('/:id', authenticateToken, requireAdmin, controller.delete.bind(controller));

// Rutas para aplicar descuentos (solo admin)
router.post('/aplicar-detalle', authenticateToken, requireAdmin, controller.aplicarDescuentoADetalle.bind(controller));
router.post('/aplicar-producto', authenticateToken, requireAdmin, controller.aplicarDescuentoAProducto.bind(controller));
router.delete('/remover-detalle', authenticateToken, requireAdmin, controller.removerDescuentoDeDetalle.bind(controller));

// Rutas públicas de consulta
router.get('/', controller.getAll.bind(controller));
router.get('/activos', controller.obtenerDescuentosActivos.bind(controller));
router.get('/productos-con-descuento', controller.obtenerProductosConDescuento.bind(controller));
router.get('/:id', controller.getById.bind(controller));

export default router;