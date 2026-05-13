import Link from 'next/link';

interface HeroProps {
  data: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
    heroButtonText: string;
    heroButtonLink: string;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  if (!data) return null;

  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] bg-[#131317] overflow-hidden font-sans group">
      
      {/* Background Image */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src={data.heroImageUrl} 
          alt={data.heroTitle} 
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Gradient Overlay (Fokus di Bawah dan KIRI agar teks putih selalu terbaca) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none"></div>

      {/* --- TEXT CONTENT (Mentok KIRI BAWAH) --- */}
      <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end">
        <div className="w-full px-4 md:px-8 lg:px-10 pb-12 md:pb-16 lg:pb-24 flex justify-start">
          
          <div className="max-w-xl text-left flex flex-col items-start">
            {/* Eyebrow (NEW) */}
            {data.heroBadge && (
              <p className="text-white text-[13px] font-bold tracking-[0.15em] uppercase mb-4">
                {data.heroBadge}
              </p>
            )}

            {/* Heading Raksasa */}
            <h1 className="text-white text-5xl md:text-7xl lg:text-[85px] font-black tracking-tighter leading-[0.95] mb-5 uppercase">
              {data.heroTitle}
            </h1>

            {/* Subheading */}
            {data.heroSubtitle && (
              <p className="text-white text-base md:text-lg lg:text-[20px] font-medium mb-10 leading-snug max-w-lg">
                {data.heroSubtitle}
              </p>
            )}

            {/* CTA Button */}
            <div>
              <Link 
                href={data.heroButtonLink || '/shop'} 
                className="inline-flex items-center justify-center bg-white text-[#131317] px-8 py-3.5 md:px-10 md:py-4 font-bold text-sm md:text-[15px] uppercase hover:bg-gray-200 transition-all duration-300 shadow-md"
              >
                {data.heroButtonText || 'LEARN MORE'}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}