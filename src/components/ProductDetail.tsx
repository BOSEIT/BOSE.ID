"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Minus, Heart, Check, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist'; // <-- IMPORT WISHLIST STORE

// Sub-Komponen untuk Carousel Gambar Features
const FeatureCarousel = ({ feature }: { feature: any }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = feature.imageUrls || [];

  if (images.length === 0) return null;

  const nextImg = () => setImgIdx((prev) => (prev + 1) % images.length);
  const prevImg = () => setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="w-full relative bg-[#131317] aspect-[4/3] md:aspect-[21/9] flex flex-col justify-end overflow-hidden rounded-lg group">
      <img src={images[imgIdx]} alt={feature.title} className="absolute inset-0 w-full h-full object-cover mix-blend-screen transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
      
      {/* Teks Content */}
      <div className="relative z-10 p-8 md:p-16 max-w-3xl">
        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">{feature.title}</h3>
        <p className="text-white md:text-xl font-medium leading-relaxed opacity-90">{feature.description}</p>
      </div>

      {/* Kontrol Carousel */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-8 md:left-16 right-8 md:right-16 flex justify-between items-center z-20">
          <div className="flex gap-2">
            {images.map((_: any, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setImgIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${imgIdx === idx ? 'bg-white' : 'bg-gray-500 hover:bg-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={prevImg} className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImg} className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProductDetail({ product }: { product: any }) {
  const { addToCart } = useCartStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore(); // <-- IMPORT WISHLIST STORE
  const isWishlisted = wishlistItems.some((item) => item.id === product._id);
  
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State Accordion & Features
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);
  const [showAllMini, setShowAllMini] = useState(false);
  
  // STATE READ MORE / READ LESS
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // State Sticky Navbar & Bottom Bar
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showStickyBottom, setShowStickyBottom] = useState(false);
  
  // State Dinamis Tinggi Header Bose
  const [headerHeight, setHeaderHeight] = useState(116);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target instanceof HTMLElement) {
            setHeaderHeight(entry.target.offsetHeight);
          }
        }
      });
      observer.observe(header);
      return () => observer.disconnect();
    }
  }, []);

  const currentVariant = product.variants?.[activeVariant] || null;
  const currentImages = currentVariant?.imageUrls || (product.imageUrl ? [product.imageUrl] : []);
  
  const isPreorder = product.status === 'preorder';
  const buttonText = isPreorder ? 'PREORDER' : 'ADD TO CART';

  const displayedMiniFeatures = showAllMini ? product.miniFeatures : product.miniFeatures?.slice(0, 4);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);

      setShowStickyBottom(currentScrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleScrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = isHeaderVisible ? headerHeight + 60 : 60; 
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <div className="w-full pb-24 relative transition-all duration-300" style={{ paddingTop: headerHeight }}>
      
      {/* --- STICKY TABS NAVBAR --- */}
      <div 
        className={`fixed left-0 w-full bg-white z-30 border-b border-gray-200 flex justify-center gap-8 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-widest transition-all duration-500`}
        style={{ top: isHeaderVisible ? headerHeight : 0 }}
      >
        <button onClick={() => handleScrollTo('overview')} className={`hover:text-black transition-colors ${activeTab === 'overview' ? 'text-black border-b-2 border-black pb-1' : ''}`}>Overview</button>
        <button onClick={() => handleScrollTo('details')} className={`hover:text-black transition-colors ${activeTab === 'details' ? 'text-black border-b-2 border-black pb-1' : ''}`}>Details</button>
        {product.relatedAccessories?.length > 0 && (
          <button onClick={() => handleScrollTo('accessories')} className={`hover:text-black transition-colors ${activeTab === 'accessories' ? 'text-black border-b-2 border-black pb-1' : ''}`}>Accessories</button>
        )}
      </div>

      {/* Konten Utama */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-20">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs font-medium text-gray-500 mb-6 md:mb-10 space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="hover:underline cursor-pointer">{product.category || 'Shop'}</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#191919]">{product.name}</span>
        </nav>

        {/* --- MAIN HERO SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-24" id="overview">
          
          <div className="w-full lg:w-[60%] flex flex-col items-center">
            {/* Main Image */}
            <div className="w-full aspect-square md:aspect-[4/3] bg-[#f8f8f8] flex items-center justify-center p-8 md:p-16 relative rounded-lg">
              {currentImages.length > 0 ? (
                <img src={currentImages[activeImage]} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 w-full">
              {currentImages.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 bg-[#f8f8f8] rounded-md border-2 flex items-center justify-center p-2 flex-shrink-0 transition-colors ${activeImage === idx ? 'border-black' : 'border-transparent'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>

            {/* --- MINI FEATURES ICONS (Berada persis di bawah gambar) --- */}
            {product.miniFeatures && product.miniFeatures.length > 0 && (
              <div className="w-full mt-12 bg-[#f8f8f8] py-10 px-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
                  {displayedMiniFeatures.map((feat: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center text-center px-2">
                      {feat.iconUrl && <img src={feat.iconUrl} alt="icon" className="w-10 h-10 mb-4 mix-blend-multiply" />}
                      <h4 className="font-bold text-[13px] md:text-[14px] mb-1 leading-snug">{feat.title}</h4>
                      <p className="text-[12px] md:text-[13px] text-gray-600 leading-snug">{feat.subtitle}</p>
                    </div>
                  ))}
                </div>
                {product.miniFeatures.length > 4 && (
                  <div className="w-full flex justify-center mt-10">
                    <button onClick={() => setShowAllMini(!showAllMini)} className="text-sm font-bold flex flex-col items-center hover:text-gray-500 transition-colors">
                      {showAllMini ? <ChevronUp className="w-4 h-4 mb-1" /> : <ChevronDown className="w-4 h-4 mb-1" />}
                      {showAllMini ? 'View less' : 'View more'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* --- OVERVIEW VIDEO --- */}
            {product.videoUrl && (
              <div className="w-full mt-10 rounded-lg overflow-hidden">
                <video src={product.videoUrl} autoPlay loop muted playsInline className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          {/* KANAN: Product Info */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-[160px] h-max">
            {isPreorder && <span className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full w-max mb-4 inline-block uppercase tracking-widest">Preorder</span>}
            <h1 className="text-3xl md:text-[40px] font-bold leading-[1.1] tracking-tight mb-3">{product.name}</h1>
            
            {/* PERBAIKAN: Read More / Read Less untuk Deskripsi */}
            <div className="relative mb-6">
              <p className={`text-base text-gray-600 font-medium leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                {product.tagline}
              </p>
              {product.tagline && product.tagline.length > 100 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-2 text-sm font-bold underline underline-offset-4 hover:text-gray-500 transition-colors"
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-2xl font-black">Rp {product.price?.toLocaleString('id-ID')}</p>
              {product.originalPrice && (
                <p className="text-lg text-gray-400 font-medium line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-bold mb-4">Color: <span className="font-normal text-gray-600">{currentVariant?.colorName}</span></p>
                <div className="flex gap-4">
                  {product.variants.map((variant: any, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveVariant(idx); setActiveImage(0); }}
                      className={`w-9 h-9 rounded-full border border-gray-300 ring-2 ring-offset-2 transition-all ${activeVariant === idx ? 'ring-black' : 'ring-transparent hover:border-gray-500'}`}
                      style={{ backgroundColor: variant.colorHex }}
                      title={variant.colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PERBAIKAN: Tombol Add To Cart bersebelahan dengan tombol Wishlist (Love) */}
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => addToCart({ id: product._id, name: product.name, price: product.price, image: currentImages[0], quantity: 1 })}
                className="flex-1 bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg rounded"
              >
                {buttonText}
              </button>

              <button 
                onClick={() => toggleWishlist({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: currentImages[0],
                  subtitle: currentVariant?.colorName || product.category
                })}
                className={`w-[54px] h-[54px] shrink-0 rounded border-2 flex items-center justify-center transition-all shadow-md ${isWishlisted ? 'bg-black border-black text-white' : 'border-gray-300 bg-white text-black hover:border-black'}`}
                title="Add to Wishlist"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 mb-10">Free standard shipping and 30-day returns</p>

            <div className="space-y-3 mt-8 pt-8 border-t border-gray-200">
              <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mb-4">Benefits of buying direct from Bose</p>
              {['90-day risk-free trial', 'Price match promise', 'Complimentary shipping & returns'].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><Check className="w-3 h-3 text-green-700" strokeWidth={3} /></div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- DYNAMIC LUSH CINEMATIC SOUND (CAROUSEL) --- */}
        {product.features && product.features.length > 0 && (
          <div className="mb-32">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase text-[#131317]">Lush, cinematic sound</h2>
            <div className="space-y-8 mt-12">
              {product.features.map((feature: any, idx: number) => (
                <FeatureCarousel key={idx} feature={feature} />
              ))}
            </div>
          </div>
        )}

        {/* --- DYNAMIC PRODUCT DETAILS (EXCLUSIVE ACCORDION) --- */}
        <div id="details" className="pt-16 mb-24 max-w-5xl">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-16 uppercase text-[#131317]">Product details</h2>

          {/* 1. What's in the box */}
          {product.whatsInTheBox && product.whatsInTheBox.length > 0 && (
            <div className="border-t border-black py-6">
              <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('box')}>
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-gray-600 transition-colors">What’s in the box</h3>
                {openSection === 'box' ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'box' ? 'max-h-[1000px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#f8f8f8] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center rounded-lg">
                  <div className="w-full md:w-1/2">
                    {product.boxImageUrl && <img src={product.boxImageUrl} alt="What's in the box" className="w-full object-contain mix-blend-multiply" />}
                  </div>
                  <div className="w-full md:w-1/2">
                    <ul className="space-y-4">
                      {product.whatsInTheBox.map((item: string, idx: number) => (
                        <li key={idx} className="text-gray-700 font-medium text-sm md:text-base border-b border-gray-200 pb-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Technical Specs */}
          {product.technicalSpecs && product.technicalSpecs.length > 0 && (
            <div className="border-t border-gray-300 py-6">
              <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('specs')}>
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-gray-600 transition-colors">Technical Specifications</h3>
                {openSection === 'specs' ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'specs' ? 'max-h-[1000px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#f8f8f8] p-8 md:p-16 rounded-lg">
                  {product.technicalSpecs.map((spec: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row py-4 border-b border-gray-200 last:border-0">
                      <div className="w-full md:w-1/3 font-bold text-sm mb-2 md:mb-0">{spec.specName}</div>
                      <div className="w-full md:w-2/3 text-sm text-gray-700 leading-relaxed">{spec.specValue}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. FAQs */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="border-t border-gray-300 py-6">
               <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('faqs')}>
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-gray-600 transition-colors">FAQ's</h3>
                {openSection === 'faqs' ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
               <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'faqs' ? 'max-h-[2000px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="bg-[#f8f8f8] p-8 md:p-16 rounded-lg">
                   {product.faqs.map((faq: any, idx: number) => (
                     <div key={idx} className="border-b border-gray-300 last:border-0">
                       <button onClick={() => setOpenFaqItem(openFaqItem === idx ? null : idx)} className="w-full flex justify-between items-center py-6 text-left group">
                         <span className="font-bold text-sm md:text-base group-hover:text-gray-600 pr-8 leading-snug">{faq.question}</span>
                         {openFaqItem === idx ? <Minus className="w-5 h-5 flex-shrink-0" /> : <Plus className="w-5 h-5 flex-shrink-0" />}
                       </button>
                       <div className={`overflow-hidden transition-all duration-300 ${openFaqItem === idx ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                         <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* --- ACCESSORIES --- */}
        {product.relatedAccessories && product.relatedAccessories.length > 0 && (
          <div id="accessories" className="pt-16 mb-24 border-t border-black">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 uppercase text-[#131317]">Accessories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {product.relatedAccessories.map((acc: any) => {
                const accVariant = acc.variants?.[0];
                const accImage = accVariant?.imageUrls?.[0];
                const isAccWishlisted = wishlistItems.some((item) => item.id === acc._id);
                
                return (
                  <div key={acc._id} className="group bg-[#f8f8f8] p-6 flex flex-col relative hover:shadow-lg transition duration-300 rounded-lg">
                    {/* Tombol Wishlist di pojok Aksesoris */}
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        toggleWishlist({
                          id: acc._id,
                          name: acc.name,
                          price: acc.price,
                          originalPrice: acc.originalPrice,
                          image: accImage,
                          subtitle: accVariant?.colorName
                        }); 
                      }}
                      className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${isAccWishlisted ? 'fill-black text-black' : 'text-gray-400 hover:text-black'}`} />
                    </button>
                    
                    <Link href={`/product/${acc.slug}`} className="flex-1 flex flex-col">
                      <div className="w-full h-48 flex items-center justify-center mb-6 overflow-hidden">
                        {accImage && <img src={accImage} alt={acc.name} className="max-h-full object-contain group-hover:scale-105 transition duration-500 mix-blend-multiply" />}
                      </div>
                      <p className="text-[11px] text-gray-500 mb-2">Color: {accVariant?.colorName || 'Default'}</p>
                      <div className="flex gap-2 mb-4">
                        {acc.variants?.map((v: any, i: number) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: v.colorHex }}></div>
                        ))}
                      </div>
                      <h3 className="text-base font-semibold mb-2">{acc.name}</h3>
                      <p className="text-base font-bold mt-auto">Rp {acc.price?.toLocaleString('id-ID')}</p>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* --- STICKY BOTTOM CART BAR --- */}
      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] py-3 px-4 md:px-12 z-50 transition-transform duration-500 ${showStickyBottom ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentImages[0] && <img src={currentImages[0]} alt="Thumb" className="w-12 h-12 md:w-16 md:h-16 object-contain bg-[#f8f8f8] rounded mix-blend-multiply" />}
            <div className="hidden md:block">
              <h4 className="font-bold text-sm md:text-base leading-tight">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: currentVariant?.colorHex }}></div>
                <span className="text-[11px] text-gray-500">{currentVariant?.colorName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-lg md:text-xl font-bold">Rp {product.price?.toLocaleString('id-ID')}</div>
            <button 
              onClick={() => addToCart({ id: product._id, name: product.name, price: product.price, image: currentImages[0], quantity: 1 })}
              className="bg-black text-white px-6 md:px-10 py-3 font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-md rounded"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}