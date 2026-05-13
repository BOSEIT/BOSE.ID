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
    const body = await request.json();
    const { destination, weight, courier } = body;

    const apiKey = process.env.RAJAONGKIR_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key tidak ditemukan' }, { status: 500 });
    }

    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{shippingConfig}`);
    const originId = settings?.shippingConfig?.originId || '152'; 

    // Nembak Ongkir ke URL KOMERCE V2
    const response = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
      method: 'POST',
      headers: {
        'Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        origin: originId.toString(),
        destination: destination.toString(),
        weight: weight.toString(),
        courier: courier // jne, sicepat, dll
      }),
    });

    if (!response.ok) {
       const errText = await response.text();
       return NextResponse.json({ error: `Komerce Cost Error: ${response.status}`, detail: errText }, { status: response.status });
    }

    const data = await response.json();
    
    // Nangkep hasil ongkirnya. (Komerce biasanya pakai data.data[0].costs)
    const resultCosts = data.data?.[0]?.costs || data.data; 
    
    return NextResponse.json(resultCosts);
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data ongkos kirim', detail: error.message }, { status: 500 });
  }
}