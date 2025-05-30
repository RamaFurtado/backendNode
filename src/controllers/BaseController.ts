import { Request, Response } from 'express';

export class BaseController<T, CreateInput, UpdateInput> {
  constructor(protected service: {
    create(data: CreateInput): Promise<T>;
    getById(id: number): Promise<T>;
    getAll(): Promise<T[]>;
    update(id: number, data: UpdateInput): Promise<T>;
    delete(id: number): Promise<void>;
  }) {}

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateInput = req.body;
      const nuevo = await this.service.create(data);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const resultados = await this.service.getAll();
      res.json(resultados);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const entidad = await this.service.getById(id);
      res.json(entidad);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

 update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data: UpdateInput = req.body;
      const entidadActualizada = await this.service.update(id, data);
      res.json(entidadActualizada);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.delete(id);
      res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}
