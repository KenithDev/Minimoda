// ============================================
// ADMIN NAVBAR - Solo para administradores
// ============================================

import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, Package, FolderOpen } from 'lucide-react';

interface AdminNavbarProps {
  activeTab?: 'productos' | 'categorias';
  onTabChange?: (tab: 'productos' | 'categorias') => void;
}

export const AdminNavbar = ({ activeTab, onTabChange }: AdminNavbarProps) => {
  const { logoutAdmin } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-[#5A4633] to-[#3D2F24] border-b-4 border-[#3D2F24] shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px]">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-22">
          {/* Logo Admin */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="bg-white rounded-full p-2 sm:p-2.5 md:p-3 shadow-lg">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#5A4633]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white drop-shadow-lg">
                PANEL ADMIN
              </span>
              <span className="hidden sm:block text-xs md:text-sm text-[#D4A574] font-semibold">
                Gestión de Minimoda
              </span>
            </div>
          </div>
          
          {/* Admin Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => onTabChange?.('productos')}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl transition-all duration-200 font-semibold flex items-center gap-1.5 sm:gap-2 border-2 hover:scale-105 active:scale-95 backdrop-blur-sm ${
                activeTab === 'productos'
                  ? 'bg-white text-[#5A4633] border-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
              }`}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm md:text-base">Productos</span>
            </button>
            
            <button
              onClick={() => onTabChange?.('categorias')}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl transition-all duration-200 font-semibold flex items-center gap-1.5 sm:gap-2 border-2 hover:scale-105 active:scale-95 backdrop-blur-sm ${
                activeTab === 'categorias'
                  ? 'bg-white text-[#5A4633] border-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
              }`}
            >
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm md:text-base">Categorías</span>
            </button>
            
            <button
              onClick={logoutAdmin}
              className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl border-2 border-red-600 hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-sm md:text-base">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
