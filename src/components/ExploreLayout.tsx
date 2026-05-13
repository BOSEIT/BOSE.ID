"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

// ==========================================
// 1. KOMPONEN: TEKS TEMBUS PANDANG (HERO 3)
// ==========================================
function TextMaskReveal({ topText, bottomText, imageUrl }: { topText: string, bottomText: string, imageUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let p = 0;
      if (rect.top <= 0) {
        p = Math.abs(rect.top) / windowHeight;
      }
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Skala membesar eksponensial biar efek masuk ke dalam hurufnya dapet
  const scale = 1 + Math.pow(progress * 12, 3); 
  // Layar putih pelan-pelan ngilang pas udah nge-zoom mentok
  const overlayOpacity = progress > 0.8 ? 1 - ((progress - 0.8) * 5) : 1; 

  return (
    <div ref={containerRef} className="h-[300vh] w-full relative bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-white">
        
        {/* Gambar Background Asli */}
        <div className="absolute inset-0 w-full h-full">
           <img src={imageUrl} className="w-full h-full object-cover" />
        </div>
        
        {/* Layar Tembus Pandang (Mix Blend Mode) */}
        <div 
          className="absolute inset-0 bg-white flex flex-col items-center justify-center mix-blend-screen"
          style={{ opacity: Math.max(overlayOpacity, 0) }}
        >
           <h3 
             className="text-2xl md:text-5xl font-medium text-black mb-4 transition-opacity" 
             style={{ opacity: 1 - progress * 2 }}
           >
             {topText}
           </h3>
           <h2 
             className="text-[15vw] md:text-[180px] font-black uppercase text-black leading-none transform-origin-center will-change-transform"
             style={{ transform: `scale(${scale})` }}
           >
             {bottomText}
           </h2>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN: KOTAK EXPAND MEMBESAR
// ==========================================
function ExpandBox({ isVideo, src, link }: { isVideo?: boolean, src: string, link?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let p = 0;
      if (rect.top <= 0) {
        p = Math.abs(rect.top) / windowHeight;
      }
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ukuran bergerak dari 60vw/vh membesar ke 100vw/vh
  const width = 60 + progress * 40; 
  const height = 60 + progress * 40;

  const content = (
    <div 
      className="relative overflow-hidden transition-all ease-out duration-100 origin-center"
      style={{ width: `${width}vw`, height: `${height}vh` }}
    >
      {isVideo ? (
        <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
      ) : (
        <img src={src} alt="Expand" className="w-full h-full object-cover" />
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="h-[200vh] w-full relative bg-white">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {link ? <Link href={link} className="flex justify-center items-center">{content}</Link> : content}
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN: TEKS ZOOM & BLUR
// ==========================================
function ZoomText({ topText, bottomText }: { topText: string, bottomText: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let p = 0;
      if (rect.top <= 0) {
        p = Math.abs(rect.top) / windowHeight; 
      }
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 + progress * 25; 
  const blur = progress * 15;      
  const opacity = 1 - progress * 1.5; 

  return (
    <div ref={containerRef} className="h-[200vh] w-full relative bg-white">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <h2 className="text-3xl md:text-5xl font-medium text-black z-10 transition-opacity mb-4" style={{ opacity: opacity }}>
          {topText}
        </h2>
        <h2 
          className="text-6xl md:text-[150px] font-black uppercase text-black transform-origin-center will-change-transform leading-none"
          style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity: opacity }}
        >
          {bottomText}
        </h2>
      </div>
    </div>
  );
}

// ==========================================
// 4. KOMPONEN: SLIDER GAMBAR BESAR
// ==========================================
function BigSlider({ slides }: { slides: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const w = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -w : w, behavior: 'smooth' });
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="py-24 bg-white px-4 md:px-12">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Track Slider */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar">
          {slides.map((slide, i) => (
            <Link key={i} href={slide.link || '#'} className="min-w-full h-[40vh] md:h-[624px] snap-center shrink-0 block group overflow-hidden relative">
              <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
          ))}
        </div>

        {/* Tombol Panah Kiri Kanan */}
        <div className="flex gap-4 mt-8 justify-end">
           <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
           </button>
           <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
           </button>
        </div>

      </div>
    </section>
  );
}


// ==========================================
// 5. MAIN LAYOUT BERDASARKAN ALUR BOSE.COM
// ==========================================
export default function ExploreLayout({ data, products }: { data: any, products: any[] }) {
  return (
    <div className="bg-white">
      
      {/* 1. HERO 1: Fullscreen Gambar & Teks Tengah */}
      {data.heroImageUrl1 && (
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          <img src={data.heroImageUrl1} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-white px-4">
             <h2 className="text-2xl md:text-5xl font-medium mb-4">{data.heroText1Top}</h2>
             <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter">{data.heroText1Bottom}</h1>
          </div>
        </section>
      )}

      {/* 2. HERO 2: Judul Teks + Gambar Membesar */}
      {data.heroImageUrl2 && (
        <>
          <div className="bg-white pt-32 pb-10 text-center px-4">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{data.heroText2}</h2>
          </div>
          <ExpandBox src={data.heroImageUrl2} link="/shop" />
        </>
      )}

      {/* 3. HERO 3: Teks Tembus Pandang Membesar ke Gambar */}
      {data.heroImageUrl3 && (
        <TextMaskReveal 
          topText={data.heroText3Top} 
          bottomText={data.heroText3Bottom} 
          imageUrl={data.heroImageUrl3} 
        />
      )}

      {/* 4. SLIDER: Gambar Raksasa 1360px Kiri Kanan */}
      <BigSlider slides={data.sliderImages} />

      {/* 5. ZOOM TEKS 1 (Makin dekat makin blur) */}
      {data.zoomText1Top && (
        <ZoomText topText={data.zoomText1Top} bottomText={data.zoomText1Bottom} />
      )}

      {/* 6. EXPAND GAMBAR 1 */}
      {data.expandImage1Url && (
        <ExpandBox src={data.expandImage1Url} link={data.expandImage1Link} />
      )}

      {/* 7. ZOOM TEKS 2 (Makin dekat makin blur) */}
      {data.zoomText2Top && (
        <ZoomText topText={data.zoomText2Top} bottomText={data.zoomText2Bottom} />
      )}

      {/* 8. EXPAND VIDEO (Autoplay Berulang Tanpa Diklik) */}
      {data.expandVideoUrl && (
        <ExpandBox isVideo={true} src={data.expandVideoUrl} />
      )}

      {/* 9. EXPAND GAMBAR 2 */}
      {data.expandImage2Url && (
        <ExpandBox src={data.expandImage2Url} link={data.expandImage2Link} />
      )}

      {/* 10. PRODUCT GRID (Hanya nampilin produk Purpose ini) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-32 bg-white">
        <h2 className="text-4xl md:text-[56px] font-black tracking-tighter uppercase mb-12 text-center text-[#131317]">
          {data.productSectionTitle || `Max out your ${data.title}`}
        </h2>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 transition-all duration-500 bg-white border border-gray-100 shadow-sm">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-gray-200">
             <h3 className="text-2xl font-bold tracking-tighter uppercase text-gray-400">Products coming soon</h3>
          </div>
        )}
      </section>

    </div>
  );
}