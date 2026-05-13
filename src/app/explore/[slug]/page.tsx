import { createClient } from 'next-sanity';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExploreLayout from '@/components/ExploreLayout';
import { notFound } from 'next/navigation';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Ingat: Next.js 15 mewajibkan params berupa Promise yang di-await
export default async function ExplorePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch data Purpose spesifik (UPDATE: Narik semua data Hero Text baru buat Animasi Parallax)
  const purposeData = await sanityClient.fetch(`
    *[_type == "purpose" && slug.current == $slug][0] {
      title,
      
      "heroImageUrl1": heroImage1.asset->url,
      heroText1Top,
      heroText1Bottom,
      
      "heroImageUrl2": heroImage2.asset->url,
      heroText2,
      
      "heroImageUrl3": heroImage3.asset->url,
      heroText3Top,
      heroText3Bottom,
      
      sliderImages[] { link, "imageUrl": image.asset->url },
      
      zoomText1Top, zoomText1Bottom,
      "expandImage1Url": expandImage1.asset->url, expandImage1Link,
      
      zoomText2Top, zoomText2Bottom,
      "expandVideoUrl": expandVideo.asset->url,
      
      "expandImage2Url": expandImage2.asset->url, expandImage2Link,
      
      productSectionTitle
    }
  `, { slug });

  // Jika slug ngaco, langsung lempar ke 404
  if (!purposeData) return notFound();

  // 2. Fetch produk yang di dalam array 'purposes'-nya ada referensi ke ID purpose ini
  const products = await sanityClient.fetch(`
    *[_type == "product" && references(*[_type == "purpose" && slug.current == $slug][0]._id)] {
      _id, name, price, originalPrice, status, "slug": slug.current, 
      "imageUrl": images[0].asset->url, filterFeatures, filterActivity, isNewItem,
      variants[] { colorName, colorHex, "imageUrls": images[].asset->url }
    }
  `, { slug });

  // 3. Fetch Navigation untuk Header
  const navData = await sanityClient.fetch(`*[_type == "navigation"][0] {
    ...,
    shopCategories[] { ..., "imageUrl": categoryImage.asset->url }
  }`);

  return (
    <main className="min-h-screen bg-white">
      <Header navData={navData} />

      {/* --- KOMPONEN ANIMASI PARALLAX SCROLL --- */}
      {/* Semua UI yang ruwet dipindah ke ExploreLayout biar rapi dan clean */}
      <ExploreLayout data={purposeData} products={products} />

      <Footer />
    </main>
  );
}