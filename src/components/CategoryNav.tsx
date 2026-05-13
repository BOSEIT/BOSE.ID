"use client";

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories?: any[];
}

export default function CategoryNav({ categories = [] }: CategoryNavProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Daftar menu Bapak Kategori (Default sesuai CMS kita)
  const defaultCategories = [
    'New & Exclusive', 
    'Headphones', 
    'Earbuds', 
    'Speakers', 
    'Home Theater', 
    'Portable PA', 
    'Aviation Headsets'
  ];

  // Gunakan data CMS jika dikirim, jika tidak pakai default di atas
  const displayCategories = categories.length > 0 
    ? categories.map((cat: any) => cat.title)
    : defaultCategories;

  // Fungsi helper untuk bikin URL Slug persis seperti di Header!
  const makeUrl = (text: string) => {
    const slug = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/[^\w\-]+/g, '')       
      .replace(/\-\-+/g, '-')         
      .replace(/^-+/, '')             
      .replace(/-+$/, '');            
    return `/shop?category=${slug}`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-[#f8f8f8] relative z-30" aria-label="Secondary navigation">
      <div className="w-full max-w-[1440px] mx-auto relative group">
        
        {/* --- TOMBOL PANAH KIRI --- */}
        <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f8f8] to-transparent z-10 flex items-center pl-4 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => scroll('left')} 
            className="bg-white border border-gray-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
          </button>
        </div>

        {/* --- DAFTAR KATEGORI --- */}
        <ul 
          ref={scrollRef}
          onScroll={handleScroll} 
          className="flex overflow-x-auto whitespace-nowrap hide-scrollbar items-center py-6 scroll-smooth md:justify-center"
        >
          {displayCategories.map((cat) => (
            <li 
              key={cat} 
              className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 flex justify-center px-2"
            >
              <Link 
                href={makeUrl(cat)} 
                className="text-[14px] md:text-[15px] font-bold text-[#131317] hover:text-gray-600 transition-all uppercase tracking-tighter"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>

        {/* --- TOMBOL PANAH KANAN --- */}
        <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f8f8] to-transparent z-10 flex items-center justify-end pr-4 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => scroll('right')} 
            className="bg-white border border-gray-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-black" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </nav>
  );
}