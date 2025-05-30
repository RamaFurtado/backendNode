
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioController } from '../controllers/UsuarioController';
import { CreateUsuarioSchema } from '../dtos/UsuarioDTO';
import { validate } from '../middlewares/validate.middleware';

const router = Router();
const prisma = new PrismaClient();
const usuarioController = new UsuarioController(prisma);

// Crear usuario
router.post('/', validate(CreateUsuarioSchema), (req, res) => usuarioController.create(req, res));

// Obtener todos
router.get('/', (req, res) => usuarioController.getAll(req, res));

// Obtener por ID
router.get('/:id', (req, res) => usuarioController.getById(req, res));

// Actualizar por ID
router.put('/:id', (req, res) => usuarioController.update(req, res));

// Eliminar (soft-delete o hard) por ID
router.delete('/:id', (req, res) => usuarioController.delete(req, res));

export default router;
