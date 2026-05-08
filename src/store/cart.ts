import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean; // State untuk buka-tutup sidebar
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false, // Default tertutup
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true // Otomatis buka cart saat tambah barang
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }], isOpen: true };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: 'bose-cart-storage' }
  )
);