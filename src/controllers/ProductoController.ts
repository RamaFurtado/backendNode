import { uploadImage } from '../lib/cloudinaryUploader';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../services/producto.service';
import { ProductoRequestDTO, ProductoRequestSchema } from '../dtos/ProductoRequestDTO';
import { ZodError } from 'zod';


export class ProductoController {
  private productService: ProductService;

  constructor(prisma: PrismaClient) {
/**
 * Initializes the ProductoController with a given PrismaClient instance.
 * 
 * @param prisma 
 */

    this.productService = new ProductService(prisma);
  }

  async create(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Debe subir al menos una imagen' });
    }

    // Subir imágenes a Cloudinary
    const imagenesUrls: string[] = await Promise.all(
      files.map(file => uploadImage(file.buffer))
    );

    // Armar objeto con todos los datos, convirtiendo valores necesarios
    const rawData = {
      ...req.body,
      precioCompra: req.body.precioCompra,
      precioVenta: req.body.precioVenta,
      stock: req.body.stock,
      estado: req.body.estado,
      imagenesUrls
    };

    // Validar y transformar con Zod
    const data = ProductoRequestSchema.parse(rawData);

    // Crear producto
    const producto = await this.productService.create(data);

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error creando producto:', error);

    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

  async getAll(req: Request, res: Response) {
    try {
      const productos = await this.productService.getAll();
      res.json(productos);
    } catch (error) {
      console.error('Error getting productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const producto = await this.productService.getById(id);
      
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json(producto);
    } catch (error) {
      console.error('Error getting producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data: Partial<ProductoRequestDTO> = req.body;
      const producto = await this.productService.update(id, data);
      res.json(producto);
    } catch (error) {
      console.error('Error updating producto:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await this.productService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}