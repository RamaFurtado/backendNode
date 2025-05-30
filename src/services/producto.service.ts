// product.service.ts
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
                imagen: {
                  connect: { id: imagen.id }
                }
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
    
    const updateData: any = {
      nombre: data.nombre,
      sexo: data.sexo,
      tipoProducto: data.tipoProducto
    };

    // Si se proporciona categoría, buscarla/crearla
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
    // Eliminar en cascada las relaciones si es necesario
    await this.prisma.producto.delete({
      where: { id }
    });
  }
}