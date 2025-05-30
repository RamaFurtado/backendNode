
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { DescuentoController } from '../controllers/DescuentoController';
import { validate } from '../middlewares/validate.middleware';
import { CreateDescuentoSchema } from '../dtos/DescuentoDTO';

const prisma = new PrismaClient();
const controller = new DescuentoController(prisma);
const router = Router();

router.post('/', validate(CreateDescuentoSchema), controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', validate(CreateDescuentoSchema), controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
