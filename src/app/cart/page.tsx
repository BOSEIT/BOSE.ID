"use client";

import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; // Asumsi kamu manggil Header secara client/bikin pembungkusnya
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ChevronRight, Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const savings = 0; 
  const total = subtotal - savings;

  return (
    <main className="min-h-screen bg-white text-[#191919] font-sans">
      {/* Header Statis untuk Cart (karena Header utama butuh fetch CMS, 
          idealnya kamu lempar prop navData dari layout atau bikin HeaderCart terpisah.
          Disini kita asumsikan Header tetap bisa dipanggil atau diganti versi ringan) */}
      <Header navData={null} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-32">
        
        {/* --- BANNER LOGIN --- */}
        <div className="bg-[#f3f3f3] p-4 flex flex-col sm:flex-row justify-center items-center gap-2 mb-10 text-sm">
          <span className="font-bold">Do you have a My Bose Account?</span>
          <span>Enjoy member benefits and faster checkout</span>
          <button className="font-bold underline underline-offset-4 ml-2">Sign-in</button>
        </div>

        {/* --- PERKS HEADER --- */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-16 text-center text-sm">
          <div className="flex flex-col items-center max-w-[250px]">
            <img src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png" alt="Return" className="w-8 h-8 mb-3 opacity-80" />
            <p className="font-medium text-gray-600">Try it for 90 days to make sure it's right for you. <span className="underline font-bold text-black cursor-pointer">90-day return policy</span></p>
          </div>
          <div className="flex flex-col items-center max-w-[250px]">
            <img src="https://cdn-icons-png.flaticon.com/512/762/762666.png" alt="Price Match" className="w-8 h-8 mb-3 opacity-80" />
            <p className="font-medium text-gray-600">Shop confidently, knowing we'll match a lower price. <span className="underline font-bold text-black cursor-pointer">Price match promise</span></p>
          </div>
        </div>

        <h1 className="text-3xl md:text-[42px] font-black tracking-tighter uppercase mb-10 border-b border-gray-200 pb-4">
          Products ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/" className="inline-block bg-[#131317] text-white px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* =========================================
                KOLOM KIRI: DAFTAR PRODUK
                ========================================= */}
            <div className="flex-1 space-y-10">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-10">
                  
                  {/* Gambar Produk */}
                  <div className="w-full md:w-[220px] h-[220px] bg-[#f8f8f8] flex-shrink-0 p-4 relative group cursor-pointer">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Detail Produk */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold leading-tight max-w-[70%]">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-black transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mb-6 font-medium">Color: Standard</p>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-auto gap-4">
                      
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Harga */}
                      <div className="text-right">
                        {/* Jika ada diskon, tampilkan harga coret disini (Statis dulu sesuai request UI) */}
                        <div className="text-2xl font-black tracking-tighter">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </div>
                      </div>

                    </div>

                    {/* Fitur Add Gift Box */}
                    <div className="mt-8 border border-gray-200 p-4 flex justify-between items-center group cursor-pointer hover:border-black transition">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 border border-gray-300 rounded-sm"></div>
                         <span className="font-bold text-sm group-hover:underline underline-offset-4">Add a Gift Box to your product</span>
                      </div>
                      <span className="font-bold text-sm">Rp 150.000</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* =========================================
                KOLOM KANAN: ORDER SUMMARY
                ========================================= */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-[#f8f8f8] p-8 sticky top-32">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-600">Standard shipping</span>
                    </div>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-400">Rp --</span>
                  </div>
                  <p className="text-[11px] text-gray-500 max-w-[250px]">Applicable taxes will be calculated at checkout</p>
                </div>

                {/* ADD PROMO CODE */}
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <button className="flex items-center justify-between w-full group">
                    <span className="font-bold text-sm group-hover:underline underline-offset-4">Add Promo Code</span>
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-black transition" />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black tracking-tighter">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#131317] text-white py-4 font-bold tracking-widest text-[13px] uppercase hover:bg-black transition-all active:scale-[0.98] shadow-lg mb-8"
                >
                  Checkout
                </button>

                {/* ACCEPTED PAYMENTS ICON */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Accepted Payment Options</p>
                  <div className="flex flex-wrap gap-2 opacity-60">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" className="h-5 object-contain grayscale" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" className="h-5 object-contain grayscale" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-5 object-contain grayscale" alt="Paypal" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" className="h-5 object-contain grayscale" alt="Amex" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}