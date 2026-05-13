import { createClient } from 'next-sanity';
import ShopLayout from '@/components/ShopLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category || 'all';

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

  let currentCategory = null;
  let parentCategory = null;
  let subLinks: any[] = [];
  let promoAd = null;

  if (categorySlug !== 'all') {
    currentCategory = await sanityClient.fetch(`*[_type == "category" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, description, promoAd { ..., "imageUrl": image.asset->url }
    }`, { slug: categorySlug });

    if (currentCategory) {
      const categoryWithSubs = await sanityClient.fetch(`
        *[_type == "category" && _id == $id][0] {
          subCategories[]->{ title, "slug": slug.current }
        }
      `, { id: currentCategory._id });
      
      if (categoryWithSubs?.subCategories && categoryWithSubs.subCategories.length > 0) {
        parentCategory = currentCategory;
        promoAd = currentCategory.promoAd;
        
        subLinks = categoryWithSubs.subCategories.filter((cat: any) => !cat.title.toLowerCase().startsWith('all '));
        subLinks.unshift({ title: `All ${currentCategory.title}`, slug: currentCategory.slug });
      } else {
        const parent = await sanityClient.fetch(`
          *[_type == "category" && references($id)][0] {
            _id, title, "slug": slug.current, promoAd { ..., "imageUrl": image.asset->url },
            subCategories[]->{ title, "slug": slug.current }
          }
        `, { id: currentCategory._id });

        if (parent) {
          parentCategory = parent;
          promoAd = parent.promoAd;
          
          subLinks = (parent.subCategories || []).filter((cat: any) => !cat.title.toLowerCase().startsWith('all '));
          subLinks.unshift({ title: `All ${parent.title}`, slug: parent.slug });
        }
      }
    }
  }

  let products = [];
  if (categorySlug === 'all') {
    products = await sanityClient.fetch(`*[_type == "product"]{
      _id, name, price, originalPrice, status, "slug": slug.current, "imageUrl": images[0].asset->url, filterFeatures, filterActivity, isNewItem,
      variants[] { colorName, colorHex, "imageUrls": images[].asset->url }
    }`);
  } else if (parentCategory && parentCategory.slug === categorySlug) {
    // PERBAIKAN QUERY GROQ: 
    // Ambil produk milik Bapak (jika ada) ATAU yang mereferensikan ID anak-anak dari si Bapak
    products = await sanityClient.fetch(`
      *[_type == "product" && (references($id) || references(*[_type == "category" && _id == $id][0].subCategories[]._ref))] {
        _id, name, price, originalPrice, status, "slug": slug.current, "imageUrl": images[0].asset->url, filterFeatures, filterActivity, isNewItem,
        variants[] { colorName, colorHex, "imageUrls": images[].asset->url }
      }
    `, { id: parentCategory._id });
  } else if (currentCategory) {
    // Jika berada di spesifik Sub-kategori, ambil produk milik Sub-kategori tsb
    products = await sanityClient.fetch(`
      *[_type == "product" && references($id)] {
        _id, name, price, originalPrice, status, "slug": slug.current, "imageUrl": images[0].asset->url, filterFeatures, filterActivity, isNewItem,
        variants[] { colorName, colorHex, "imageUrls": images[].asset->url }
      }
    `, { id: currentCategory._id });
  }

  return (
    <main className="min-h-screen bg-white">
      <Header navData={navData} />
      <ShopLayout 
        products={products}
        categoryTitle={currentCategory?.title || 'All Products'}
        categorySlug={categorySlug}
        parentCategory={parentCategory}
        subLinks={subLinks}
        promoAd={promoAd}
      />
      <Footer />
    </main>
  );
}