// ============================================
// CLIENT NAVBAR - Solo para clientes
// ============================================

import { useState } from 'react';
import { useCart } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { ClientAuthModal } from '../Auth/ClientAuthModal';
import { Home, ShoppingCart, User, LogOut } from 'lucide-react';

export const ClientNavbar = () => {
  const { cantidadTotal } = useCart();
  const { clientUser, logoutClient } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b-4 border-[#5A4633] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px]">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24">
            {/* Logo */}
            <a href="#/" className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="Minimoda Logo" 
                  className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-18 xl:w-18 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-gray-900 group-hover:text-[#5A4633] transition-colors">
                  MINIMODA
                </span>
                <span className="hidden sm:block text-xs md:text-sm lg:text-base font-semibold text-gray-500 tracking-wide uppercase">
                  Tu tienda de moda
                </span>
              </div>
            </a>
            
            {/* Navigation Links - Solo Cliente */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
              <a 
                href="#/" 
                className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 rounded-lg hover:bg-[#F5EFE7] text-gray-700 hover:text-[#5A4633] transition-all duration-200 font-semibold flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 group border-2 border-transparent hover:border-[#D4A574]"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-sm md:text-base lg:text-lg xl:text-xl">Productos</span>
              </a>
              
              <a 
                href="#/carrito" 
                className="relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 rounded-lg hover:bg-[#F5EFE7] text-gray-700 hover:text-[#5A4633] transition-all duration-200 font-semibold flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 group border-2 border-transparent hover:border-[#D4A574]"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                  {cantidadTotal() > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 lg:-top-2.5 lg:-right-2.5 bg-red-500 text-white rounded-full min-w-4 h-4 sm:min-w-5 sm:h-5 lg:min-w-6 lg:h-6 px-0.5 sm:px-1 lg:px-1.5 flex items-center justify-center text-[10px] sm:text-xs lg:text-sm font-bold shadow-lg ring-1 sm:ring-2 ring-white">
                      {cantidadTotal()}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-sm md:text-base lg:text-lg xl:text-xl">Carrito</span>
              </a>

              {/* Botón de Usuario */}
              <button
                onClick={() => clientUser ? logoutClient() : setIsAuthModalOpen(true)}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 rounded-lg transition-all duration-200 font-semibold flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 group border-2 ${
                  clientUser 
                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200' 
                    : 'bg-[#5A4633] text-white border-[#5A4633] hover:bg-[#3D2F24] hover:border-[#3D2F24] shadow-md hover:shadow-lg'
                }`}
              >
                {clientUser ? (
                  <>
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    <span className="hidden md:inline text-sm md:text-base lg:text-lg xl:text-xl">Salir</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    <span className="hidden md:inline text-sm md:text-base lg:text-lg xl:text-xl">Ingresar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ClientAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {}} 
      />
    </>
  );
};
