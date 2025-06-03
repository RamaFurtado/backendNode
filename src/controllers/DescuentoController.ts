import { Request, Response } from 'express';
import { PrismaClient, Descuento } from '@prisma/client';
import { DescuentoService } from '../services/descuento.service';
import { BaseController } from './BaseController';


type CreateDescuentoInput = {
  porcentaje: number;
  descripcion?: string;
  fechaInicio: Date;
  fechaFinal: Date;
  activo?: boolean;
};

type UpdateDescuentoInput = Partial<CreateDescuentoInput>;

export class DescuentoController extends BaseController<Descuento, CreateDescuentoInput, UpdateDescuentoInput> {
  private descuentoService: DescuentoService;

  constructor(prisma: PrismaClient) {
    const descuentoService = new DescuentoService();
    super(descuentoService);
    this.descuentoService = descuentoService;
  }

  
 create = async (req: Request, res: Response) => {
    try {
      const result = await this.descuentoService.create(req.body);
      res.status(201).json({
        message: 'Descuento creado exitosamente',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  
  async aplicarDescuentoADetalle(req: Request, res: Response) {
    try {
      const { descuentoId, detalleId } = req.body;
      
      const precioDescuento = await this.descuentoService.aplicarDescuentoADetalle(
        parseInt(descuentoId), 
        parseInt(detalleId)
      );
      
      res.status(201).json({
        message: 'Descuento aplicado exitosamente al detalle',
        data: precioDescuento
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  
  async aplicarDescuentoAProducto(req: Request, res: Response) {
    try {
      const { descuentoId, productoId } = req.body;
      
      const preciosDescuento = await this.descuentoService.aplicarDescuentoAProducto(
        parseInt(descuentoId), 
        parseInt(productoId)
      );
      
      res.status(201).json({
        message: 'Descuento aplicado exitosamente al producto',
        data: preciosDescuento
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener productos con descuentos
  async obtenerProductosConDescuento(req: Request, res: Response) {
    try {
      const productos = await this.descuentoService.obtenerProductosConDescuento();
      
      res.status(200).json({
        message: 'Productos con descuento obtenidos exitosamente',
        data: productos
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // Remover descuento de un detalle
  async removerDescuentoDeDetalle(req: Request, res: Response) {
    try {
      const { descuentoId, detalleId } = req.body;
      
      await this.descuentoService.removerDescuentoDeDetalle(
        parseInt(descuentoId), 
        parseInt(detalleId)
      );
      
      res.status(200).json({
        message: 'Descuento removido exitosamente del detalle'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener descuentos activos
  async obtenerDescuentosActivos(req: Request, res: Response) {
    try {
      const descuentos = await this.descuentoService.obtenerActivos();
      
      res.status(200).json({
        message: 'Descuentos activos obtenidos exitosamente',
        data: descuentos
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}