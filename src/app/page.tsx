import Link from 'next/link';
import { client } from './sanity'; // Memanggil file sanity.ts yang ada di folder app
import Header from '../components/Header'; // Memanggil Header dari folder components
import Hero from '../components/Hero'; // Import Hero

// Fungsi untuk menarik data SEMUA produk dari Sanity
async function getProducts() {
  const query = `*[_type == "product"]{
    _id,
    name,
    price,
    "slug": slug.current,
    "category": category->title,
    "imageUrl": images[0].asset->url
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Jarak dari atas agar tidak tertimpa Header */}
      <div className="pt-[140px] md:pt-[160px] max-w-[1440px] mx-auto px-4 md:px-8 pb-20">
        
        {/* Judul Section (Gaya Font Tebal Khas Bose) */}
        <h2 className="text-3xl md:text-5xl font-black text-[#131317] tracking-tighter mb-10">
          New Arrivals
        </h2>
        
        {/* Grid Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link 
              href={`/product/${product.slug}`} 
              key={product._id} 
              className="group cursor-pointer block"
            >
              
              {/* Kotak Gambar dengan Efek Hover Premium */}
              <div className="relative aspect-square w-full bg-[#f6f6f6] mb-5 flex items-center justify-center overflow-hidden rounded-md">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                  />
                ) : (
                  <span className="text-gray-400 font-medium">No Image</span>
                )}
              </div>

              {/* Informasi Produk di Bawah Gambar */}
              <div className="flex flex-col gap-1.5 px-1">
                {product.category && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    {product.category}
                  </span>
                )}
                
                <h3 className="text-lg font-bold text-[#131317] leading-tight">
                  {product.name}
                </h3>
                
                <p className="text-[15px] font-medium text-gray-800 mt-1">
                  Rp {product.price?.toLocaleString('id-ID')}
                </p>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}