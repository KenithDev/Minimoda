// ============================================
// ADMIN LOGIN COMPONENT
// ============================================

import { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(password);
    if (!success) {
      setError('Contraseña incorrecta');
      setPassword('');
    } else {
      window.location.hash = '#/admin';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4 shadow-xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 text-lg">
            Ingresa tu contraseña para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <Lock className="w-5 h-5 text-blue-600" />
                Contraseña de Administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-xl transform active:scale-95 text-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <a
              href="#/"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              ← Volver a la tienda
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 bg-white rounded-lg px-4 py-3 border border-gray-200">
            💡 <strong>Contraseña demo:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};
