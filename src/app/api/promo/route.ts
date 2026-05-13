import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: '5ngxi1b8', 
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) return NextResponse.json({ error: 'Kode promo kosong' }, { status: 400 });

    const query = `*[_type == "promoCode" && code == $code && isActive == true][0]`;
    const promo = await sanityClient.fetch(query, { code: code.toUpperCase() });

    if (!promo) {
      return NextResponse.json({ error: 'Kode promo tidak valid atau kadaluarsa.' }, { status: 404 });
    }

    if (promo.minPurchase && subtotal < promo.minPurchase) {
      return NextResponse.json({ error: `Minimal belanja Rp ${promo.minPurchase.toLocaleString('id-ID')} untuk pakai promo ini.` }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      type: promo.discountType,
      value: promo.discountValue || 0,
      maxDiscount: promo.maxDiscount || null, // Nangkep limit diskon
      code: promo.code
    });

  } catch (error) {
    return NextResponse.json({ error: 'Gagal memverifikasi promo' }, { status: 500 });
  }
}