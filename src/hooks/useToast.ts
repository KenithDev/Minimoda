import { useToastContext } from '../context/ToastContext';
import type { ToastType } from '../context/ToastContext';

export const useToast = () => {
  const { addToast, confirm } = useToastContext();

  const toast = {
    success: (message: string, duration?: number) => {
      addToast(message, 'success', duration);
    },
    error: (message: string, duration?: number) => {
      addToast(message, 'error', duration);
    },
    warning: (message: string, duration?: number) => {
      addToast(message, 'warning', duration);
    },
    info: (message: string, duration?: number) => {
      addToast(message, 'info', duration);
    },
    custom: (message: string, type: ToastType, duration?: number) => {
      addToast(message, type, duration);
    },
    confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => {
      confirm(message, onConfirm, onCancel);
    },
  };

  return toast;
};
