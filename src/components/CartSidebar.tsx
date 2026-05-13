"use client";

import { useCartStore } from '../store/cart';
import { X, Trash2, Plus, Minus, Lock, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter();

  // Filter aman untuk mencegah error jika ada produk tidak valid
  const validCart = cart.filter(item => item && item.price !== undefined);
  
  // Hitung total harga
  const totalPrice = validCart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toggleCart(); // Tutup pop-up
    router.push('/checkout'); // Lanjut ke halaman checkout
  };

  return (
    <>
      {/* Background Gelap (Overlay) Blur yang lebih halus */}
      <div 
        className={`fixed inset-0 bg-[#131317]/20 backdrop-blur-[4px] z-[80] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCart}
      />

      {/* FLOATING CART PANEL (Tidak mentok ujung layar, melayang elegan) */}
      <div 
        className={`fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] md:w-full md:max-w-[420px] z-[90] pointer-events-none flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[110%] opacity-0 scale-95'}`}
      >
        <div className="bg-white w-full h-full rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-col pointer-events-auto overflow-hidden border border-gray-100/50">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10">
            <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 text-[#131317]">
              Your Cart <span className="text-gray-300 font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-full">{validCart.length}</span>
            </h2>
            <button 
              onClick={toggleCart} 
              className="p-2 -mr-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-300 active:scale-90"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Area Produk */}
          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar bg-[#fcfcfc]">
            {validCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-300">
                  <ShoppingBag size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-[13px] text-[#131317] mb-2">Cart is empty</p>
                  <p className="text-[12px] text-gray-400 font-medium max-w-[200px] mx-auto">Looks like you haven't added anything yet.</p>
                </div>
                <button 
                  onClick={toggleCart}
                  className="mt-4 bg-white border border-gray-200 text-[#131317] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-black hover:shadow-md transition-all active:scale-95"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {validCart.map((item) => (
                  <div key={item.id} className="flex gap-5 group">
                    
                    {/* Gambar Produk */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-3 shrink-0 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    {/* Detail & Kontrol */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-[13px] font-bold text-[#131317] leading-snug line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors bg-white hover:bg-red-50 rounded-full p-1.5 -mr-1.5 -mt-1.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        
                        {/* Harga */}
                        <p className="font-black text-[14px] tracking-tight text-[#131317]">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>

                        {/* Kontrol Kuantitas */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-l-full"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          <span className="w-5 text-center font-black text-[11px]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-r-full"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Tombol Checkout */}
          {validCart.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-50 z-10 pb-10">
              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-400 uppercase tracking-widest text-[11px]">Subtotal</span>
                <span className="text-2xl font-black tracking-tighter text-[#131317]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-[#131317] text-white py-4 rounded-[16px] font-black tracking-[0.2em] text-[12px] uppercase hover:bg-black hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Lock size={14} /> Checkout
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">
                Shipping calculated at next step
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}