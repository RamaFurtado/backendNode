
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../services/producto.service';
import { ProductoRequestDTO } from '../dtos/ProductoRequestDTO';

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
      const data: ProductoRequestDTO = req.body;
      const producto = await this.productService.create(data);
      res.status(201).json(producto);
    } catch (error) {
      console.error('Error creating producto:', error);
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