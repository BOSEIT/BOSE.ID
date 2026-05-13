import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Di frontend yang baru, kita ngirim cart, shippingCost (ongkir), dan discount (potongan promo)
    const { cart, shippingCost, discount } = body; 

    // 1. Ambil Server Key dari .env.local
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json({ error: 'MIDTRANS_SERVER_KEY tidak ditemukan di .env.local' }, { status: 500 });
    }

    // 2. Bikin ID Order unik pakai timestamp
    const orderId = `PAI-ORDER-${new Date().getTime()}`;

    // 3. Susun daftar barang utama (item_details)
    const itemDetails = cart.map((item: any) => ({
      id: item.id,
      price: Math.round(item.price), // Midtrans benci angka desimal
      quantity: item.quantity,
      name: item.name.substring(0, 50) // Nama barang maksimal 50 karakter
    }));

    // Hitung total murni harga barang saja
    const itemsTotal = itemDetails.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    // 4. Masukkan Ongkos Kirim sebagai "Barang Tambahan" di tagihan
    if (shippingCost && shippingCost > 0) {
      itemDetails.push({
        id: 'SHIPPING-FEE',
        price: Math.round(shippingCost),
        quantity: 1,
        name: 'Ongkos Kirim'
      });
    }

    // Sabuk pengaman: Pastikan diskon nggak bikin total harga jadi minus
    const maxAllowedDiscount = itemsTotal + (shippingCost || 0);
    const finalDiscount = discount && discount > maxAllowedDiscount ? maxAllowedDiscount : (discount || 0);

    // 5. Masukkan Diskon Promo sebagai "Barang MINUS"
    if (finalDiscount > 0) {
      itemDetails.push({
        id: 'PROMO-DISCOUNT',
        price: -Math.round(finalDiscount),
        quantity: 1,
        name: 'Promo Discount'
      });
    }

    // Hitung Total Keseluruhan (Gross Amount) = Barang + Ongkir - Diskon yang udah disesuaikan
    const grossAmount = Math.round(itemsTotal + (shippingCost || 0) - finalDiscount);

    // 6. Ubah Server Key jadi Base64 untuk otentikasi
    const authString = Buffer.from(serverKey + ':').toString('base64');

    // 7. Tembak langsung ke API Midtrans (Mode Sandbox)
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount // Midtrans bakal ngecek angka ini harus klop sama item_details
        },
        item_details: itemDetails
      })
    });

    const data = await response.json();

    // Kalau Midtrans nolak (Error 400), tangkap error aslinya!
    if (!response.ok) {
       console.error("Midtrans API Reject:", data);
       return NextResponse.json({ 
         error: 'Midtrans menolak transaksi', 
         detail: JSON.stringify(data.error_messages) 
       }, { status: response.status });
    }

    // Berhasil! Kembalikan Tokennya DAN Order ID ke Frontend
    return NextResponse.json({ token: data.token, orderId: orderId });

  } catch (error: any) {
    console.error("Backend Checkout Error:", error);
    return NextResponse.json({ error: 'Gagal memproses pembayaran di server', detail: error.message }, { status: 500 });
  }
}