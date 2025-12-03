import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import type { Toast } from '../../context/ToastContext';
import { useToastContext } from '../../context/ToastContext';

interface ToastItemProps {
  toast: Toast;
  isConfirm?: boolean;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, isConfirm = false }) => {
  const { removeToast } = useToastContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    // Estilos especiales para toasts de confirmación (más grandes y cuadrados)
    if (isConfirm) {
      const baseStyles = 'pointer-events-auto relative flex flex-col items-center gap-4 w-[400px] sm:w-[450px] md:w-[500px] p-6 sm:p-8 rounded-2xl shadow-2xl border-2 transition-all duration-300 ease-out';
      
      const animations = isExiting 
        ? 'opacity-0 scale-95' 
        : isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95';

      return `${baseStyles} ${animations} bg-white border-[#5A4633]`;
    }

    // Estilos normales para otros toasts
    const baseStyles = 'pointer-events-auto relative flex items-start gap-3 min-w-[320px] max-w-[420px] p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ease-out';
    
    const animations = isExiting 
      ? 'opacity-0 translate-x-full scale-95' 
      : isVisible 
        ? 'opacity-100 translate-x-0 scale-100' 
        : 'opacity-0 translate-x-full scale-95';

    switch (toast.type) {
      case 'success':
        return `${baseStyles} ${animations} bg-emerald-500 border-emerald-600`;
      case 'error':
        return `${baseStyles} ${animations} bg-red-500 border-red-600`;
      case 'warning':
        return `${baseStyles} ${animations} bg-amber-500 border-amber-600`;
      case 'info':
        return `${baseStyles} ${animations} bg-blue-500 border-blue-600`;
      case 'confirm':
        return `${baseStyles} ${animations} bg-orange-500 border-orange-600`;
      default:
        return `${baseStyles} ${animations} bg-gray-500 border-gray-600`;
    }
  };

  const getIcon = () => {
    const iconClass = isConfirm ? 'w-12 h-12 flex-shrink-0 text-[#5A4633]' : 'w-6 h-6 flex-shrink-0 text-white';
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className={iconClass} />;
      case 'error':
        return <XCircle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      case 'confirm':
        return <AlertCircle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-700';
      case 'error':
        return 'bg-red-700';
      case 'warning':
        return 'bg-amber-700';
      case 'info':
        return 'bg-blue-700';
      case 'confirm':
        return 'bg-orange-700';
      default:
        return 'bg-gray-700';
    }
  };

  const getButtonStyles = (variant?: 'primary' | 'secondary' | 'danger') => {
    const baseStyles = isConfirm 
      ? 'px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95 min-w-[140px]'
      : 'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95';
    
    // Estilos especiales para botones en toast de confirmación
    if (isConfirm) {
      switch (variant) {
        case 'danger':
          return `${baseStyles} bg-[#5A4633] text-white hover:bg-[#3D2F24]`;
        case 'secondary':
          return `${baseStyles} bg-gray-200 text-gray-700 hover:bg-gray-300`;
        case 'primary':
        default:
          return `${baseStyles} bg-[#5A4633] text-white hover:bg-[#3D2F24]`;
      }
    }
    
    // Estilos para toasts regulares
    switch (variant) {
      case 'danger':
        return `${baseStyles} bg-white text-red-600 hover:bg-red-50`;
      case 'secondary':
        return `${baseStyles} bg-white/20 text-white hover:bg-white/30`;
      case 'primary':
      default:
        return `${baseStyles} bg-white text-gray-800 hover:bg-gray-100`;
    }
  };

  // Layout especial para toasts de confirmación
  if (isConfirm) {
    return (
      <div className={getToastStyles()}>
        {/* Icon - centrado y más grande */}
        <div className="mb-2">{getIcon()}</div>

        {/* Message - centrado */}
        <p className="text-[#5A4633] text-lg sm:text-xl font-bold text-center mb-6">
          {toast.message}
        </p>

        {/* Action buttons - centrados y más grandes */}
        {toast.actions && toast.actions.length > 0 && (
          <div className="flex gap-4 w-full justify-center">
            {toast.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={getButtonStyles(action.variant)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <style>{`
          @keyframes progress {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    );
  }

  // Layout normal para otros toasts
  return (
    <div className={getToastStyles()}>
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && !toast.actions && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} animate-progress`}
            style={{
              animation: `progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Icon */}
      <div className="mt-0.5">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 pr-2">
        <p className="text-white text-sm font-medium leading-relaxed mb-3">
          {toast.message}
        </p>

        {/* Action buttons */}
        {toast.actions && toast.actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {toast.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={getButtonStyles(action.variant)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close button - solo si no tiene acciones */}
      {!toast.actions && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/20 rounded-lg p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastItem;
