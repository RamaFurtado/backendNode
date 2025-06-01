import { Router } from 'express'
import * as UsuarioDireccionController from  '../controllers/UsuarioDireccionController'

const router = Router()

router.get('/', UsuarioDireccionController.getAll)
router.get('/:id', UsuarioDireccionController.getById)
router.post('/', UsuarioDireccionController.create)
router.put('/:id', UsuarioDireccionController.update)
router.delete('/:id', UsuarioDireccionController.remove)

export default router
