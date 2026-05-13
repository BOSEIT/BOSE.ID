import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Ambil kata kunci pencarian dari URL (contoh: ?search=bandung)
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Kalau ketikannya kurang dari 3 huruf, balikin kosong biar server gak berat
    if (search.length < 3) {
      return NextResponse.json([]);
    }

    const apiKey = process.env.RAJAONGKIR_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key tidak ditemukan' }, { status: 500 });
    }

    // 2. Tembak ke Komerce dengan kata kunci
    const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: { 'Key': apiKey },
      cache: 'no-store'
    });

    if (!response.ok) {
       return NextResponse.json({ error: `Komerce API Error` }, { status: response.status });
    }

    const data = await response.json();

    // 3. Ubah format Komerce jadi format yang dimengerti web kamu
    if (data && data.data) {
      const formattedCities = data.data.map((item: any) => {
        // Komerce V2 punya berbagai macam format, kita sapu bersih semuanya!
        const id = item.value || item.id || item.subdistrict_id || item.city_id;
        const name = item.label || item.name || (item.subdistrict_name ? `${item.subdistrict_name}, ${item.city_name}` : 'Wilayah Tidak Diketahui');
        return {
          city_id: id?.toString(),
          city_name: name
        };
      });
      return NextResponse.json(formattedCities);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Sistem Gagal Fetch API Komerce' }, { status: 500 });
  }
}