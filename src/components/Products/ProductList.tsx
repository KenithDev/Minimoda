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
      <div className="container mx-auto px-4 py-8">
        {/* Header con imagen de categoría */}
        <div className="mb-8 relative">
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 ">
            <img 
              src={categoriaSeleccionada?.imagenUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'}
              alt={categoriaSeleccionada?.nombre || 'Todas las categorías'}
              className="w-full h-full object-cover "
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-blue-900 bg-opacity-80">
              <h1 className="text-4xl font-black mb-2">
                {categoriaSeleccionada?.nombre || 'Todos los Productos'}
              </h1>
              <p className="text-lg">
                {categoriaSeleccionada?.descripcion || 'Descubre nuestra colección completa'}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Search className="w-5 h-5 text-blue-600" />
                Buscar productos
              </label>
              <input
                type="text"
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                placeholder="Buscar por nombre o descripción..."
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Filter className="w-5 h-5 text-blue-600" />
                Filtrar por categoría
              </label>
              <select
                value={filtros.categoriaId}
                onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-base"
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
          
          <div className="mt-6 flex items-center justify-between">
            <div className="bg-blue-50 border-2 border-blue-200 px-6 py-3 rounded-lg">
              <span className="text-sm text-blue-800 font-bold flex items-center gap-2">
                <Package className="w-4 h-4" />
                {productosFiltrados.length} productos encontrados
              </span>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border-2 border-gray-200">
            <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <p className="text-2xl text-gray-800 font-bold mb-2">No se encontraron productos</p>
            <p className="text-gray-500">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={paginaAnterior}
                  disabled={paginaActual === 1}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-bold text-gray-700 transition-all"
                >
                  ← Anterior
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                    <button
                      key={pagina}
                      onClick={() => irAPagina(pagina)}
                      className={`px-4 py-2.5 rounded-lg font-bold transition-all border-2 ${
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
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-bold text-gray-700 transition-all"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
