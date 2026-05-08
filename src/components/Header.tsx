"use client"; // Wajib ditambahkan karena kita butuh interaksi dan baca state Zustand di sisi browser

import Link from 'next/link';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '../store/cart'; // Mengambil fungsi dan data keranjang dari gudang

export default function Header() {
  // Hanya panggil cart saja, toggleCart sudah dihapus karena tidak pakai sidebar
  const { cart } = useCartStore(); 

  return (
    <header className="w-full font-sans tracking-wide z-50 fixed top-0 bg-white">
      {/* 1. Alert Banner (Promo Top Bar) */}
      <div className="bg-[#131317] text-white text-xs md:text-sm text-center py-3 px-4 flex justify-center items-center">
        <p>
          MOTHER’S DAY SALE: Save up to 45% on gifts that help Mom find her rhythm.{' '}
          <Link href="/sale" className="underline font-semibold ml-1 hover:text-gray-300">
            Shop
          </Link>
        </p>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-8 h-[72px] border-b border-gray-200">
        
        {/* Kiri: Hamburger (Mobile) & Links (Desktop) */}
        <div className="flex items-center gap-6">
          <button className="md:hidden p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex gap-8 text-[15px] font-medium text-[#131317]">
            <Link href="/shop" className="hover:underline underline-offset-8">Shop</Link>
            <Link href="/explore" className="hover:underline underline-offset-8">Explore</Link>
            <Link href="/support" className="hover:underline underline-offset-8">Support</Link>
          </div>
        </div>

        {/* Tengah: Logo Bose */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter">BOSE</h1>
          </Link>
        </div>

        {/* Kanan: Search, Profile, Cart */}
        <div className="flex items-center gap-4 md:gap-6 text-[#131317]">
          <button className="p-1"><Search className="w-5 h-5 md:w-6 md:h-6" /></button>
          <button className="p-1 hidden md:block"><User className="w-6 h-6" /></button>
          
          {/* Tombol Cart sekarang menggunakan Link untuk langsung menuju halaman /cart */}
          <Link href="/cart" className="p-1 relative block">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            
            {/* Indikator angka merah hanya muncul kalau ada barang di keranjang */}
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}