import 'dotenv/config'; // 🔁 Esto debe ir primero de todo
import './lib/cloudinary'; // Luego se configura Cloudinary
import app from './app'; // Por último se importa app

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
