// ============================================
// ADMIN LOGIN COMPONENT
// ============================================

import { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ArrowLeft, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = loginAdmin(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
      setPassword('');
    } else {
      window.location.hash = '#/admin';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Logo y Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#5A4633] rounded-full mb-8 shadow-lg">
            <ShieldCheck className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Panel de Administración
          </h2>
          <p className="text-base text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Campo de Email */}
            <div>
              <label 
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
              >
                <Mail className="w-4 h-4 text-[#5A4633]" />
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@minimoda.com"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4633] focus:border-[#5A4633] transition-all text-base placeholder:text-gray-400"
                required
                autoFocus
              />
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label 
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
              >
                <Lock className="w-4 h-4 text-[#5A4633]" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  className="w-full pl-4 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4633] focus:border-[#5A4633] transition-all text-base placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">{error}</p>
                  <p className="text-xs text-red-700 mt-1">Verifica tu correo y contraseña</p>
                </div>
              </div>
            )}

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              className="w-full bg-[#5A4633] text-white py-4 rounded-xl hover:bg-[#3D2F24] transition-colors font-semibold shadow-sm hover:shadow-md text-base"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Divisor */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href="#/"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a la tienda
            </a>
          </div>
        </div>

        {/* Info Demo */}
        <div className="bg-[#F5EFE7] border border-[#D4A574] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <div className="w-12 h-12 bg-[#E8DCC4] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#5A4633]" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-base font-semibold text-[#3D2F24]">
                Credenciales Demo
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                  <span className="text-gray-600">Usuario:</span>
                  <code className="font-mono font-bold text-[#5A4633]">admin@minimoda.com</code>
                </div>
                <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                  <span className="text-gray-600">Password:</span>
                  <code className="font-mono font-bold text-[#5A4633]">admin123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
