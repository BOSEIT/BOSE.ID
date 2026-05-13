import { createClient } from 'next-sanity';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductDetail from '../../../components/ProductDetail';
import { notFound } from 'next/navigation';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Await params untuk Next.js 15+ (Ini yang bikin error hilang!)
  const resolvedParams = await params;
  
  // 2. Query Data Produk
  const productData = await sanityClient.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      ...,
      // PERBAIKAN: Ambil judul dari kategori PERTAMA di dalam array categories
      "category": categories[0]->title,
      variants[] {
        ...,
        "imageUrls": images[].asset->url
      },
      miniFeatures[] {
        ...,
        "iconUrl": icon.asset->url
      },
      "videoUrl": overviewVideo.asset->url,
      features[] {
        ...,
        "imageUrls": images[].asset->url
      },
      "boxImageUrl": boxImage.asset->url,
      relatedAccessories[]-> {
        _id,
        name,
        price,
        originalPrice,
        status,
        "slug": slug.current,
        variants[] {
          colorName,
          colorHex,
          "imageUrls": images[].asset->url
        }
      }
    }
  `, { slug: resolvedParams.slug });

  // 3. Ambil data Header Mega Menu biar navigasi tetap jalan
  const navData = await sanityClient.fetch(`
    *[_type == "navigation"][0] {
      ...,
      "shopPromo": { ..., "imageUrl": shopPromo.image.asset->url },
      "explorePromo": { ..., "imageUrl": explorePromo.image.asset->url },
      "supportPromo": { ..., "imageUrl": supportPromo.image.asset->url },
      "mothersDayPromo": { ..., "imageUrl": mothersDayPromo.image.asset->url },
      shopCategories[] { ..., "imageUrl": categoryImage.asset->url }
    }
  `);

  if (!productData) return notFound();

  return (
    <main className="min-h-screen bg-white text-[#191919] font-sans">
      <Header navData={navData} />
      <ProductDetail product={productData} />
      <Footer />
    </main>
  );
}