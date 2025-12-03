import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClientAuthModal = ({ isOpen, onClose, onSuccess }: ClientAuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginClient, registerClient } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    city: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (loginClient(formData.email, formData.password)) {
        onSuccess();
        onClose();
      } else {
        setError('Credenciales inválidas');
      }
    } else {
      if (registerClient(formData)) {
        onSuccess();
        onClose();
      } else {
        setError('El email ya está registrado');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Header */}
        <div className="bg-[#5A4633] p-8 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-1">
              {isLogin ? 'Bienvenido de nuevo' : 'Únete a Minimoda'}
            </h2>
            <p className="text-orange-100 text-sm font-medium">
              {isLogin ? 'Ingresa a tu cuenta para continuar' : 'Crea una cuenta y disfruta de beneficios exclusivos'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            className={`flex-1 py-5 font-bold text-lg transition-all relative ${
              isLogin 
                ? 'text-[#5A4633] bg-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Ingresar
            {isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5A4633] rounded-t-full mx-12"></div>}
          </button>
          <button
            className={`flex-1 py-5 font-bold text-lg transition-all relative ${
              !isLogin 
                ? 'text-[#5A4633] bg-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
            {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5A4633] rounded-t-full mx-12"></div>}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              required
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de Envío</label>
                <input
                  type="text"
                  placeholder="Av. Principal 123, Dpto 401"
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Lima"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="999 999 999"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl text-sm font-medium flex items-center gap-3 animate-in shake">
              <span className="text-2xl">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#5A4633] text-white py-5 rounded-xl font-black text-lg hover:bg-[#3D2F24] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-98 mt-4"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear mi Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};
