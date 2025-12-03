// ============================================
// APP - Main Application Component
// ============================================

import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from './components/Toast';
import { Router, Route } from './components/Router/Router';
import { ClientNavbar } from './components/Layout/ClientNavbar';
import { AdminNavbar } from './components/Layout/AdminNavbar';
import { WhatsAppButton } from './components/Layout/WhatsAppButton';
import { ProductList } from './components/Products/ProductList';
import { Cart } from './components/Cart/Cart';
import { Checkout } from './components/Checkout/Checkout';
import { AdminLogin } from './components/Auth/AdminLogin';
import { AdminProducts } from './components/Admin/AdminProducts';
import { AdminCategories } from './components/Admin/AdminCategories';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
          <ToastContainer />
        </ToastProvider>
      </CartProvider>
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
          <WhatsAppButton />
        </Route>
        
        <Route path="/carrito">
          <ClientNavbar />
          <Cart />
          <WhatsAppButton />
        </Route>

        <Route path="/checkout">
          <ClientNavbar />
          <Checkout />
          <WhatsAppButton />
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
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 max-w-[1920px]">
          {activeTab === 'productos' ? <AdminProducts /> : <AdminCategories />}
        </div>
      </div>
    </>
  );
};

export default App;
