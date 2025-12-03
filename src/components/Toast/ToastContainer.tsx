import React from 'react';
import { useToastContext } from '../../context/ToastContext';
import ToastItem from './ToastItem.tsx';

const ToastContainer: React.FC = () => {
  const { toasts } = useToastContext();

  // Separar toasts de confirmación de los demás
  const confirmToasts = toasts.filter(toast => toast.type === 'confirm');
  const regularToasts = toasts.filter(toast => toast.type !== 'confirm');

  return (
    <>
      {/* Toasts regulares - esquina superior derecha */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {regularToasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>

      {/* Toasts de confirmación - centrados */}
      {confirmToasts.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="flex flex-col gap-3">
            {confirmToasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} isConfirm={true} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ToastContainer;
