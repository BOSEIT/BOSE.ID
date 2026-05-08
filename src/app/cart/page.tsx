"use client";

import Header from '../../components/Header';
import { useCartStore } from '../../store/cart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Hitung Subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Load Script Midtrans
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src="${snapScript}"]`);
      if (existingScript) document.body.removeChild(existingScript);
    }
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, subtotal }),
      });
      
      // TAMBAHAN BARU: Cek apakah server membalas dengan status 200 OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Pesan dari server:", errorText);
        alert('Gagal menyambung ke server. Cek terminal Ubuntu!');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.token) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function(result: any){ 
            clearCart();
            router.push('/success');
          },
          onPending: function(result: any){ console.log('Pending'); },
          onError: function(result: any){ alert('Pembayaran gagal!'); },
          onClose: function(){ console.log('Popup ditutup'); }
        });
      }
    } catch (error) {
      console.error(error);
      alert('Gagal terhubung ke sistem pembayaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#191919] font-sans antialiased">
      <Header />
      
      <div className="pt-[140px] md:pt-[180px] max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
        {/* Judul Cart - Font dipertajam */}
        <h1 className="text-[36px] md:text-[52px] font-[900] tracking-tighter mb-12">Cart</h1>

        {cart.length === 0 ? (
          <div className="py-20 border-t border-gray-200">
            <h2 className="text-[24px] font-bold mb-8 text-[#191919]">Your cart is currently empty.</h2>
            <Link href="/" className="inline-block bg-[#191919] text-white py-4 px-12 rounded-full font-bold hover:bg-black transition-all text-[15px] uppercase tracking-wider">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* DAFTAR BARANG */}
            <div className="w-full lg:w-[65%] flex flex-col gap-10">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-8 border-b border-gray-200 pb-10">
                  <div className="w-full sm:w-[200px] aspect-square bg-[#f3f3f3] flex items-center justify-center p-6 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[24px] font-black leading-tight tracking-tight pr-4">{item.name}</h3>
                        <p className="text-[20px] font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-6 uppercase tracking-widest">Color: Black</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-2 rounded group hover:border-black transition">
                        <span className="text-[14px] font-bold">Qty: {item.quantity}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[14px] font-bold underline underline-offset-4 hover:text-gray-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="w-full lg:w-[35%]">
              <div className="sticky top-[140px]">
                <h2 className="text-[28px] font-black mb-8 tracking-tight">Order Summary</h2>
                <div className="space-y-5 mb-8 text-[16px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-bold text-lg">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Estimated Shipping</span>
                    <span className="font-black text-green-700 uppercase text-[11px] tracking-[0.2em]">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-bold">Rp 0</span>
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-6 mb-10 flex justify-between items-end">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-[32px] font-[900] leading-none tracking-tighter">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-[#191919] text-white py-5 rounded-full font-bold text-[16px] tracking-wide hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}