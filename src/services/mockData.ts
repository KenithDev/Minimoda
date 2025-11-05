// ============================================
// MOCK DATA - Initial data for simulation
// ============================================

import type { Categoria, Producto } from '../types';

export const MOCK_CATEGORIAS: Categoria[] = [
  {
    idCategoria: 'cat0001',
    nombre: 'Camisetas',
    descripcion: 'Camisetas modernas y cómodas',
    imagenUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    idCategoria: 'cat0002',
    nombre: 'Pantalones',
    descripcion: 'Pantalones de alta calidad',
    imagenUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'
  },
  {
    idCategoria: 'cat0003',
    nombre: 'Zapatos',
    descripcion: 'Calzado elegante y deportivo',
    imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
  },
  {
    idCategoria: 'cat0004',
    nombre: 'Accesorios',
    descripcion: 'Complementa tu outfit',
    imagenUrl: 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=400'
  }
];

export const MOCK_PRODUCTOS: Producto[] = [
  {
    idProducto: 'prod0001',
    nombre: 'Camiseta Básica Blanca',
    descripcion: 'Camiseta de algodón 100%, perfecta para el día a día',
    precio: 25.99,
    stock: 50,
    imagenUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    categoriaId: 'cat0001'
  },
  {
    idProducto: 'prod0002',
    nombre: 'Camiseta Negra Premium',
    descripcion: 'Diseño moderno con corte slim fit',
    precio: 32.99,
    stock: 35,
    imagenUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    categoriaId: 'cat0001'
  },
  {
    idProducto: 'prod0003',
    nombre: 'Jeans Azul Clásico',
    descripcion: 'Pantalón denim de corte recto',
    precio: 59.99,
    stock: 25,
    imagenUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    categoriaId: 'cat0002'
  },
  {
    idProducto: 'prod0004',
    nombre: 'Pantalón Cargo Negro',
    descripcion: 'Estilo urbano con múltiples bolsillos',
    precio: 49.99,
    stock: 40,
    imagenUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    categoriaId: 'cat0002'
  },
  {
    idProducto: 'prod0005',
    nombre: 'Zapatillas Deportivas',
    descripcion: 'Cómodas y perfectas para ejercicio',
    precio: 89.99,
    stock: 20,
    imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoriaId: 'cat0003'
  },
  {
    idProducto: 'prod0006',
    nombre: 'Zapatos Formales',
    descripcion: 'Elegantes para ocasiones especiales',
    precio: 120.00,
    stock: 15,
    imagenUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400',
    categoriaId: 'cat0003'
  },
  {
    idProducto: 'prod0007',
    nombre: 'Reloj Clásico',
    descripcion: 'Reloj de pulsera con diseño atemporal',
    precio: 149.99,
    stock: 10,
    imagenUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoriaId: 'cat0004'
  },
  {
    idProducto: 'prod0008',
    nombre: 'Gorra Deportiva',
    descripcion: 'Protección solar con estilo',
    precio: 22.99,
    stock: 60,
    imagenUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    categoriaId: 'cat0004'
  }
];
