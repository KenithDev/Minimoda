// ============================================
// CUSTOM HOOK - Categorías
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Categoria, CategoriaFormData } from '../types';
import { categoriasApi } from '../services/firebaseApi';

export const useCategories = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriasApi.getAll();
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  const agregarCategoria = useCallback(async (categoria: CategoriaFormData) => {
    try {
      const nueva = await categoriasApi.create(categoria);
      setCategorias(prev => [...prev, nueva]);
      return nueva;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al agregar categoría');
    }
  }, []);

  const actualizarCategoria = useCallback(async (id: string, categoria: Partial<CategoriaFormData>) => {
    try {
      const actualizada = await categoriasApi.update(id, categoria);
      setCategorias(prev => prev.map(c => c.idCategoria === id ? actualizada : c));
      return actualizada;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar categoría');
    }
  }, []);

  const eliminarCategoria = useCallback(async (id: string) => {
    try {
      await categoriasApi.delete(id);
      setCategorias(prev => prev.filter(c => c.idCategoria !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar categoría');
    }
  }, []);

  const buscarCategoriaPorId = useCallback((id: string): Categoria | undefined => {
    return categorias.find(c => c.idCategoria === id);
  }, [categorias]);

  return {
    categorias,
    loading,
    error,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    buscarCategoriaPorId,
    recargar: loadCategorias
  };
};
