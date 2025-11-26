// ============================================
// CART COMPONENT
// ============================================

import { ShoppingCart, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { useCart } from '../../hooks';

export const Cart = () => {
  const {
    items,
    loading,
    error,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    cantidadTotal
  } = useCart();

  const handleEliminar = async (itemId: string) => {
    if (confirm('¿Deseas eliminar este producto del carrito?')) {
      try {
        await eliminarDelCarrito(itemId);
      } catch (err) {
        alert('Error al eliminar producto');
      }
    }
  };

  const handleVaciar = async () => {
    if (confirm('¿Deseas vaciar todo el carrito?')) {
      try {
        await vaciarCarrito();
      } catch (err) {
        alert('Error al vaciar carrito');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando carrito...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 max-w-[1920px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 flex items-center gap-2 sm:gap-3">
          <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
          <span>Mi Carrito <span className="hidden xs:inline">({cantidadTotal()} items)</span></span>
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleVaciar}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Vaciar Carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 md:p-16 text-center border-2 border-gray-200">
          <ShoppingCart className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-gray-400 mx-auto mb-4 sm:mb-6" />
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-bold mb-3 sm:mb-4">Tu carrito está vacío</p>
          <a 
            href="#/"
            className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg text-sm sm:text-base md:text-lg"
          >
            Ir a Comprar
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <img
                  src={item.producto.imagenUrl}
                  alt={item.producto.nombre}
                  className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    {item.producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {item.producto.descripcion}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Stock disponible: {item.producto.stock}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    {item.cantidad >= item.producto.stock && (
                      <span className="text-orange-600 text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Stock máximo
                      </span>
                    )}
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 ml-auto">
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEliminar(item.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all self-start sm:self-center"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Resumen de Compra
              </h2>
              
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                  <div className="flex justify-between text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-green-600 text-white py-2.5 sm:py-3 md:py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base md:text-lg shadow-lg">
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
