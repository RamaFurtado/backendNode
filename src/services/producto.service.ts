import { PrismaClient, Producto } from '@prisma/client';
import { ProductoRequestDTO } from '../dtos/ProductoRequestDTO';

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async create(data: ProductoRequestDTO): Promise<Producto> {
    // 1. Buscar o crear la categoría
    let categoria = await this.prisma.categoria.findUnique({
      where: { nombre: data.categoriaNombre }
    });

    if (!categoria) {
      categoria = await this.prisma.categoria.create({
        data: { nombre: data.categoriaNombre }
      });
    }

    // 2. Buscar o crear el talle
    let talle = await this.prisma.talles.findUnique({
      where: { talle: data.talle }
    });

    if (!talle) {
      talle = await this.prisma.talles.create({
        data: { talle: data.talle }
      });
    }

    // 3. Crear el precio
    const precio = await this.prisma.precio.create({
      data: {
        precioCompra: data.precioCompra,
        precioVenta: data.precioVenta
      }
    });

    // 4. Crear las imágenes
    const imagenes = await Promise.all(
      data.imagenesUrls.map(url => 
        this.prisma.imagen.create({
          data: { url }
        })
      )
    );

    // 5. Crear el producto con sus relaciones
    const producto = await this.prisma.producto.create({
      data: {
        nombre: data.nombre,
        sexo: data.sexo,
        tipoProducto: data.tipoProducto,
        categoria: {
          connect: { id: categoria.id }
        },
        detalles: {
          create: {
            estado: data.estado,
            color: data.color,
            marca: data.marca,
            stock: data.stock,
            precio: {
              connect: { id: precio.id }
            },
            talle: {
              connect: { id: talle.id }
            },
            imagenes: {
              create: imagenes.map(imagen => ({
                imagenId: imagen.id
              }))
            }
          }
        }
      },
      include: {
        categoria: true,
        detalles: {
          include: {
            precio: true,
            talle: true,
            imagenes: {
              include: {
                imagen: true
              }
            }
          }
        }
      }
    });

    return producto;
  }

  async getAll(): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      include: {
        categoria: true,
        detalles: {
          include: {
            precio: true,
            talle: true,
            imagenes: {
              include: {
                imagen: true
              }
            }
          }
        }
      }
    });
  }

  async getById(id: number): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
        detalles: {
          include: {
            precio: true,
            talle: true,
            imagenes: {
              include: {
                imagen: true
              }
            }
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<ProductoRequestDTO>): Promise<Producto> {
    // Verificar que el producto existe
    const existingProduct = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        detalles: {
          include: {
            precio: true,
            talle: true,
            imagenes: {
              include: {
                imagen: true
              }
            }
          }
        }
      }
    });

    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    const updateData: any = {};

    // Actualizar campos básicos del producto 
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.sexo !== undefined) updateData.sexo = data.sexo;
    if (data.tipoProducto !== undefined) updateData.tipoProducto = data.tipoProducto;

    // Manejar categoría 
    if (data.categoriaNombre) {
      let categoria = await this.prisma.categoria.findUnique({
        where: { nombre: data.categoriaNombre }
      });

      if (!categoria) {
        categoria = await this.prisma.categoria.create({
          data: { nombre: data.categoriaNombre }
        });
      }

      updateData.categoria = { connect: { id: categoria.id } };
    }

    // Actualizar detalles 
    const detallesUpdate: any = {};
    let needsDetallesUpdate = false;

    if (data.estado !== undefined) {
      detallesUpdate.estado = data.estado;
      needsDetallesUpdate = true;
    }
    if (data.color !== undefined) {
      detallesUpdate.color = data.color;
      needsDetallesUpdate = true;
    }
    if (data.marca !== undefined) {
      detallesUpdate.marca = data.marca;
      needsDetallesUpdate = true;
    }
    if (data.stock !== undefined) {
      detallesUpdate.stock = data.stock;
      needsDetallesUpdate = true;
    }

    // Manejar talle 
    if (data.talle) {
      let talle = await this.prisma.talles.findUnique({
        where: { talle: data.talle }
      });

      if (!talle) {
        talle = await this.prisma.talles.create({
          data: { talle: data.talle }
        });
      }

      detallesUpdate.talle = { connect: { id: talle.id } };
      needsDetallesUpdate = true;
    }

    // Manejar precio 
    if (data.precioCompra !== undefined || data.precioVenta !== undefined) {
      const currentPrecio = existingProduct.detalles[0]?.precio;
      
      if (currentPrecio) {
        // Actualizar precio existente
        await this.prisma.precio.update({
          where: { id: currentPrecio.id },
          data: {
            precioCompra: data.precioCompra ?? currentPrecio.precioCompra,
            precioVenta: data.precioVenta ?? currentPrecio.precioVenta
          }
        });
      } else {
        // Crear nuevo precio si no existe
        const nuevoPrecio = await this.prisma.precio.create({
          data: {
            precioCompra: data.precioCompra || 0,
            precioVenta: data.precioVenta || 0
          }
        });
        detallesUpdate.precio = { connect: { id: nuevoPrecio.id } };
        needsDetallesUpdate = true;
      }
    }

    // Manejar imágenes 
    if (data.imagenesUrls && data.imagenesUrls.length > 0) {
      // Eliminar relaciones de imágenes existentes
      if (existingProduct.detalles[0]) {
        await this.prisma.detalleImagen.deleteMany({
          where: { detalleId: existingProduct.detalles[0].id }
        });

        // Obtener IDs de imágenes a eliminar 
        const imagenesAEliminar = existingProduct.detalles[0].imagenes
          .filter(img => img.imagen !== null)
          .map(img => img.imagen!.id);
        
        // Eliminar las imágenes solo si hay imágenes para eliminar
        if (imagenesAEliminar.length > 0) {
          await this.prisma.imagen.deleteMany({
            where: { id: { in: imagenesAEliminar } }
          });
        }
      }

      // Crear nuevas imágenes
      const nuevasImagenes = await Promise.all(
        data.imagenesUrls.map(url => 
          this.prisma.imagen.create({
            data: { url }
          })
        )
      );

      detallesUpdate.imagenes = {
        create: nuevasImagenes.map(imagen => ({
          imagenId: imagen.id
        }))
      };
      needsDetallesUpdate = true;
    }

    // Aplicar actualizaciones de detalles si es necesario
    if (needsDetallesUpdate && existingProduct.detalles[0]) {
      updateData.detalles = {
        update: {
          where: { id: existingProduct.detalles[0].id },
          data: detallesUpdate
        }
      };
    }

    // Realizar la actualización
    return this.prisma.producto.update({
      where: { id },
      data: updateData,
      include: {
        categoria: true,
        detalles: {
          include: {
            precio: true,
            talle: true,
            imagenes: {
              include: {
                imagen: true
              }
            }
          }
        }
      }
    });
  }

  async delete(id: number): Promise<void> {
    // Eliminar en cascada las relaciones
    await this.prisma.producto.delete({
      where: { id }
    });
  }
}