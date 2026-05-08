"use client";

import { useCartStore, CartItem } from '../store/cart';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }: { product: any }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const handleAdd = () => {
    const item: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
    };
    addToCart(item);
    
    // Langsung arahkan (redirect) ke halaman Cart persis seperti Bose
    router.push('/cart');
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-full bg-[#191919] text-white py-4 rounded-full font-bold text-[15px] hover:bg-black transition-all active:scale-[0.98]"
    >
      Add to Cart
    </button>
  );
}