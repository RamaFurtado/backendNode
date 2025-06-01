import { Router } from 'express';
import usuarioRoutes from './usuario.routes';
import productoRoutes from './producto.routes';
import descuentoRoutes from './descuento.routes';
import categoriaRoutes from './categoria.routes';
import usuarioDireccionRoutes from './usuarioDireccion.routes';

const appRouter = Router();

appRouter.use('/usuarios', usuarioRoutes);
appRouter.use('/productos', productoRoutes);
appRouter.use('/descuentos', descuentoRoutes);
appRouter.use('/categorias', categoriaRoutes);
appRouter.use('/usuario-direccion', usuarioDireccionRoutes); 

export default appRouter;
