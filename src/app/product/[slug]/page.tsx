import { client } from '../../sanity'; 
import Header from '../../../components/Header';
import AddToCartButton from '../../../components/AddToCartButton';
import { notFound } from 'next/navigation';
// Tambahkan ikon Plus dan Chevron dari lucide-react untuk menu Accordion & Breadcrumb
import { Plus, ChevronRight } from 'lucide-react'; 
import Link from 'next/link';

async function getProduct(slug: string) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0]{
    _id,
    name,
    price,
    "slug": slug.current,
    "category": category->title,
    "imageUrl": images[0].asset->url,
    features,
    details
  }`;
  
  const data = await client.fetch(query);
  return data;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#191919] font-sans">
      <Header />
      
      {/* Container - Mengikuti padding standar Bose */}
      <div className="pt-[110px] md:pt-[130px] max-w-[1440px] mx-auto px-4 md:px-8 pb-24">
        
        {/* 1. Breadcrumbs (Navigasi Atas) */}
        <nav className="flex items-center text-xs font-medium text-gray-500 mb-6 md:mb-10 space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="hover:underline cursor-pointer">{product.category || 'Headphones'}</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#191919]">{product.name}</span>
        </nav>

        {/* Layout Grid 1:1 Bose.com */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* KOLOM KIRI: Gambar Produk */}
          <div className="w-full lg:w-[60%]">
            {/* Background abu-abu terang khas Bose (#f3f3f3) */}
            <div className="bg-[#f3f3f3] aspect-square md:aspect-[4/3] rounded-lg flex items-center justify-center p-8 md:p-16">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
            {/* Ruang untuk thumbnail gambar kecil di bawahnya (bisa ditambahkan nanti kalau gambar di Sanity > 1) */}
            <div className="flex gap-4 mt-4">
               {product.imageUrl && (
                 <div className="w-20 h-20 bg-[#f3f3f3] rounded-md border-2 border-black p-2 flex items-center justify-center">
                    <img src={product.imageUrl} alt="thumb" className="object-contain mix-blend-multiply" />
                 </div>
               )}
            </div>
          </div>

          {/* KOLOM KANAN: Detail, Harga, Cart, Accordion */}
          <div className="w-full lg:w-[40%] flex flex-col">
            
            <h1 className="text-3xl md:text-[40px] font-bold leading-[1.1] tracking-tight mb-3">
              {product.name}
            </h1>
            
            <p className="text-2xl font-semibold mb-8">
              Rp {product.price?.toLocaleString('id-ID')}
            </p>

            {/* Pilihan Warna (Statik/Dummy untuk menyamakan layout) */}
            <div className="mb-8">
              <p className="text-sm font-bold mb-4">Color: <span className="font-normal text-gray-600">Black</span></p>
              <div className="flex gap-4">
                {/* Lingkaran Hitam (Aktif) */}
                <button className="w-9 h-9 rounded-full bg-[#191919] ring-2 ring-offset-2 ring-black"></button>
                {/* Lingkaran Putih (Non-Aktif) */}
                <button className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:border-gray-500"></button>
              </div>
            </div>

            {/* Tombol Add to Cart (Sudah terhubung dengan Zustand dari langkah sebelumnya) */}
            <div className="mb-4">
               <AddToCartButton product={product} />
            </div>
            
            <p className="text-sm text-center text-gray-600 mb-10">
               Free standard shipping and 30-day returns
            </p>

            {/* Sistem Accordion (Menu Expand) khas Bose */}
            <div className="border-t border-gray-300">
              
              {/* Accordion 1: Product Details */}
              <details className="group border-b border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-[15px] cursor-pointer list-none py-6">
                  <span>Product Details</span>
                  <span className="transition duration-300 group-open:rotate-45">
                    <Plus size={20} />
                  </span>
                </summary>
                <div className="text-gray-600 text-sm pb-6 leading-relaxed">
                  {product.features && product.features.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                       {product.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                  ) : (
                    <p>Experience the premium sound that Bose is known for. Advanced noise cancellation and immersive audio built in.</p>
                  )}
                </div>
              </details>

              {/* Accordion 2: In the Box */}
              <details className="group border-b border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-bold text-[15px] cursor-pointer list-none py-6">
                  <span>What's in the Box</span>
                  <span className="transition duration-300 group-open:rotate-45">
                    <Plus size={20} />
                  </span>
                </summary>
                <div className="text-gray-600 text-sm pb-6 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{product.name}</li>
                    <li>Charging Cable</li>
                    <li>Quick Start Guide</li>
                    <li>Safety Sheet</li>
                  </ul>
                </div>
              </details>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}