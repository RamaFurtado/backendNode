import { PrismaClient, Usuario } from '@prisma/client';
import { BaseController } from './BaseController';
import { CreateUsuarioInput, UpdateUsuarioInput } from '../dtos/UsuarioDTO';
import { UsuarioService } from '../services/usuario.service';

export class UsuarioController extends BaseController<Usuario, CreateUsuarioInput, UpdateUsuarioInput> {
  constructor(private prisma: PrismaClient) {
    const usuarioServiceInstance = new UsuarioService();
    
    // Sobrescribe el método create para usar createWithDireccion
    const usuarioService = {
      ...usuarioServiceInstance,
      
      async create(data: CreateUsuarioInput) {
        console.log(' Controlador: iniciando create');
        console.log(' Data recibida en controlador:', JSON.stringify(data, null, 2));
        
        // Verificar si el usuario quiere agregar dirección
        if (data.direccion && Object.keys(data.direccion).length > 0) {
          console.log(' Usuario eligió agregar dirección - usando createWithDireccion');
          
          // Usar el método que maneja la tabla intermedia UsuarioDireccion
          return await usuarioServiceInstance.createWithDireccion({
            nombre: data.nombre,
            email: data.email,
            password: data.password,
            dni: data.dni,
            rol: data.rol,
            direccion: data.direccion
          });
        } else {
          console.log(' Usuario NO agregó dirección - usando create simple');
          
          // Crear usuario sin dirección
          return await usuarioServiceInstance.create({
            nombre: data.nombre,
            email: data.email,
            password: data.password,
            dni: data.dni,
            rol: data.rol
          });
        }
      },
      
      getById: (id: number) => usuarioServiceInstance.getById(id),
      getAll: () => usuarioServiceInstance.getAll(),
      update: (id: number, data: UpdateUsuarioInput) => usuarioServiceInstance.update(id, data),
      delete: (id: number) => usuarioServiceInstance.delete(id),
    };

    super(usuarioService);
  }
}