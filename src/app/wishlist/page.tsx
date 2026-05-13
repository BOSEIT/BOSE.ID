"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Star, Package, CheckCircle2, Heart, Diamond, Truck, PenTool, UserCog } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlist';
import { useCartStore } from '../../store/cart';
import Header from '@/components/Header'; // Sesuaikan path jika beda
import Footer from '@/components/Footer'; // Sesuaikan path jika beda

const PERKS = [
  { icon: Star, text: "Save more with My Bose sign-up and special discounts.*" },
  { icon: Package, text: "Keep track of your Bose activity all in one place." },
  { icon: CheckCircle2, text: "Check your warranty directly in My Bose." },
  { icon: Heart, text: "Instantly add products to your Wish list and share with others." },
  { icon: Diamond, text: "Access to giveaways, events, product testing, and more.*" },
  { icon: Truck, text: "Save your settings for the quickest checkout experience." },
  { icon: PenTool, text: "Submit and track your service and repair requests." },
  { icon: UserCog, text: "Choose how you want to stay in touch.\n*Bose email opt-in required" }
];

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter data yang valid (berupa object lengkap, bukan string)
  const validItems = items.filter(item => item && typeof item === 'object' && item.name);

  // Data fallback agar Header tidak error karena tidak menerima data Sanity di halaman ini
  const fallbackNavData = {
    shopCategories: [],
    exploreCol1: [],
    exploreCol2: [],
    supportLinks: [],
    mothersDayLinks: [],
    shopPromo: null,
    explorePromo: null,
    supportPromo: null,
    mothersDayPromo: null
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      
      {/* --- GLOBAL HEADER --- */}
      <Header navData={fallbackNavData} />

      <main className="flex-grow flex flex-col">
        {/* --- HEADER TITLE & CONTENT --- */}
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-16 md:pt-24 pb-24 font-sans text-[#131317] flex-grow">
          
          <h1 className="text-4xl md:text-[56px] font-black tracking-tighter mb-4 uppercase">Your Wish list</h1>
          
          <p className="text-sm md:text-base text-gray-600 mb-10 font-medium max-w-3xl leading-relaxed">
            Please note, if you are not signed in, your lists are only available on this device and will expire at the end of this session.
          </p>
          
            <Link href="/login" className="inline-block border-2 border-[#131317] text-[#131317] px-8 py-3.5 text-[12px] font-bold tracking-widest uppercase hover:bg-[#131317] hover:text-white transition-all duration-300 mb-16 active:scale-95 shadow-sm text-center">
            SIGN IN / JOIN MY BOSE
            </Link>

          {validItems.length === 0 ? (
            <div className="text-center py-32 border-t border-gray-200 flex flex-col items-center">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 text-gray-400">Your Wish list is empty</h2>
              <Link 
                href="/" 
                className="group flex items-center gap-2 text-[#131317] font-bold text-sm tracking-widest uppercase pb-1 border-b-2 border-transparent hover:border-[#131317] transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8 border-t border-gray-200 pt-10">
              {validItems.map((item) => (
                <div key={item.id} className="group flex flex-col md:flex-row w-full bg-white border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                  
                  {/* KIRI: Putih/Light - Gambar Produk & Nama */}
                  <div className="flex-1 flex items-center p-6 md:p-10 bg-white relative">
                    <div className="w-28 h-28 md:w-40 md:h-40 flex-shrink-0 mix-blend-multiply mr-6 md:mr-10 transition-transform duration-700 group-hover:scale-105">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div className="flex flex-col z-10">
                      <h3 className="text-lg md:text-[22px] font-bold text-[#131317] mb-2 leading-tight tracking-tight group-hover:underline decoration-2 underline-offset-4">{item.name}</h3>
                      {item.subtitle && <p className="text-[13px] md:text-[14px] text-gray-500 font-medium">Color: <span className="text-gray-800">{item.subtitle}</span></p>}
                    </div>
                  </div>

                  {/* KANAN: Abu-abu - Harga, Remove, & Add to Cart */}
                  <div className="w-full md:w-[380px] lg:w-[420px] bg-[#f8f8f8] p-6 md:p-10 flex flex-col relative justify-center items-center md:border-l border-gray-100">
                    
                    {/* Remove Button di pojok kanan atas area abu-abu */}
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Remove <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                    
                    <div className="mt-8 mb-4 flex flex-col items-center w-full">
                      <div className="flex items-baseline gap-3 mb-8">
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through text-[15px] font-medium">Rp {item.originalPrice.toLocaleString('id-ID')}</span>
                        )}
                        <span className="font-black text-2xl md:text-[28px] tracking-tight text-[#131317]">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>

                      <button 
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 })}
                        className="w-full bg-[#131317] text-white py-4 font-bold text-[12px] tracking-[0.2em] uppercase hover:bg-black hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                      >
                        ADD TO CART
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MY BOSE PERKS SECTION --- */}
        <div className="w-full bg-white border-t border-gray-200 pt-24 pb-32 mt-auto">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
            
            <div className="max-w-2xl mb-16">
              <h2 className="text-4xl md:text-[56px] font-black tracking-tighter mb-6 uppercase text-[#131317] leading-[0.9]">My Bose Perks</h2>
              <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
                Now that you’re here, level up with all the exclusive My Bose benefits that help you tap into better sound experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
              {PERKS.map((perk, index) => {
                const IconComponent = perk.icon;
                return (
                  <div key={index} className="flex flex-col items-start group">
                    <div className="w-20 h-20 rounded-full bg-[#f8f8f8] flex items-center justify-center mb-6 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-[#131317]" strokeWidth={1.5} />
                    </div>
                    <p className="text-[15px] text-[#131317] font-medium leading-relaxed whitespace-pre-line">
                      {perk.text}
                    </p>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </main>

      {/* --- GLOBAL FOOTER --- */}
      <Footer />

    </div>
  );
}