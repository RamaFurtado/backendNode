import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CategoriaController } from '../controllers/CategoriaController';
import { validate } from '../middlewares/validate.middleware';
import { CreateCategoriaSchema } from '../dtos/CategoriaDTO';
import { authenticateToken, requireAdmin } from  '../middlewares/auth.middleware';

const prisma = new PrismaClient();
const controller = new CategoriaController(prisma);
const router = Router();

// Rutas protegidas
router.post('/',authenticateToken,requireAdmin, validate(CreateCategoriaSchema), controller.create.bind(controller));
router.delete('/:id',authenticateToken,requireAdmin, controller.delete.bind(controller));
router.put('/:id',authenticateToken,requireAdmin, validate(CreateCategoriaSchema), controller.update.bind(controller));

// Rutas públicas
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));




export default router;
