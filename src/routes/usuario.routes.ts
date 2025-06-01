
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UsuarioController } from '../controllers/UsuarioController';
import { CreateUsuarioSchema } from '../dtos/UsuarioDTO';
import { validate } from '../middlewares/validate.middleware';
import { authenticateToken, requireAdmin, requireSelfOrAdmin } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();
const usuarioController = new UsuarioController(prisma);

// Crear usuario
router.post('/', validate(CreateUsuarioSchema), (req, res) => usuarioController.create(req, res));

// Obtener todos (solo para admin)
router.get('/',authenticateToken, requireAdmin,(req, res) => usuarioController.getAll(req, res));

// Obtener por ID solo admin o el propio usuario
router.get('/:id',authenticateToken,requireSelfOrAdmin, (req, res) => usuarioController.getById(req, res));

// Actualizar por ID solo admin o el propio usuario
router.put('/:id',authenticateToken,requireSelfOrAdmin, (req, res) => usuarioController.update(req, res));

// Eliminar por ID solo admin o el propio usuario
router.delete('/:id',authenticateToken,requireSelfOrAdmin, (req, res) => usuarioController.delete(req, res));

export default router;
