// ============================================
// CUSTOM HOOK - Carrito de Compras
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { CarritoItemWithProduct } from '../types';
import { carritoApi, productosApi } from '../services/firebaseApi';

const USER_ID = 'usuarioDemo'; // Usuario demo para simulación

export const useCart = () => {
  const [items, setItems] = useState<CarritoItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCarrito = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const carritoItems = await carritoApi.getAll(USER_ID);
      
      // Cargar información completa de productos
      const itemsConProducto: CarritoItemWithProduct[] = [];
      for (const item of carritoItems) {
        const producto = await productosApi.getById(item.productoId);
        if (producto) {
          itemsConProducto.push({ ...item, producto });
        }
      }
      
      setItems(itemsConProducto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar carrito');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCarrito();
  }, [loadCarrito]);

  const agregarAlCarrito = useCallback(async (productoId: string, cantidad: number = 1) => {
    try {
      await carritoApi.add(USER_ID, productoId, cantidad);
      await loadCarrito();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al agregar al carrito');
    }
  }, [loadCarrito]);

  const actualizarCantidad = useCallback(async (itemId: string, cantidad: number) => {
    try {
      if (cantidad <= 0) {
        await eliminarDelCarrito(itemId);
        return;
      }
      await carritoApi.updateCantidad(itemId, cantidad);
      await loadCarrito();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar cantidad');
    }
  }, [loadCarrito]);

  const eliminarDelCarrito = useCallback(async (itemId: string) => {
    try {
      await carritoApi.remove(itemId);
      await loadCarrito();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar del carrito');
    }
  }, [loadCarrito]);

  const vaciarCarrito = useCallback(async () => {
    try {
      await carritoApi.clear(USER_ID);
      setItems([]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al vaciar carrito');
    }
  }, []);

  const calcularTotal = useCallback((): number => {
    return items.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  }, [items]);

  const cantidadTotal = useCallback((): number => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  }, [items]);

  return {
    items,
    loading,
    error,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularTotal,
    cantidadTotal,
    recargar: loadCarrito
  };
};
