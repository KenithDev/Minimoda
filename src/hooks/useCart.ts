// ============================================
// CUSTOM HOOK - Carrito de Compras
// ============================================

import { useCartContext } from '../context/CartContext';

export const useCart = () => {
  return useCartContext();
};
