// ============================================
// NAVBAR COMPONENT - Professional Clean Design
// ============================================

import { useCart } from '../../hooks';
import { Home, ShoppingCart, Settings } from 'lucide-react';

export const Navbar = () => {
  const { cantidadTotal } = useCart();

  return (
    <nav className="bg-white border-b-4 border-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-4 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Minimoda Logo" 
                className="h-14 w-14 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                MINIMODA
              </span>
              <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Tu tienda de moda
              </span>
            </div>
          </a>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <a 
              href="#/" 
              className="px-6 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 font-semibold flex items-center gap-2.5 group border-2 border-transparent hover:border-blue-200"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Productos</span>
            </a>
            
            <a 
              href="#/carrito" 
              className="relative px-6 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 font-semibold flex items-center gap-2.5 group border-2 border-transparent hover:border-blue-200"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cantidadTotal() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-5 h-5 px-1 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white">
                    {cantidadTotal()}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Carrito</span>
            </a>
            
            <a 
              href="#/admin" 
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-bold flex items-center gap-2.5 group shadow-lg hover:shadow-xl border-2 border-blue-700"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden lg:inline">Admin</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
