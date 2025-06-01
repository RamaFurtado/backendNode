import { Request, Response } from 'express';
import * as UsuarioDireccionService from '../services/usuarioDireccion.service';

// Obtener todas las direcciones de usuario
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await UsuarioDireccionService.obtenerDireccionesUsuario();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

// Obtener una dirección por ID
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const direccion = await UsuarioDireccionService.obtenerDireccionPorId(id);
    if (!direccion) {
      res.status(404).json({ mensaje: 'Dirección no encontrada' });
      return; // Solo return sin valor
    }
    res.json(direccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la dirección' });
  }
};

// Crear una nueva relación Usuario-Dirección
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevaRelacion = await UsuarioDireccionService.crearUsuarioDireccion(req.body);
    res.status(201).json(nuevaRelacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación' });
  }
};

// Actualizar una relación por ID
export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const actualizada = await UsuarioDireccionService.actualizarDireccion(id, req.body);
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la relación' });
  }
};

// Desactivar una relación (soft delete)
export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const desactivada = await UsuarioDireccionService.desactivarDireccion(id);
    res.json({ mensaje: 'Relación desactivada', desactivada });
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar la relación' });
  }
};