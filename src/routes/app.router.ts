import { Router } from 'express';
import usuarioRoutes from './usuario.routes';
import productoRoutes from './producto.routes';
import descuentoRoutes from './descuento.routes';
import categoriaRoutes from './categoria.routes';


const appRouter = Router();

appRouter.use('/usuarios', usuarioRoutes);
appRouter.use('/productos', productoRoutes);
appRouter.use('/descuentos', descuentoRoutes);
appRouter.use('/categorias', categoriaRoutes);

export default appRouter;
