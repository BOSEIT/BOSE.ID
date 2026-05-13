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
  isOpen: boolean; // State untuk buka-tutup modal
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void; // <-- TAMBAHAN BARU
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
            )
            // PERBAIKAN: isOpen: true dihapus agar tidak otomatis buka modal
          };
        }
        // PERBAIKAN: isOpen: true dihapus
        return { cart: [...state.cart, { ...item, quantity: 1 }] }; 
      }),

removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'bose-cart-storage' }
  )
);