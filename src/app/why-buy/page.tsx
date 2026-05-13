import { createClient } from 'next-sanity';
import { ChevronDown, ShieldCheck, Truck, RefreshCw, BadgePercent } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Konfigurasi Sanity (Berjalan di sisi Server, jadi kebal dari error CORS)
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export default async function WhyBuyPage() {
  // Ambil Data CMS langsung dari Server
  const policyData = await sanityClient.fetch(`*[_type == "policyPage"][0]`);
  const navData = await sanityClient.fetch(`*[_type == "navigation"][0] {
    ...,
    shopCategories[] { ..., "imageUrl": categoryImage.asset->url }
  }`);

  // Ikon-ikon representatif untuk section Benefit (dijamin aman)
  const icons = [<ShieldCheck key="1" />, <RefreshCw key="2" />, <Truck key="3" />, <BadgePercent key="4" />];

  return (
    <main className="min-h-screen bg-white">
      <Header navData={navData} />
      
      {/* --- HERO SECTION --- */}
      <section className="bg-[#131317] text-white py-24 md:py-32 px-4 text-center overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-50" />
         <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
               {policyData?.pageTitle || 'Why Buy Direct from PAI'}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
               The best products, the best service, and the best experience. Discover the benefits of shopping directly with PAI Indonesia.
            </p>
         </div>
      </section>

      {/* --- VISUAL BENEFITS GRID --- */}
      {policyData?.policies && policyData.policies.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {policyData.policies.slice(0, 4).map((policy: any, idx: number) => (
                <div key={idx} className="bg-white p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-[#0255cc] transition-colors duration-500">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-black group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                      {icons[idx] || <ShieldCheck />}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-white transition-colors">{policy.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-white/80 transition-colors line-clamp-3">
                      {policy.content}
                    </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* --- DETAILED ACCORDION (LEGAL/DETAILS) --- */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-12 text-center">Detailed Information</h2>

        <div className="border-t border-black">
          {policyData?.policies?.map((policy: any, idx: number) => (
            /* Menggunakan HTML native <details> untuk efek buka tutup tanpa "use client" */
            <details key={idx} className="group border-b border-gray-200">
              
              <summary className="w-full py-6 flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#0255cc] transition-colors pr-8 uppercase tracking-tight">
                  {policy.title}
                </h3>
                {/* Ikon panah yang otomatis muter kalau diklik */}
                <div className="group-open:rotate-180 transition-transform duration-300 shrink-0 text-gray-400 group-hover:text-black">
                  <ChevronDown className="w-6 h-6" />
                </div>
              </summary>
              
              <div className="pb-8 animate-in fade-in duration-300">
                <div className="bg-[#f8f8f8] p-6 md:p-8 border-l-4 border-[#0255cc]">
                  <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap text-[15px] md:text-base">
                    {policy.content}
                  </p>
                </div>
              </div>
              
            </details>
          ))}
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <section className="bg-gray-50 py-20 px-4 text-center border-t border-gray-100">
         <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">Ready to experience the sound?</h2>
         <Link href="/shop" className="inline-block bg-black text-white px-12 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 transition-all">
            Shop All Products
         </Link>
      </section>

      <Footer />
    </main>
  );
}