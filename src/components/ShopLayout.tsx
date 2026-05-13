"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard'; 

interface ShopLayoutProps {
  products: any[];
  categoryTitle: string;
  categorySlug: string;
  parentCategory: { title: string, slug: string } | null;
  subLinks: { title: string, slug: string }[];
  promoAd: any;
}

export default function ShopLayout({ products, categoryTitle, categorySlug, parentCategory, subLinks, promoAd }: ShopLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openFilterGroups, setOpenFilterGroups] = useState<string[]>(['features', 'activity', 'new']);
  
  // State untuk Filter Nyata
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Toggle Accordion Sidebar
  const toggleGroup = (group: string) => {
    setOpenFilterGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);
  };

  // Ekstrak Semua Pilihan Filter Dinamis dari Produk yang Ada
  const dynamicFeatures = useMemo(() => Array.from(new Set(products.flatMap(p => p.filterFeatures || []))).sort(), [products]);
  const dynamicActivities = useMemo(() => Array.from(new Set(products.flatMap(p => p.filterActivity || []))).sort(), [products]);

  // Fungsi untuk mendapatkan jumlah produk di tiap fitur
  const getFeatureCount = (feat: string) => products.filter(p => p.filterFeatures?.includes(feat)).length;
  const getActivityCount = (act: string) => products.filter(p => p.filterActivity?.includes(act)).length;
  const newCount = products.filter(p => p.isNewItem).length;

  // Logika Filter Produk secara Real-time
  const filteredProducts = products.filter(p => {
    if (selectedFeatures.length > 0 && !selectedFeatures.some(f => p.filterFeatures?.includes(f))) return false;
    if (selectedActivities.length > 0 && !selectedActivities.some(a => p.filterActivity?.includes(a))) return false;
    if (showNewOnly && !p.isNewItem) return false;
    return true;
  });

  const handleFeatureCheck = (feat: string) => {
    setSelectedFeatures(prev => prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]);
  };

  const handleActivityCheck = (act: string) => {
    setSelectedActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]);
  };

  // --- LOGIKA UNTUK MEMBERSIHKAN DUPLIKAT TAB "ALL" ---
  const uniqueSubLinks = useMemo(() => {
    if (!subLinks || subLinks.length === 0) return [];
    const seenNames = new Set<string>();
    return subLinks.filter(link => {
      let label = link.title;
      if (label.toLowerCase().startsWith('all ')) {
        label = 'All';
      }
      if (seenNames.has(label)) return false; 
      seenNames.add(label);
      return true; 
    });
  }, [subLinks]);

  return (
    <div className="relative pb-32">
      
      {/* =========================================
          1. EFEK BLUR & SIDEBAR DRAWER (KIRI POJOK)
          ========================================= */}
      
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-500 ease-in-out ${isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsFilterOpen(false)}
      />

      <div className={`fixed top-0 left-0 h-full w-[350px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out overflow-y-auto ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
           <span className="font-black text-2xl tracking-tighter uppercase">Filters</span>
           <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8">
          {/* DINAMIS: FEATURES */}
          {dynamicFeatures.length > 0 && (
             <div className="border-b border-gray-200 py-6">
                <button onClick={() => toggleGroup('features')} className="w-full flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                  FEATURES {openFilterGroups.includes('features') ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFilterGroups.includes('features') ? 'mt-6 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   {dynamicFeatures.map(feat => (
                     <label key={feat} className="flex items-center justify-between gap-3 text-[14px] text-gray-600 mb-4 cursor-pointer hover:text-black group">
                       <div className="flex items-center gap-3">
                         <input 
                            type="checkbox" 
                            checked={selectedFeatures.includes(feat)}
                            onChange={() => handleFeatureCheck(feat)}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                         /> 
                         <span className="group-hover:font-medium transition-all">{feat}</span>
                       </div>
                       <span className="text-gray-400 text-xs">{getFeatureCount(feat)}</span>
                     </label>
                   ))}
                </div>
             </div>
          )}

          {/* DINAMIS: ACTIVITY */}
          {dynamicActivities.length > 0 && (
             <div className="border-b border-gray-200 py-6">
                <button onClick={() => toggleGroup('activity')} className="w-full flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
                  ACTIVITY {openFilterGroups.includes('activity') ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFilterGroups.includes('activity') ? 'mt-6 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   {dynamicActivities.map(act => (
                     <label key={act} className="flex items-center justify-between gap-3 text-[14px] text-gray-600 mb-4 cursor-pointer hover:text-black group">
                       <div className="flex items-center gap-3">
                         <input 
                            type="checkbox" 
                            checked={selectedActivities.includes(act)}
                            onChange={() => handleActivityCheck(act)}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                         /> 
                         <span className="group-hover:font-medium transition-all">{act}</span>
                       </div>
                       <span className="text-gray-400 text-xs">{getActivityCount(act)}</span>
                     </label>
                   ))}
                </div>
             </div>
          )}

          {/* DINAMIS: NEW ITEM */}
          <div className="border-b border-gray-200 py-6">
            <button onClick={() => toggleGroup('new')} className="w-full flex justify-between items-center text-[12px] font-bold tracking-widest uppercase">
              NEW {openFilterGroups.includes('new') ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openFilterGroups.includes('new') ? 'mt-6 max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <label className="flex items-center justify-between gap-3 text-[14px] text-gray-600 mb-2 cursor-pointer hover:text-black group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={showNewOnly}
                      onChange={() => setShowNewOnly(!showNewOnly)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                    /> 
                    <span className="group-hover:font-medium transition-all">New Arrivals</span>
                  </div>
                  <span className="text-gray-400 text-xs">{newCount}</span>
                </label>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          2. KONTEN UTAMA (GRID PRODUK)
          ========================================= */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-16">
        
        <h1 className="text-4xl md:text-[56px] font-black tracking-tighter mb-8 capitalize">{categoryTitle.replace('All ', '')}</h1>
        
        {uniqueSubLinks.length > 0 && (
          <div className="flex justify-start gap-6 md:gap-8 text-[13px] md:text-[14px] font-medium text-gray-500 mb-12 border-b border-gray-200 pb-3 overflow-x-auto hide-scrollbar">
            {uniqueSubLinks.map((link, index) => {
              let tabLabel = link.title;
              if (tabLabel.toLowerCase().startsWith('all ')) {
                tabLabel = "All";
              }

              const isActive = link.slug === categorySlug || (categorySlug === parentCategory?.slug && tabLabel === "All");

              return (
                <Link 
                  href={`/shop?category=${encodeURIComponent(link.slug)}`} 
                  key={`${link.slug}-${index}`}
                  className={`whitespace-nowrap transition-all hover:text-black pb-3 ${isActive ? 'text-black font-bold border-b-[3px] border-black -mb-[14px]' : ''}`}
                >
                  {tabLabel}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 font-bold text-sm hover:opacity-60 transition-opacity">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </button>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredProducts.length} Products</span>
        </div>

        {/* PERBAIKAN GRID: lg:grid-cols-3 dengan gap-0.5 untuk efek garis batas tipis yang super nempel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 transition-all duration-500 bg-white">
          
          {/* IKLAN HERO (MENGAMBIL 2 KOTAK / lg:col-span-2) */}
          {promoAd && promoAd.imageUrl && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 relative bg-[#131317] flex flex-col justify-end p-8 md:p-12 overflow-hidden group min-h-[594px]">
               <img src={promoAd.imageUrl} alt={promoAd.title} className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80 transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
               <div className="relative z-10 max-w-xl text-white">
                 {promoAd.eyebrow && <p className="text-gray-300 text-[11px] font-bold tracking-[0.2em] uppercase mb-4">{promoAd.eyebrow}</p>}
                 <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">{promoAd.title}</h3>
                 <p className="font-medium mb-10 text-sm md:text-base leading-relaxed opacity-90">{promoAd.description}</p>
                 {promoAd.buttonLink && (
                   <Link href={promoAd.buttonLink} className="inline-block bg-white text-black text-[12px] font-bold tracking-widest uppercase px-10 py-4 hover:bg-gray-200 transition-all shadow-xl">
                     {promoAd.buttonText || 'BUY NOW'}
                   </Link>
                 )}
               </div>
            </div>
          )}

          {/* LIST PRODUK HASIL FILTER */}
          {filteredProducts.map((product) => (
             <ProductCard key={product._id} product={product} />
          ))}

          {/* JIKA FILTER KOSONG */}
          {filteredProducts.length === 0 && (
             <div className="col-span-full py-40 text-center flex flex-col items-center">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">No matches found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}