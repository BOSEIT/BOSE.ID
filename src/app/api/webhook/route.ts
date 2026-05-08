import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity'; // Atau '@sanity/client' jika error

// Konfigurasi Sanity untuk mengedit data
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    // 1. Terima "telepon" (data) dari Midtrans
    const body = await request.json();
    const { order_id, transaction_status } = body;

    // 2. Cari dokumen pesanan di Sanity berdasarkan order_id
    const order = await sanityClient.fetch(
      '*[_type == "order" && orderId == $orderId][0]',
      { orderId: order_id }
    );

    if (order) {
      let newStatus = 'pending';
      
      // 3. Cek status pembayarannya apa?
      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        newStatus = 'success'; // Uang sudah masuk!
      } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
        newStatus = 'failed'; // Batal/Gagal/Kadaluarsa
      }

      // 4. Update status dokumen di Sanity secara otomatis!
      await sanityClient.patch(order._id).set({ status: newStatus }).commit();
      console.log(`[Webhook] Order ${order_id} otomatis di-update jadi: ${newStatus}`);
    }

    // Beri tahu Midtrans: "Oke, laporan sudah diterima"
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}