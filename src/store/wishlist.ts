import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  subtitle?: string; // Menyimpan nama warna atau kategori
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleWishlist: (newItem) => set((state) => {
        const exists = state.items.some((item) => item.id === newItem.id);
        if (exists) {
          // Hapus kalau sudah ada
          return { items: state.items.filter((item) => item.id !== newItem.id) };
        } else {
          // Tambah kalau belum ada
          return { items: [...state.items, newItem] };
        }
      }),
      removeFromWishlist: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
    }),
    { name: 'bose-wishlist-storage' }
  )
);