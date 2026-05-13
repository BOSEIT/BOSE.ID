import { createClient } from 'next-sanity';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Globe, Headphones } from 'lucide-react';
import Link from 'next/link';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export default async function ContactUsPage() {
  const navData = await sanityClient.fetch(`*[_type == "navigation"][0] {
    ...,
    shopCategories[] { ..., "imageUrl": categoryImage.asset->url }
  }`);

  return (
    <main className="min-h-screen bg-white">
      <Header navData={navData} />
      
      {/* HERO SECTION PREMIUM - CLEAN WHITE VERSION */}
      <section className="bg-white text-[#131317] py-24 md:py-32 px-4 text-center border-b border-gray-50">
         <div className="max-w-3xl mx-auto">
            <span className="text-[12px] font-bold tracking-[0.3em] uppercase opacity-60 mb-4 block">Get in Touch</span>
            <h1 className="text-6xl md:text-[84px] font-black tracking-tighter uppercase mb-6 leading-[0.8]">
               Contact Us
            </h1>
            <div className="w-20 h-1 bg-[#131317] mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-500 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
               Tim Customer Care kami berdedikasi untuk memberikan solusi audio terbaik bagi Anda.
            </p>
         </div>
      </section>

      {/* CONTACT CARDS SECTION */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* CARD 1: CUSTOMER SERVICE */}
          <div className="bg-white p-10 md:p-14 shadow-2xl border border-gray-100 flex flex-col group hover:shadow-3xl transition-all duration-500">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-8 group-hover:bg-[#131317] group-hover:text-white transition-colors duration-500">
              <Headphones className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Customer Service</h2>
            <p className="text-gray-500 mb-8 font-medium">Untuk informasi produk dan konsultasi pembelian.</p>
            
            <div className="space-y-6 mt-auto">
              <a href="mailto:cs@bettersound.co.id" className="flex items-center gap-4 group/link">
                <Mail className="w-5 h-5 text-gray-400 group-hover/link:text-black transition-colors" />
                <span className="text-lg font-bold text-[#131317] group-hover/link:underline">cs@bettersound.co.id</span>
              </a>
              <a href="tel:+628118009910" className="flex items-center gap-4 group/link">
                <Phone className="w-5 h-5 text-gray-400 group-hover/link:text-black transition-colors" />
                <span className="text-lg font-bold text-[#131317] group-hover/link:underline">+62 811 800 9910</span>
              </a>
            </div>
          </div>

          {/* CARD 2: SERVICE CENTER */}
          <div className="bg-white p-10 md:p-14 shadow-2xl border border-gray-100 flex flex-col group hover:shadow-3xl transition-all duration-500">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-8 group-hover:bg-[#131317] group-hover:text-white transition-colors duration-500">
              <MapPin className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Service Center</h2>
            <p className="text-gray-500 mb-8 font-medium">Untuk perbaikan produk dan klaim garansi resmi.</p>
            
            <div className="space-y-6 mt-auto">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                <span className="text-base font-medium text-gray-600 leading-relaxed">
                  <strong className="text-[#131317] block text-lg mb-1">Rukan PIK Golf Island Blok E No. 181</strong>
                  Pantai Indah Kapuk, Jakarta Utara
                </span>
              </div>
              <a href="tel:+6281285965985" className="flex items-center gap-4 group/link">
                <Phone className="w-5 h-5 text-gray-400 group-hover/link:text-black transition-colors" />
                <span className="text-lg font-bold text-[#131317] group-hover/link:underline">+62 812 8596 5985</span>
              </a>
              <a href="mailto:servicecenter@bettersound.co.id" className="flex items-center gap-4 group/link">
                <Mail className="w-5 h-5 text-gray-400 group-hover/link:text-black transition-colors" />
                <span className="text-lg font-bold text-[#131317] group-hover/link:underline">servicecenter@bettersound.co.id</span>
              </a>
              <a href="https://service.bettersound.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group/link pt-4 border-t border-gray-100">
                <Globe className="w-5 h-5 text-gray-400 group-hover/link:text-[#0255cc] transition-colors" />
                <span className="text-base font-bold text-[#0255cc] uppercase tracking-widest group-hover/link:underline">Web Service Center</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}