// ============================================
// PRODUCT LIST COMPONENT
// ============================================

import { useState, useEffect } from 'react';
import { Search, Filter, Package, AlertTriangle } from 'lucide-react';
import { useProducts, useCategories, useCart, usePagination } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import { ProductCard } from './ProductCard';
import type { FiltrosProductos } from '../../types';

export const ProductList = () => {
  const { loading, error, filtrarProductos } = useProducts();
  const { categorias } = useCategories();
  const { agregarAlCarrito } = useCart();
  const toast = useToast();
  
  const [filtros, setFiltros] = useState<FiltrosProductos>({
    busqueda: '',
    categoriaId: ''
  });

  const productosFiltrados = filtrarProductos(filtros);
  
  const {
    itemsPaginados,
    paginaActual,
    totalPaginas,
    irAPagina,
    paginaSiguiente,
    paginaAnterior,
    resetPagina
  } = usePagination({ items: productosFiltrados, itemsPorPagina: 12 });

  useEffect(() => {
    resetPagina();
  }, [filtros, resetPagina]);

  const handleAgregarCarrito = async (productoId: string) => {
    try {
      await agregarAlCarrito(productoId);
      const producto = productosFiltrados.find(p => p.idProducto === productoId);
      toast.success(`${producto?.nombre || 'Producto'} agregado al carrito exitosamente`);
    } catch (err) {
      toast.error('Error al agregar el producto al carrito. Por favor intenta nuevamente.');
    }
  };

  const categoriaSeleccionada = categorias.find(c => c.idCategoria === filtros.categoriaId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#F5EFE7] to-white">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border-2 border-[#D4A574]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5A4633] mx-auto mb-6"></div>
          <div className="text-xl text-[#5A4633] font-bold">Cargando productos...</div>
          <div className="text-sm text-gray-500 mt-2">Por favor espera un momento</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-xl p-10 max-w-md border-2 border-red-200">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <div className="text-xl text-red-600 font-bold text-center mb-2">Error al cargar</div>
          <div className="text-gray-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE7] to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 max-w-[1920px]">
        {/* Hero Section Mejorado */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 relative -mx-3 sm:-mx-4 md:px-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16">
          <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-112 overflow-hidden shadow-2xl rounded-3xl">
            <img 
              src={categoriaSeleccionada?.imagenUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80'}
              alt={categoriaSeleccionada?.nombre || 'Todas las categorías'}
              className="w-full h-full object-cover"
            />
            {/* Overlay con gradiente marrón */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#5A4633]/90 via-[#5A4633]/50 to-transparent"></div>
            
            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A574] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B6F47] rounded-full blur-3xl"></div>
            </div>
            
            {/* Contenido del Hero */}
            <div className="absolute bottom-0 left-0 right-0 py-6 px-6 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-12 lg:px-16 xl:py-16 xl:px-20 2xl:py-20 2xl:px-24 text-white">
              <div className="max-w-4xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 leading-tight drop-shadow-lg">
                  {categoriaSeleccionada?.nombre || 'Todos los Productos'}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl drop-shadow-md">
                  {categoriaSeleccionada?.descripcion || 'Descubre nuestra colección completa de moda y estilo'}
                </p>
                
                {/* Badge decorativo */}
                <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">{productosFiltrados.length} productos disponibles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div>
              <label className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#5A4633]" />
                Buscar productos
              </label>
              <input
                type="text"
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A4633] focus:border-[#5A4633] transition-all text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#5A4633]" />
                Filtrar por categoría
              </label>
              <select
                value={filtros.categoriaId}
                onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A4633] focus:border-[#5A4633] transition-all bg-white text-sm sm:text-base"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 flex items-center justify-between">
            <div className="bg-[#F5EFE7] border border-[#D4A574] px-4 py-2 rounded-lg">
              <span className="text-sm sm:text-base text-[#5A4633] font-bold flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{productosFiltrados.length} productos encontrados</span>
              </span>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
            <Search className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-gray-400 mx-auto mb-5 sm:mb-6 md:mb-8" />
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 font-bold mb-3 sm:mb-4">No se encontraron productos</p>
            <p className="text-base sm:text-lg md:text-xl text-gray-500">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 mb-8 sm:mb-10 md:mb-12">
              {itemsPaginados.map(producto => (
                <ProductCard
                  key={producto.idProducto}
                  producto={producto}
                  categoria={categorias.find(c => c.idCategoria === producto.categoriaId)}
                  onAgregarCarrito={handleAgregarCarrito}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8 px-4">
                <button
                  onClick={paginaAnterior}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#5A4633] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-gray-700 transition-all text-sm"
                >
                  <span className="hidden sm:inline">← Anterior</span>
                  <span className="sm:hidden">←</span>
                </button>
                
                <div className="flex gap-1 sm:gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                    <button
                      key={pagina}
                      onClick={() => irAPagina(pagina)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-bold transition-all border text-sm ${
                        pagina === paginaActual
                          ? 'bg-[#5A4633] text-white border-[#5A4633] shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#5A4633]'
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#5A4633] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-gray-700 transition-all text-sm"
                >
                  <span className="hidden sm:inline">Siguiente →</span>
                  <span className="sm:hidden">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
