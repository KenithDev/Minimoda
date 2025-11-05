// ============================================
// DOMAIN TYPES - Minimoda E-commerce
// ============================================

export interface Categoria {
  idCategoria: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
}

export interface Producto {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId: string;
}

export interface CarritoItem {
  id: string;
  userId: string;
  productoId: string;
  cantidad: number;
}

export interface CarritoItemWithProduct extends CarritoItem {
  producto: Producto;
}

export interface FiltrosProductos {
  categoriaId?: string;
  busqueda?: string;
}

export interface PaginacionParams {
  pagina: number;
  productosPorPagina: number;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId: string;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
}
