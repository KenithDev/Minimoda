// ============================================
// CART COMPONENT
// ============================================

import { ShoppingCart, Trash2, Plus, Minus, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks';
import { useToast } from '../../hooks/useToast';

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
  const toast = useToast();

  const handleEliminar = async (itemId: string) => {
    toast.confirm(
      '¿Deseas eliminar este producto del carrito?',
      async () => {
        try {
          await eliminarDelCarrito(itemId);
          toast.success('Producto eliminado del carrito');
        } catch (err) {
          toast.error('Error al eliminar el producto. Por favor intenta nuevamente.');
        }
      }
    );
  };

  const handleVaciar = async () => {
    toast.confirm(
      '¿Deseas vaciar todo el carrito?',
      async () => {
        try {
          await vaciarCarrito();
          toast.success('Carrito vaciado exitosamente');
        } catch (err) {
          toast.error('Error al vaciar el carrito. Por favor intenta nuevamente.');
        }
      }
    );
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#5A4633] flex items-center gap-2 sm:gap-3">
          <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#5A4633]" />
          <span>Mi Carrito <span className="hidden xs:inline">({cantidadTotal()} items)</span></span>
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleVaciar}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-white text-red-600 border-2 border-red-100 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base group"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            Vaciar Carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="relative mb-8 group">
            {/* Círculos decorativos de fondo */}
            <div className="absolute inset-0 bg-[#D4A574]/20 rounded-full blur-2xl transform scale-150 group-hover:scale-175 transition-transform duration-700"></div>
            <div className="relative bg-gradient-to-br from-white to-[#F5EFE7] p-8 rounded-full shadow-xl border-4 border-white ring-1 ring-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500">
              <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-[#5A4633]" strokeWidth={1.5} />
            </div>
            {/* Elemento flotante decorativo */}
            <div className="absolute -top-2 -right-2 bg-[#5A4633] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white transform rotate-12 group-hover:rotate-0 transition-all duration-300">
              0
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#5A4633] mb-4 tracking-tight">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 text-lg sm:text-xl max-w-md mb-10 leading-relaxed font-medium">
            ¡Parece que aún no has añadido nada! Explora nuestra colección y encuentra tu estilo ideal.
          </p>
          
          <a 
            href="#/"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#5A4633] text-white font-bold text-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:bg-[#3D2F24] hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Empezar a Comprar
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
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
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#5A4633]">
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
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F5EFE7] text-[#5A4633] rounded-lg hover:bg-[#D4A574] hover:text-white transition-all flex items-center justify-center font-bold"
                      >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5A4633] text-white rounded-lg hover:bg-[#3D2F24] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#5A4633] ml-auto">
                      S/ {(item.producto.precio * item.cantidad).toFixed(2)}
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#5A4633] mb-3 sm:mb-4 border-b-2 border-[#D4A574] pb-2">
                Resumen de Compra
              </h2>
              
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>S/ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                  <div className="flex justify-between text-lg sm:text-xl md:text-2xl font-bold text-[#5A4633]">
                    <span>Total:</span>
                    <span>S/ {calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <a 
                href="#/checkout"
                className="block w-full text-center bg-[#5A4633] text-white py-2.5 sm:py-3 md:py-4 rounded-lg hover:bg-[#3D2F24] transition-all font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Proceder al Pago
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
