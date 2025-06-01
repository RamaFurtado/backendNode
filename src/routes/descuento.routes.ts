import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { DescuentoController } from '../controllers/DescuentoController';
import { validate } from '../middlewares/validate.middleware';
import { CreateDescuentoSchema } from '../dtos/DescuentoDTO';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const controller = new DescuentoController(prisma);
const router = Router();

// Protegidas
router.post('/', authenticateToken, requireAdmin, validate(CreateDescuentoSchema), controller.create.bind(controller));
router.put('/:id', authenticateToken, requireAdmin, validate(CreateDescuentoSchema), controller.update.bind(controller));
router.delete('/:id', authenticateToken, requireAdmin, controller.delete.bind(controller));

// Públicas
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));

export default router;
