import multer from 'multer';

const storage = multer.memoryStorage(); // Guarda archivos en memoria para subirlos directo a Cloudinary
const upload = multer({ storage });

export default upload;
