import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';
// Catatan: Jika tulisan 'next-sanity' ini error/merah, ubah menjadi '@sanity/client'
import { createClient } from 'next-sanity'; 

export async function POST(request: Request) {
  try {
    // 1. Inisialisasi Midtrans
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
    });

    // 2. Inisialisasi Sanity (Dipindah ke dalam TRY agar tidak crash jika ENV kosong)
    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'SILAKAN_ISI_PROJECT_ID',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });

    const body = await request.json();
    const { cart, subtotal } = body;

    const grossAmount = Math.round(Number(subtotal));
    const orderId = `BOSE-${Date.now()}`;

    // 3. Simpan Data ke Sanity
    await sanityClient.create({
      _type: 'order',
      orderId: orderId,
      amount: grossAmount,
      status: 'pending',
      items: cart.map((item: any) => ({
        _key: item.id, 
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // 4. Minta Token Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: cart.map((item: any) => ({
        id: item.id,
        price: Math.round(Number(item.price)),
        quantity: Number(item.quantity),
        name: item.name.substring(0, 50),
      })),
    };

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({ token });
    
  } catch (error: any) {
    // Ini akan mencetak pesan error ASLI di terminal Ubuntu kamu
    console.error('ALARM BACKEND ERROR:', error.message || error);
    return NextResponse.json({ error: 'Gagal memproses pembayaran' }, { status: 500 });
  }
}