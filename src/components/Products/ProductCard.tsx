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
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#5A4633] transform hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img 
          src={producto.imagenUrl} 
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {producto.stock <= 5 && producto.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Solo {producto.stock}</span>
          </div>
        )}
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center px-2">
              <AlertCircle className="w-8 h-8 text-white mx-auto mb-1" />
              <span className="text-white text-lg font-bold block">AGOTADO</span>
            </div>
          </div>
        )}
        {categoria && (
          <div className="absolute top-2 left-2 bg-[#5A4633] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm tracking-wide">
            {categoria.nombre}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#5A4633] transition-colors">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 h-8 leading-relaxed">
          {producto.descripcion}
        </p>
        
        <div className="flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#5A4633]">
              S/ {producto.precio.toFixed(2)}
            </span>
            <span className={`text-[10px] font-medium ${
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
          className="w-full bg-[#5A4633] text-white py-2.5 px-4 rounded-lg hover:bg-[#3D2F24] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-2 transform active:scale-95 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{producto.stock === 0 ? 'Agotado' : 'Agregar'}</span>
        </button>
      </div>
    </div>
  );
};
