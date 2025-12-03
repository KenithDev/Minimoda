import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  actions?: ToastAction[];
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number, actions?: ToastAction[]) => void;
  removeToast: (id: string) => void;
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, duration: number = 3000, actions?: ToastAction[]) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type, duration, actions };

      setToasts((prev) => [...prev, newToast]);

      // Solo auto-cerrar si no tiene acciones y tiene duración
      if (duration > 0 && !actions) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const confirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      const actions: ToastAction[] = [
        {
          label: 'Cancelar',
          variant: 'secondary',
          onClick: () => {
            removeToast(id);
            onCancel?.();
          }
        },
        {
          label: 'Confirmar',
          variant: 'danger',
          onClick: () => {
            removeToast(id);
            onConfirm();
          }
        }
      ];

      const confirmToast: Toast = {
        id,
        message,
        type: 'confirm',
        duration: 0, // No auto-close
        actions
      };

      setToasts((prev) => [...prev, confirmToast]);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, confirm }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
