"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCartStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  
  // State Interaktif
  const [activeVariant, setActiveVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentVariant = product.variants?.[activeVariant];
  const displayImage = currentVariant?.imageUrls?.[0] || product.imageUrl;
  
  const isPreorder = product.status === 'preorder';
  const buttonText = isPreorder ? 'PREORDER' : 'ADD TO CART';
  
  // Deteksi Wishlist aman jika items undefined
  const isLiked = wishlistItems?.some((item) => item.id === product._id) || false;

  // Kalkulasi Diskon
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const saveAmount = hasDiscount ? product.originalPrice - product.price : 0;

  // Dummy Rating untuk UI (Nanti bisa disambung ke CMS)
  const rating = 4.7;
  const reviews = 1056;

  return (
    <div 
      // PERBAIKAN: Tinggi diset persis h-[594px] sesuai ukuran di bose.com
      className="group bg-[#f8f8f8] p-6 flex flex-col relative transition-all duration-300 h-[594px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tombol Heart (Wishlist) */}
      <button 
        onClick={(e) => {
          e.preventDefault(); 
          if(toggleWishlist) {
            toggleWishlist({
              id: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: displayImage,
              subtitle: currentVariant?.colorName || product.category
            });
          }
        }}
        className="absolute top-4 right-4 z-10 transition-transform active:scale-90"
      >
        <Heart 
          className={`w-6 h-6 transition-colors ${isLiked ? 'fill-black text-black' : 'text-gray-400 hover:text-black'}`} 
          strokeWidth={1.5} 
        />
      </button>

      {/* Area Gambar */}
      <Link href={`/product/${product.slug || '#'}`} className="w-full h-64 flex items-center justify-center mb-6 overflow-hidden mt-4">
        {displayImage ? (
          <img src={displayImage} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </Link>

      <div className="flex flex-col flex-grow">
        {/* Nama Warna Dinamis */}
        <p className="text-[13px] text-[#191919] mb-3 font-medium">
          Color: <span className="text-gray-600 font-normal">{currentVariant?.colorName || 'Default'}</span>
        </p>

        {/* Pilihan Warna */}
        <div className="flex gap-3 mb-6 h-6 items-center">
          {product.variants?.slice(0, 5).map((variant: any, idx: number) => (
            <button 
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setActiveVariant(idx);
              }}
              className={`w-7 h-7 rounded-full border-2 ring-1 ring-offset-2 transition-all ${activeVariant === idx ? 'ring-black border-white' : 'border-gray-200 ring-transparent hover:border-gray-400'}`}
              style={{ backgroundColor: variant.colorHex }}
              title={variant.colorName}
            />
          ))}
          {product.variants?.length > 5 && <span className="text-xs font-bold text-gray-500 ml-1">+{product.variants.length - 5}</span>}
        </div>

        {/* Nama Produk */}
        <Link href={`/product/${product.slug || '#'}`}>
          <h3 className="text-lg font-bold text-[#191919] mb-2 leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-black">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-current" strokeWidth={1} />
            ))}
          </div>
          <span className="text-[13px] font-medium text-[#0255cc] hover:underline cursor-pointer ml-1.5">{rating}</span>
          <span className="text-[13px] font-medium text-[#0255cc] hover:underline cursor-pointer">({reviews})</span>
        </div>
        
        {/* Spacer buat dorong harga ke paling bawah */}
        <div className="mt-auto"></div>

        {/* Area Harga / Tombol Add to Cart */}
        <div className="pt-2 h-[50px] relative overflow-hidden">
          
          {/* Tampilan Harga */}
          <div className={`absolute inset-0 flex flex-wrap items-center gap-2 transition-transform duration-300 ${isHovered ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
            <span className="text-base font-bold text-[#191919]">Rp {product.price?.toLocaleString('id-ID')}</span>
            {hasDiscount && (
              <>
                <span className="text-base font-medium text-[#c00] line-through">Rp {product.originalPrice?.toLocaleString('id-ID')}</span>
                <span className="text-base font-bold text-[#008000]">Save Rp {saveAmount.toLocaleString('id-ID')}</span>
              </>
            )}
          </div>

          {/* Tampilan Tombol */}
          <div className={`absolute inset-0 flex items-center transition-transform duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
             <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ id: product._id, name: product.name, price: product.price, image: displayImage, quantity: 1 });
                }}
                className="w-max px-6 py-2.5 border border-black bg-transparent text-black font-bold text-[11px] tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
             >
                {buttonText}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}