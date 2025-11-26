// ============================================
// APP - Main Application Component
// ============================================

import { useState } from 'react';
import { Package, FolderOpen } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Router, Route } from './components/Router/Router';
import { ClientNavbar } from './components/Layout/ClientNavbar';
import { AdminNavbar } from './components/Layout/AdminNavbar';
import { ProductList } from './components/Products/ProductList';
import { Cart } from './components/Cart/Cart';
import { AdminLogin } from './components/Auth/AdminLogin';
import { AdminProducts } from './components/Admin/AdminProducts';
import { AdminCategories } from './components/Admin/AdminCategories';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {/* Rutas de Cliente */}
        <Route path="/">
          <ClientNavbar />
          <ProductList />
        </Route>
        
        <Route path="/carrito">
          <ClientNavbar />
          <Cart />
        </Route>
        
        {/* Ruta de Login Admin */}
        <Route path="/admin/login">
          <AdminLogin />
        </Route>
        
        {/* Ruta de Admin (Protegida) */}
        <Route path="/admin">
          <ProtectedAdminRoute />
        </Route>
      </Router>
    </div>
  );
}

// Componente para proteger rutas de admin
const ProtectedAdminRoute = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    // Redirigir al login si no está autenticado
    window.location.hash = '#/admin/login';
    return null;
  }
  
  return <AdminPanel />;
};

// Panel de administración con tabs
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias'>('productos');

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 max-w-[1920px]">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8 border-2 border-gray-200 overflow-hidden">
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('productos')}
                className={`flex-1 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 font-bold text-base sm:text-lg md:text-xl transition-all flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'productos'
                    ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <span className="hidden sm:inline">Productos</span>
              </button>
              <button
                onClick={() => setActiveTab('categorias')}
                className={`flex-1 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 font-bold text-base sm:text-lg md:text-xl transition-all flex items-center justify-center gap-2 sm:gap-3 ${
                  activeTab === 'categorias'
                    ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <span className="hidden sm:inline">Categorías</span>
              </button>
            </div>
          </div>

          {activeTab === 'productos' ? <AdminProducts /> : <AdminCategories />}
        </div>
      </div>
    </>
  );
};

export default App;
