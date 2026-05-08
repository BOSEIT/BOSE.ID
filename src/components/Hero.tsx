import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] bg-[#f3f3f3] overflow-hidden">
      {/* Background Image (Gunakan aset Bose yang kamu punya atau placeholder premium) */}
      <div className="absolute inset-0 flex items-center justify-center">
         <img 
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop" 
            alt="Bose Headphones" 
            className="w-full h-full object-cover opacity-90"
         />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/10">
        <h2 className="text-white text-[12px] font-bold uppercase tracking-[0.3em] mb-4">New Release</h2>
        <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
          QUIETCOMFORT <br/> ULTRA HEADPHONES
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="bg-white text-black py-4 px-10 rounded-full font-bold text-sm hover:bg-gray-200 transition">
            Shop Now
          </Link>
          <Link href="#" className="bg-transparent border border-white text-white py-4 px-10 rounded-full font-bold text-sm hover:bg-white/10 transition">
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}