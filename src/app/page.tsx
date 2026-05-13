import { createClient } from 'next-sanity';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryNav from '@/components/CategoryNav';
import ProductCarousel from '@/components/ProductCarousel';
import SoundPowerCarousel from '@/components/SoundPowerCarousel';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// --- KOMPONEN BANTUAN UNTUK KARTU BENTO PROMO ---
function PromoCard({ data }: { data: any }) {
  if (!data || !data.imageUrl) return null;
  const isDark = data.textColor === 'dark'; 
  
  return (
    <Link href={data.buttonLink || '#'} className="relative group block w-full h-[450px] md:h-[550px] overflow-hidden bg-[#f8f8f8]">
      <img 
        src={data.imageUrl} 
        alt={data.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/10" />
      
      <div className={`absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col items-start ${isDark ? 'text-[#131317]' : 'text-white'}`}>
         <h3 className="text-3xl md:text-[42px] font-black tracking-tighter mb-2 leading-[1.1]">{data.title}</h3>
         <p className="text-sm md:text-base font-medium mb-6 max-w-md opacity-90">{data.subtitle}</p>
         <span className={`inline-block px-8 py-3.5 text-[12px] font-bold tracking-widest uppercase transition-all shadow-md ${isDark ? 'bg-[#131317] text-white group-hover:bg-gray-800' : 'bg-white text-[#131317] group-hover:bg-gray-200'}`}>
           {data.buttonText || 'SHOP NOW'}
         </span>
      </div>
    </Link>
  );
}

export default async function Home() {
  // 1. Ambil data untuk Hero Banner, Bento Grid Promo, Why Buy Features, dan Sound Power
  const homepageData = await sanityClient.fetch(`
    *[_type == "homepage"][0] {
      heroBadge,
      heroTitle,
      heroSubtitle,
      "heroImageUrl": heroImage.asset->url,
      heroButtonText,
      heroButtonLink,
      
      "promoTop": promoTop { title, subtitle, "imageUrl": image.asset->url, buttonText, buttonLink, textColor },
      "promoSplitLeft": promoSplitLeft { title, subtitle, "imageUrl": image.asset->url, buttonText, buttonLink, textColor },
      "promoSplitRight": promoSplitRight { title, subtitle, "imageUrl": image.asset->url, buttonText, buttonLink, textColor },
      "promoBottom": promoBottom { title, subtitle, "imageUrl": image.asset->url, buttonText, buttonLink, textColor },
      
      "whyBuyFeatures": whyBuyFeatures[] {
         title, description, "iconUrl": icon.asset->url, learnMoreLink
      },

      "soundPower": soundPower {
        title,
        subtitle,
        videos[] {
          "videoUrl": videoFile.asset->url,
          "thumbnailUrl": thumbnail.asset->url,
          caption
        }
      }
    }
  `);

  // 2. Ambil data Produk NEW ARRIVALS (Syarat: status == 'preorder')
  const newArrivals = await sanityClient.fetch(`
    *[_type == "product" && status == "preorder"] {
      _id,
      name,
      price,
      originalPrice,
      status,
      "slug": slug.current,
      "imageUrl": images[0].asset->url,
      variants[] {
        colorName,
        colorHex,
        "imageUrls": images[].asset->url
      }
    }
  `);

  // 3. Ambil data Produk TRENDING (Syarat: punya originalPrice / lagi diskon)
  const trendingProducts = await sanityClient.fetch(`
    *[_type == "product" && defined(originalPrice)] {
      _id,
      name,
      price,
      originalPrice,
      status,
      "slug": slug.current,
      "imageUrl": images[0].asset->url,
      variants[] {
        colorName,
        colorHex,
        "imageUrls": images[].asset->url
      }
    }
  `);

  // 4. Ambil data Navigasi untuk Header
  const navData = await sanityClient.fetch(`
    *[_type == "navigation"][0] {
      ...,
      "shopPromo": {
        ...shopPromo,
        "imageUrl": shopPromo.image.asset->url
      },
      "explorePromo": {
        ...explorePromo,
        "imageUrl": explorePromo.image.asset->url
      },
      "supportPromo": {
        ...supportPromo,
        "imageUrl": supportPromo.image.asset->url
      },
      "mothersDayPromo": {
        ...mothersDayPromo,
        "imageUrl": mothersDayPromo.image.asset->url
      },
      shopCategories[] {
        ...,
        "imageUrl": categoryImage.asset->url
      }
    }
  `);

  return (
    <main className="min-h-screen bg-white">
      <Header navData={navData} />
      <Hero data={homepageData} />
      <CategoryNav />

      {newArrivals.length > 0 && (
        <div className="pt-24 max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-10 pb-8">
          <h2 className="text-4xl md:text-[42px] font-black text-[#131317] tracking-tighter mb-12 uppercase">
            New Arrivals
          </h2>
          <ProductCarousel products={newArrivals} />
        </div>
      )}

      {trendingProducts.length > 0 && (
        <div className="pt-8 max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-10 pb-20">
          <h2 className="text-4xl md:text-[42px] font-black text-[#131317] tracking-tighter mb-12 uppercase">
            Trending Products
          </h2>
          <ProductCarousel products={trendingProducts} />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {homepageData?.promoTop?.imageUrl && (
            <div className="col-span-1 md:col-span-2"><PromoCard data={homepageData.promoTop} /></div>
          )}
          {homepageData?.promoSplitLeft?.imageUrl && (
            <div className="col-span-1"><PromoCard data={homepageData.promoSplitLeft} /></div>
          )}
          {homepageData?.promoSplitRight?.imageUrl && (
            <div className="col-span-1"><PromoCard data={homepageData.promoSplitRight} /></div>
          )}
          {homepageData?.promoBottom?.imageUrl && (
            <div className="col-span-1 md:col-span-2"><PromoCard data={homepageData.promoBottom} /></div>
          )}
        </div>
      </div>

      {/* --- PERBAIKAN: WHY BUY FROM PAI --- */}
      {/* Background diganti jadi bg-white, layout lebih clean */}
      {homepageData?.whyBuyFeatures && homepageData.whyBuyFeatures.length > 0 && (
        <div className="bg-white py-24 border-t border-gray-100 mt-10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-16 uppercase text-[#131317]">
              Why buy from PAI
            </h2>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10 pb-8">
              {homepageData.whyBuyFeatures.map((feature: any, idx: number) => (
                <div key={idx} className="min-w-[280px] md:min-w-0 snap-center flex flex-col items-center text-center px-4">
                  {feature.iconUrl ? (
                     <img src={feature.iconUrl} alt={feature.title} className="w-16 h-16 mb-8 object-contain mix-blend-multiply transition-transform hover:scale-110 duration-300" />
                  ) : (
                     <div className="w-16 h-16 mb-8 bg-gray-100 rounded-full"></div>
                  )}
                  <h3 className="font-bold text-xl md:text-2xl mb-4 leading-tight tracking-tight text-[#131317]">{feature.title}</h3>
                  <p className="text-gray-600 text-[15px] md:text-base font-medium leading-relaxed max-w-[260px] mb-5">{feature.description}</p>
                  
                  {/* Teks Learn more warna biru & ada ikon panah */}
                  <Link href={feature.learnMoreLink || '/why-buy'} className="text-[#0255cc] font-bold text-[15px] hover:underline flex items-center justify-center gap-1 transition-all group">
                    Learn more <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* --- REELS SECTION --- */}
      {homepageData?.soundPower && (
        <SoundPowerCarousel data={homepageData.soundPower} />
      )}

      <Footer />
    </main>
  );
}