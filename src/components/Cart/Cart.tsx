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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-10 h-10 text-blue-600" />
          Mi Carrito ({cantidadTotal()} items)
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleVaciar}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Vaciar Carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center border-2 border-gray-200">
          <ShoppingCart className="w-32 h-32 text-gray-400 mx-auto mb-6" />
          <p className="text-2xl text-gray-800 font-bold mb-4">Tu carrito está vacío</p>
          <a 
            href="#/"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg"
          >
            Ir a Comprar
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 flex gap-4"
              >
                <img
                  src={item.producto.imagenUrl}
                  alt={item.producto.nombre}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.producto.descripcion}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Stock disponible: {item.producto.stock}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                        className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {item.cantidad >= item.producto.stock && (
                      <span className="text-orange-600 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Stock máximo
                      </span>
                    )}
                    <span className="text-xl font-bold text-blue-600 ml-auto">
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEliminar(item.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Resumen de Compra
              </h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span>${calcularTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
