// ============================================
// CUSTOM HOOK - Paginación
// ============================================

import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPorPagina?: number;
}

export const usePagination = <T,>({ items, itemsPorPagina = 12 }: UsePaginationProps<T>) => {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = useMemo(() => {
    return Math.ceil(items.length / itemsPorPagina);
  }, [items.length, itemsPorPagina]);

  const itemsPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return items.slice(inicio, fin);
  }, [items, paginaActual, itemsPorPagina]);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(prev => prev + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(prev => prev - 1);
    }
  };

  const resetPagina = () => {
    setPaginaActual(1);
  };

  return {
    paginaActual,
    totalPaginas,
    itemsPaginados,
    irAPagina,
    paginaSiguiente,
    paginaAnterior,
    resetPagina,
    tienePaginaSiguiente: paginaActual < totalPaginas,
    tienePaginaAnterior: paginaActual > 1
  };
};
