"use client";

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: any[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State untuk mendeteksi apakah bisa scroll
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true); 

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [products]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // PERBAIKAN: Scroll sejauh lebar 1 kartu (452px) + sedikit gap
      const scrollAmount = direction === 'left' ? -454 : 452;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative group">
      
      {/* KONTROL TOMBOL PANAH */}
      <div className="flex justify-end gap-4 mb-6 absolute -top-[88px] right-0">
        <button 
          onClick={() => scroll('left')} 
          disabled={!canScrollLeft}
          suppressHydrationWarning
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            !canScrollLeft ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-black hover:bg-gray-100 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll('right')} 
          disabled={!canScrollRight}
          suppressHydrationWarning
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            !canScrollRight ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-black hover:bg-gray-100 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* TRACK CAROUSEL PRODUK */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        // PERBAIKAN: Gap dibuat 0.5 (2px) agar super mepet sesuai request
        className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 bg-white"
      >
        {products.map((product) => (
          <div 
            key={product._id} 
            // PERBAIKAN: Lebar diset persis 452px di layar desktop agar sama dengan inspect
            className="min-w-[280px] md:min-w-[380px] lg:min-w-[452px] lg:w-[452px] snap-start flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}