// ============================================
// CUSTOM HOOKS - Business Logic Layer
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Producto, FiltrosProductos } from '../types';
import { productosApi } from '../services/firebaseApi';

export const useProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productosApi.getAll();
      setProductos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  const filtrarProductos = useCallback((filtros: FiltrosProductos): Producto[] => {
    let resultado = [...productos];

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.categoriaId) {
      resultado = resultado.filter(p => p.categoriaId === filtros.categoriaId);
    }

    return resultado;
  }, [productos]);

  const agregarProducto = useCallback(async (producto: Omit<Producto, 'idProducto'>) => {
    try {
      const nuevo = await productosApi.create(producto);
      setProductos(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al agregar producto');
    }
  }, []);

  const actualizarProducto = useCallback(async (id: string, producto: Partial<Producto>) => {
    try {
      const actualizado = await productosApi.update(id, producto);
      setProductos(prev => prev.map(p => p.idProducto === id ? actualizado : p));
      return actualizado;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar producto');
    }
  }, []);

  const eliminarProducto = useCallback(async (id: string) => {
    try {
      await productosApi.delete(id);
      setProductos(prev => prev.filter(p => p.idProducto !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  }, []);

  return {
    productos,
    loading,
    error,
    filtrarProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    recargar: loadProductos
  };
};
