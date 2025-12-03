import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const ToastDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const demos = [
    {
      label: '✅ Éxito',
      action: () => toast.success('¡Operación completada exitosamente!'),
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      label: '❌ Error',
      action: () => toast.error('Ocurrió un error al procesar la solicitud'),
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      label: '⚠️ Advertencia',
      action: () => toast.warning('Por favor revisa la información ingresada'),
      color: 'bg-amber-500 hover:bg-amber-600',
    },
    {
      label: 'ℹ️ Información',
      action: () => toast.info('Tienes 3 nuevas notificaciones'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[9998] bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-purple-500/50"
        aria-label="Toast Demo"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
      </button>

      {/* Demo panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[9998] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-purple-200 p-6 min-w-[280px] animate-slideUp">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Demo de Toasts
          </h3>
          <div className="flex flex-col gap-3">
            {demos.map((demo, index) => (
              <button
                key={index}
                onClick={() => {
                  demo.action();
                }}
                className={`${demo.color} text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg`}
              >
                {demo.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Haz clic para probar las notificaciones
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ToastDemo;
