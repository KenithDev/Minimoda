// ============================================
// MOCK API - Simulates backend with localStorage
// ============================================

import type { 
  Categoria, 
  Producto, 
  CarritoItem, 
  ProductoFormData, 
  CategoriaFormData 
} from '../types';
import { MOCK_CATEGORIAS, MOCK_PRODUCTOS } from './mockData';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTOS: 'minimoda_productos',
  CATEGORIAS: 'minimoda_categorias',
  CARRITO: 'minimoda_carrito'
};

// Simular delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// INICIALIZACIÓN
// ============================================

const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIAS)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(MOCK_CATEGORIAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTOS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(MOCK_PRODUCTOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CARRITO)) {
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify([]));
  }
};

// ============================================
// CATEGORÍAS API
// ============================================

export const categoriasApi = {
  async getAll(): Promise<Categoria[]> {
    await delay();
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
    return data ? JSON.parse(data) : [];
  },

  async create(categoria: CategoriaFormData): Promise<Categoria> {
    await delay();
    const categorias = await this.getAll();
    const nuevaCategoria: Categoria = {
      ...categoria,
      idCategoria: `cat${Date.now()}`
    };
    categorias.push(nuevaCategoria);
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
    return nuevaCategoria;
  },

  async update(id: string, categoria: Partial<CategoriaFormData>): Promise<Categoria> {
    await delay();
    const categorias = await this.getAll();
    const index = categorias.findIndex(c => c.idCategoria === id);
    if (index === -1) throw new Error('Categoría no encontrada');
    
    categorias[index] = { ...categorias[index], ...categoria };
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
    return categorias[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const categorias = await this.getAll();
    const filtradas = categorias.filter(c => c.idCategoria !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(filtradas));
  }
};

// ============================================
// PRODUCTOS API
// ============================================

export const productosApi = {
  async getAll(): Promise<Producto[]> {
    await delay();
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTOS);
    return data ? JSON.parse(data) : [];
  },

  async getById(id: string): Promise<Producto | null> {
    await delay();
    const productos = await this.getAll();
    return productos.find(p => p.idProducto === id) || null;
  },

  async getByCategoria(categoriaId: string): Promise<Producto[]> {
    await delay();
    const productos = await this.getAll();
    return productos.filter(p => p.categoriaId === categoriaId);
  },

  async create(producto: ProductoFormData): Promise<Producto> {
    await delay();
    const productos = await this.getAll();
    const nuevoProducto: Producto = {
      ...producto,
      idProducto: `prod${Date.now()}`
    };
    productos.push(nuevoProducto);
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
    return nuevoProducto;
  },

  async update(id: string, producto: Partial<ProductoFormData>): Promise<Producto> {
    await delay();
    const productos = await this.getAll();
    const index = productos.findIndex(p => p.idProducto === id);
    if (index === -1) throw new Error('Producto no encontrado');
    
    productos[index] = { ...productos[index], ...producto };
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
    return productos[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const productos = await this.getAll();
    const filtrados = productos.filter(p => p.idProducto !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(filtrados));
  },

  async updateStock(id: string, cantidad: number): Promise<void> {
    await delay();
    const productos = await this.getAll();
    const index = productos.findIndex(p => p.idProducto === id);
    if (index === -1) throw new Error('Producto no encontrado');
    
    productos[index].stock += cantidad;
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos));
  }
};

// ============================================
// CARRITO API
// ============================================

export const carritoApi = {
  async getAll(userId: string): Promise<CarritoItem[]> {
    await delay(300);
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEYS.CARRITO);
    const carrito: CarritoItem[] = data ? JSON.parse(data) : [];
    return carrito.filter(item => item.userId === userId);
  },

  async add(userId: string, productoId: string, cantidad: number = 1): Promise<CarritoItem> {
    await delay(300);
    const carrito = await this.getAllItems();
    const existingIndex = carrito.findIndex(
      item => item.userId === userId && item.productoId === productoId
    );

    if (existingIndex !== -1) {
      carrito[existingIndex].cantidad += cantidad;
    } else {
      const nuevoItem: CarritoItem = {
        id: `cart${Date.now()}`,
        userId,
        productoId,
        cantidad
      };
      carrito.push(nuevoItem);
    }

    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
    return carrito.find(item => item.userId === userId && item.productoId === productoId)!;
  },

  async updateCantidad(id: string, cantidad: number): Promise<void> {
    await delay(300);
    const carrito = await this.getAllItems();
    const index = carrito.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item no encontrado');
    
    carrito[index].cantidad = cantidad;
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    const carrito = await this.getAllItems();
    const filtrado = carrito.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(filtrado));
  },

  async clear(userId: string): Promise<void> {
    await delay(300);
    const carrito = await this.getAllItems();
    const filtrado = carrito.filter(item => item.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(filtrado));
  },

  // Helper privado
  async getAllItems(): Promise<CarritoItem[]> {
    const data = localStorage.getItem(STORAGE_KEYS.CARRITO);
    return data ? JSON.parse(data) : [];
  }
};
