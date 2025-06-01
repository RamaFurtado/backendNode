import express from 'express';
import appRouter from './routes/app.router';
import authRoutes from './routes/auth.routes';
import productosRoutes from './routes/producto.routes';
import 'dotenv/config'; 
import './lib/cloudinary';  

const app = express();

app.use(express.json());
app.use('/api', appRouter); 
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;