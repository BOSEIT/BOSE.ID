"use client";

import Link from 'next/link';
import { Search, User, ShoppingCart, Menu, ChevronLeft, ChevronRight, X, Play, Pause, Heart } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist'; 
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; 
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const ALERTS = [
  { text: "NOW AVAILABLE: Shop the new Bose Lifestyle Collection.", linkText: "Shop Learn more" },
  { text: "MOTHER’S DAY SALE: Save up to 45% on gifts that help Mom find her rhythm.", linkText: "Shop" },
  { text: "COMPLIMENTARY SHIPPING & RETURNS on all in-stock orders of $49 or more.", linkText: "Learn more" }
];

export default function Header({ navData }: { navData: any }) {
  const { cart, toggleCart } = useCartStore(); 
  const { items: wishlistItems } = useWishlistStore(); 
  
  // --- STATE FIREBASE AUTH ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentAlert, setCurrentAlert] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeShopCat, setActiveShopCat] = useState(0);

  // --- STATE ANIMASI KERANJANG ---
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Hitung total kuantitas semua barang di keranjang
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Efek Animasi jika total barang bertambah/berubah
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400); // Animasi selama 400ms
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
        setActiveMenu(null);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!showAlert || isPaused) return; 
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % ALERTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [showAlert, isPaused]);

  const nextAlert = () => setCurrentAlert((prev) => (prev + 1) % ALERTS.length);
  const prevAlert = () => setCurrentAlert((prev) => (prev === 0 ? ALERTS.length - 1 : prev - 1));

  const makeUrl = (text: string) => {
    const slug = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/[^\w\-]+/g, '')       
      .replace(/\-\-+/g, '-')         
      .replace(/^-+/, '')             
      .replace(/-+$/, '');            

    // TAMBAHAN: Link External untuk Repair & Replacement
    if (slug === 'repair-replacement') return 'https://service.bettersound.id';

    // Pengecualian khusus untuk link halaman statis biar gak lari ke /shop
    if (slug === 'contact-us') return '/contact-us';
    if (slug === 'why-buy-direct' || slug === 'why-buy-from-pai') return '/why-buy';

    // TAMBAHAN: Deteksi kalau diklik dari menu EXPLORE
    const exploreItems = ['home', 'work', 'on-the-go', 'fitness', 'tv-movies'];
    if (exploreItems.includes(slug)) {
      return `/explore/${slug}`;
    }

    return `/shop?category=${slug}`;
  };

  return (
    <header className={`w-full font-sans tracking-wide z-50 sticky top-0 bg-white transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      
      {/* --- ALERT BANNER --- */}
      {showAlert && (
        <div className="bg-[#b4bec7] text-[#131317] text-[12px] md:text-[14px] text-center py-2.5 px-4 flex justify-between items-center relative z-50 group">
          <div className="flex items-center gap-3 md:gap-5 w-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={() => setIsPaused(!isPaused)} className="hover:opacity-60 transition-opacity">
              {isPaused ? <Play className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} /> : <Pause className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />}
            </button>
            <button onClick={prevAlert} className="hover:opacity-60 transition-opacity">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative flex items-center justify-center h-6 text-center">
            {ALERTS.map((alert, index) => {
              let pos = index === currentAlert ? "translate-x-0 opacity-100 z-10" : (index === currentAlert - 1 || (currentAlert === 0 && index === ALERTS.length - 1)) ? "-translate-x-full opacity-0" : "translate-x-full opacity-0";
              return (
                <div key={index} className={`absolute w-full transition-all duration-700 ease-in-out flex justify-center items-center ${pos}`}>
                  <span className="font-medium tracking-wide">{alert.text}</span>
                  <Link href="/shop" className="underline font-bold ml-1.5 hover:text-gray-700 transition-colors">{alert.linkText}</Link>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-3 md:gap-5 justify-end w-24">
            <button onClick={nextAlert} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-60"><ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></button>
            <button onClick={() => setShowAlert(false)} className="hover:opacity-60 transition-opacity"><X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></button>
          </div>
        </div>
      )}

      {/* --- MAIN NAVIGATION --- */}
      <div className="bg-white relative z-40 border-b border-gray-200">
        
        {/* PERBAIKAN: max-w dilepas, diganti w-full agar mentok ke pojok layar */}
        <nav className="w-full flex items-center justify-between px-4 md:px-8 lg:px-12 h-[64px] md:h-[72px]">
          
          {/* BAGIAN KIRI: Menu Hamburger + BOSE Logo + Nav Links (Mentok Kiri) */}
          <div className="flex items-center gap-4 lg:gap-8 h-full flex-1">
            <button className="md:hidden p-2 -ml-2"><Menu className="w-6 h-6" /></button>
            
            {/* BOSE Pindah Ke Kiri Mentok */}
            <Link href="/" onMouseEnter={() => setActiveMenu(null)} className="flex-shrink-0">
              <h1 className="text-2xl md:text-[32px] font-black italic tracking-tighter">BOSE</h1>
            </Link>

            <div className="hidden md:flex gap-6 lg:gap-8 text-[13px] lg:text-[14px] font-bold text-[#131317] tracking-wider uppercase h-full items-center ml-2 lg:ml-4">
              <div className="h-full flex items-center cursor-pointer hover:text-gray-500 transition-colors" onMouseEnter={() => setActiveMenu('shop')}>Shop</div>
              <div className="h-full flex items-center cursor-pointer hover:text-gray-500 transition-colors" onMouseEnter={() => setActiveMenu('explore')}>Explore</div>
              <div className="h-full flex items-center cursor-pointer hover:text-gray-500 transition-colors" onMouseEnter={() => setActiveMenu('support')}>Support</div>
              {navData?.mothersDayLinks?.length > 0 && (
                <div className="h-full flex items-center cursor-pointer text-[#a81c4e] hover:text-[#d12c6a] transition-colors" onMouseEnter={() => setActiveMenu('mothers-day')}>Mother's Day</div>
              )}
            </div>
          </div>

          {/* BAGIAN KANAN: Search, Icons, Keranjang, dan PAI (Mentok Kanan) */}
          <div className="flex items-center justify-end gap-4 md:gap-5 text-[#131317] flex-1">
            <div className="hidden lg:flex items-center bg-[#f3f3f3] rounded-full px-4 py-2 mr-2 border border-transparent focus-within:border-gray-300 transition-all">
               <input type="text" placeholder="Search" className="bg-transparent text-[14px] outline-none w-48 font-medium" />
               <Search className="w-4 h-4 text-gray-500" />
            </div>
            
            <button className="p-1 lg:hidden hover:opacity-60 transition-opacity"><Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></button>
            
            {/* Dinamis: Kalau login ke /account, kalau belum ke /login */}
            <Link href={currentUser ? "/account" : "/login"} className="p-1 hidden md:block hover:opacity-60 transition-opacity">
              <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </Link>
            
            {/* Link ke halaman Wishlist dengan Counter */}
            <Link href="/wishlist" className="p-1 hover:opacity-60 transition-opacity hidden md:block relative">
              <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#131317] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <button 
              onClick={toggleCart} 
              className={`p-1 relative block transition-all duration-300 ${isAnimating ? 'scale-125' : 'hover:opacity-60 scale-100'}`}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold transition-all duration-300 ${isAnimating ? 'bg-red-500 scale-110' : 'bg-[#131317] scale-100'}`}>
                  {cart.length}
                </span>
              )}
            </button>

            {/* PAI Sisip Di Pojok Kanan Mentok */}
            <div className="flex items-center pl-3 md:pl-5 border-l-2 border-gray-200 h-8">
              <h1 className="text-xl md:text-[28px] font-black italic tracking-tighter text-[#131317]">PAI</h1>
            </div>
          </div>
        </nav>

        {/* --- DYNAMIC MEGA MENU --- */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl transition-all duration-300 overflow-hidden ${activeMenu ? 'max-h-[600px] opacity-100 py-10' : 'max-h-0 opacity-0 py-0'}`} 
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* PERBAIKAN: Laci dropdown mega menu juga dilebarkan agar seimbang */}
          <div className="w-full px-8 md:px-12 flex">
            {activeMenu === 'shop' && navData?.shopCategories && (
              <>
                <div className="w-[22%] flex flex-col gap-5 pr-8">
                  {navData.shopCategories.map((cat: any, idx: number) => (
                    <div 
                      key={idx} 
                      onMouseEnter={() => setActiveShopCat(idx)} 
                      className={`text-[17px] cursor-pointer w-max transition-all ${activeShopCat === idx ? 'text-black border-b-[2px] border-black pb-0.5 -mb-[2px] font-bold' : 'text-gray-800 hover:text-black'}`}
                    >
                      {cat.title}
                    </div>
                  ))}
                </div>
                <div className="w-1/4 flex flex-col gap-4 pl-12 border-l border-gray-300">
                  {navData.shopCategories[activeShopCat]?.links?.map((link: string, i: number) => (
                    <Link 
                      href={makeUrl(link)} 
                      key={i} 
                      onClick={() => setActiveMenu(null)}
                      className={`text-[15px] hover:underline w-max ${i === 0 ? 'font-bold text-black mb-2' : 'text-gray-700'}`}
                    >
                      {link}
                    </Link>
                  ))}
                </div>
                <div className="w-2/5 pl-8 relative group cursor-pointer ml-auto">
                  <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
                    <img src={navData.shopPromo?.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b"} alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4">
                      {navData.shopPromo?.badge && <span className="bg-white text-black text-[11px] font-bold px-2 py-1 uppercase">{navData.shopPromo.badge}</span>}
                      <h4 className="text-white text-2xl font-black mt-2 uppercase">{navData.shopPromo?.title || "Lifestyle Collection"}</h4>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'explore' && navData?.exploreCol1 && (
              <>
                <div className="w-1/4 flex flex-col pr-8 border-r border-gray-300">
                  <div className="flex flex-col gap-4 mb-8">
                    {navData.exploreCol1.map((link: string, i: number) => (
                      <Link href={makeUrl(link)} key={i} onClick={() => setActiveMenu(null)} className="text-[17px] text-gray-800 hover:underline w-max">{link}</Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {navData.exploreCol2?.map((link: string, i: number) => (
                      <Link href={makeUrl(link)} key={i} onClick={() => setActiveMenu(null)} className={`text-[15px] text-gray-500 hover:text-black w-max ${i === 0 ? 'border-b border-gray-300 pb-2 mb-1' : 'hover:underline'}`}>
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="w-2/5 pl-12 relative group cursor-pointer ml-auto">
                    <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
                        <img src={navData.explorePromo?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4">
                            {navData.explorePromo?.badge && <span className="bg-white text-black text-[11px] font-bold px-2 py-1 uppercase">{navData.explorePromo.badge}</span>}
                            <h4 className="text-white text-2xl font-black mt-2 uppercase">{navData.explorePromo?.title || "Bose Stories"}</h4>
                        </div>
                    </div>
                </div>
              </>
            )}

            {activeMenu === 'support' && navData?.supportLinks && (
              <>
                <div className="w-1/4 flex flex-col gap-4 pr-8 border-r border-gray-300">
                  {navData.supportLinks.map((link: string, i: number) => (<Link href={makeUrl(link)} key={i} onClick={() => setActiveMenu(null)} className="text-[17px] text-gray-800 hover:underline w-max">{link}</Link>))}
                </div>
                <div className="w-2/5 pl-12 relative group cursor-pointer ml-auto">
                    <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
                        <img src={navData.supportPromo?.imageUrl || "https://images.unsplash.com/photo-1616423640778-28d1b53229bd"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4">
                            {navData.supportPromo?.badge && <span className="bg-white text-black text-[11px] font-bold px-2 py-1 uppercase">{navData.supportPromo.badge}</span>}
                            <h4 className="text-white text-2xl font-black mt-2 uppercase">{navData.supportPromo?.title || "Get Help"}</h4>
                        </div>
                    </div>
                </div>
              </>
            )}

            {activeMenu === 'mothers-day' && navData?.mothersDayLinks && (
              <>
                <div className="w-1/4 flex flex-col gap-4 border-r border-gray-100 pr-8">
                  <h3 className="font-bold text-[13px] uppercase tracking-widest text-[#a81c4e] mb-2">Mother's Day</h3>
                  {navData.mothersDayLinks.map((link: string, i: number) => (<Link href={makeUrl(link)} key={i} onClick={() => setActiveMenu(null)} className="text-[15px] font-medium text-[#a81c4e] hover:underline underline-offset-4">{link}</Link>))}
                </div>
                <div className="w-2/5 pl-8 relative group cursor-pointer ml-auto">
                    <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
                        <img src={navData.mothersDayPromo?.imageUrl || "https://images.unsplash.com/photo-1581515273151-5b7fbabf1a8e"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4">
                            {navData.mothersDayPromo?.badge && <span className="bg-white text-black text-[11px] font-bold px-2 py-1 uppercase">{navData.mothersDayPromo.badge}</span>}
                            <h4 className="text-white text-2xl font-black mt-2 uppercase">{navData.mothersDayPromo?.title || "Gifts for Mom"}</h4>
                        </div>
                    </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}