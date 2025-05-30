import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CategoriaController } from '../controllers/CategoriaController';
import { validate } from '../middlewares/validate.middleware';
import { CreateCategoriaSchema } from '../dtos/CategoriaDTO';

const prisma = new PrismaClient();
const controller = new CategoriaController(prisma);
const router = Router();

router.post('/', validate(CreateCategoriaSchema), controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', validate(CreateCategoriaSchema), controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
