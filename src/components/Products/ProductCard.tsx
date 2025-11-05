// ============================================
// PRODUCT CARD COMPONENT - Enhanced Design
// ============================================

import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { Producto, Categoria } from '../../types';

interface ProductCardProps {
  producto: Producto;
  categoria?: Categoria;
  onAgregarCarrito: (productoId: string) => void;
}

export const ProductCard = ({ producto, categoria, onAgregarCarrito }: ProductCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-500 transform hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img 
          src={producto.imagenUrl} 
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {producto.stock <= 5 && producto.stock > 0 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Solo {producto.stock} unidades
          </div>
        )}
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-white mx-auto mb-2" />
              <span className="text-white text-2xl font-bold block">AGOTADO</span>
              <span className="text-gray-300 text-sm">Sin stock disponible</span>
            </div>
          </div>
        )}
        {categoria && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
            {categoria.nombre}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {producto.descripcion}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-blue-600">
              ${producto.precio.toFixed(2)}
            </span>
            <span className={`text-xs mt-1 font-medium ${
              producto.stock > 10 ? 'text-green-600' : 
              producto.stock > 0 ? 'text-orange-600' : 
              'text-red-600'
            }`}>
              {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onAgregarCarrito(producto.idProducto)}
          disabled={producto.stock === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}</span>
        </button>
      </div>
    </div>
  );
};
