// ============================================
// PRODUCT LIST COMPONENT
// ============================================

import { useState, useEffect } from 'react';
import { Search, Filter, Package, AlertTriangle } from 'lucide-react';
import { useProducts, useCategories, useCart, usePagination } from '../../hooks';
import { ProductCard } from './ProductCard';
import type { FiltrosProductos } from '../../types';

export const ProductList = () => {
  const { loading, error, filtrarProductos } = useProducts();
  const { categorias } = useCategories();
  const { agregarAlCarrito } = useCart();
  
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
      alert('Producto agregado al carrito');
    } catch (err) {
      alert('Error al agregar producto al carrito');
    }
  };

  const categoriaSeleccionada = categorias.find(c => c.idCategoria === filtros.categoriaId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-12 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700 font-bold">Cargando productos...</div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 max-w-[1920px]">
        {/* Header con imagen de categoría */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 relative -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12 2xl:-mx-16">
          <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 2xl:h-112 overflow-hidden shadow-2xl">
            <img 
              src={categoriaSeleccionada?.imagenUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80'}
              alt={categoriaSeleccionada?.nombre || 'Todas las categorías'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 py-6 px-6 sm:py-8 sm:px-8 md:py-10 md:px-12 lg:py-12 lg:px-16 xl:py-16 xl:px-20 2xl:py-20 2xl:px-24 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-2 sm:mb-3 md:mb-4 leading-tight">
                {categoriaSeleccionada?.nombre || 'Todos los Productos'}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 max-w-3xl">
                {categoriaSeleccionada?.descripcion || 'Descubre nuestra colección completa'}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-7 md:p-9 lg:p-10 xl:p-12 mb-8 sm:mb-10 md:mb-12 border-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div>
              <label className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                Buscar productos
              </label>
              <input
                type="text"
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-4 py-3.5 sm:px-5 sm:py-4 md:px-6 md:py-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base md:text-lg"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base md:text-lg font-bold text-gray-700 mb-3 sm:mb-4">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                Filtrar por categoría
              </label>
              <select
                value={filtros.categoriaId}
                onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                className="w-full px-4 py-3.5 sm:px-5 sm:py-4 md:px-6 md:py-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm sm:text-base md:text-lg"
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
            <div className="bg-blue-50 border-2 border-blue-200 px-5 py-3 sm:px-6 sm:py-3.5 md:px-7 md:py-4 rounded-xl">
              <span className="text-sm sm:text-base md:text-lg text-blue-800 font-bold flex items-center gap-2 sm:gap-2.5">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
              <div className="flex justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 px-6 sm:px-8 md:px-10 lg:px-12">
                <button
                  onClick={paginaAnterior}
                  disabled={paginaActual === 1}
                  className="px-5 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-4.5 lg:px-8 lg:py-5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-bold text-gray-700 transition-all text-sm sm:text-base md:text-lg"
                >
                  <span className="hidden sm:inline">← Anterior</span>
                  <span className="sm:hidden">←</span>
                </button>
                
                <div className="flex gap-2 sm:gap-3">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                    <button
                      key={pagina}
                      onClick={() => irAPagina(pagina)}
                      className={`px-5 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-4.5 lg:px-8 lg:py-5 rounded-xl font-bold transition-all border-2 text-sm sm:text-base md:text-lg ${
                        pagina === paginaActual
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-500 shadow-md'
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={paginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className="px-5 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-4.5 lg:px-8 lg:py-5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-bold text-gray-700 transition-all text-sm sm:text-base md:text-lg"
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
