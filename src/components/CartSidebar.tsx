"use client";

import { useCartStore } from '../store/cart';
import { X, Trash2 } from 'lucide-react';

export default function CartSidebar() {
  const { cart, isOpen, toggleCart, removeFromCart } = useCartStore();

  // Hitung total harga
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* Background Gelap (Overlay) saat cart terbuka */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Panel Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Bagian Atas: Judul & Tombol Close */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#191919]">Your Cart ({cart.length})</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} color="#191919" />
          </button>
        </div>

        {/* Bagian Tengah: Daftar Barang */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-[#f3f3f3] rounded flex items-center justify-center p-2 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#191919] leading-tight">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bagian Bawah: Total & Tombol Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-[#191919]">Estimated Total</span>
              <span className="text-xl font-bold text-[#191919]">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            {/* Tombol ini nantinya akan kita arahkan ke sistem Midtrans */}
            <button className="w-full bg-[#191919] text-white py-4 rounded-full font-bold text-lg hover:bg-black transition-all active:scale-[0.98]">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}