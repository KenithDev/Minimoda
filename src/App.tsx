// ============================================
// APP - Main Application Component
// ============================================

import { useState } from 'react';
import { Package, FolderOpen } from 'lucide-react';
import { Router, Route } from './components/Router/Router';
import { Navbar } from './components/Layout/Navbar';
import { ProductList } from './components/Products/ProductList';
import { Cart } from './components/Cart/Cart';
import { AdminProducts } from './components/Admin/AdminProducts';
import { AdminCategories } from './components/Admin/AdminCategories';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <Router>
        <Route path="/">
          <ProductList />
        </Route>
        
        <Route path="/carrito">
          <Cart />
        </Route>
        
        <Route path="/admin">
          <AdminPanel />
        </Route>
      </Router>
    </div>
  );
}

// Panel de administración con tabs
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias'>('productos');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg mb-8 border-2 border-gray-200 overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex-1 px-6 py-5 font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                activeTab === 'productos'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="w-6 h-6" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`flex-1 px-6 py-5 font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                activeTab === 'categorias'
                  ? 'bg-blue-600 text-white border-b-4 border-blue-800'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FolderOpen className="w-6 h-6" />
              Categorías
            </button>
          </div>
        </div>

        {activeTab === 'productos' ? <AdminProducts /> : <AdminCategories />}
      </div>
    </div>
  );
};

export default App;
