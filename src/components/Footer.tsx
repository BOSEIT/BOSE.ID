import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react'; // Sisakan icon umum yang aman dari error

export default function Footer() {
  return (
    <footer className="bg-white text-[#191919] pt-16 pb-8 font-sans border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Navigasi Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-10 border-b border-gray-200">
          
          {/* Kolom 1: Customer Care */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] text-black mb-2">Customer Care</h4>
            {/* LINK REPAIR DIARAHKAN KE WEB EXTERNAL */}
            <a href="https://service.bettersound.id" target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Repair & Replacement</a>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Order Tracking</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Sign In or Join My Bose</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">My Bose Perks</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Register Your Product</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">BoseCare</Link>
            {/* LINK CONTACT US DIPERBAIKI */}
            <Link href="/contact-us" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Contact Us</Link>
          </div>

          {/* Kolom 2: Our company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] text-black mb-2">Our company</h4>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">About Us</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Find a Store</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">ESG</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Careers</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Press Room</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Stories</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Partnerships & Licensing</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline flex items-center justify-between group">
              Bose Worldwide <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
            </Link>
          </div>

          {/* Kolom 3: Offers */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] text-black mb-2">Offers</h4>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Gift Cards</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">ID.me Group Program</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Corporate Gifting</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Partner & Employee Program</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Certified Refurbished</Link>
            <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline">Trade Up</Link>
          </div>

          {/* Kolom 4: Additional Links */}
          <div className="flex flex-col gap-4">
             <h4 className="font-bold text-[13px] text-black mb-2">Additional Links</h4>
             <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline flex items-center justify-between group">
              Automotive <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
             </Link>
             <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline flex items-center justify-between group">
              Reseller Portal <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black" />
             </Link>
          </div>

          {/* Kolom 5: Apps */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4 cursor-pointer group">
               <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-black italic text-xl">B</div>
               <span className="text-[13px] font-medium text-gray-600 group-hover:text-black hover:underline">Bose app</span>
             </div>
             <div className="flex items-center gap-4 cursor-pointer group">
               <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center text-black"><Plus className="w-6 h-6" strokeWidth={1.5} /></div>
               <span className="text-[13px] font-medium text-gray-600 group-hover:text-black hover:underline">Bose Connect<br/>App</span>
             </div>
             <div className="flex items-center gap-4 cursor-pointer group">
               <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-col text-white">
                 <span className="font-black italic leading-none">B</span>
                 <span className="text-[8px] font-black italic">QCE</span>
               </div>
               <span className="text-[13px] font-medium text-gray-600 group-hover:text-black hover:underline">Bose QCE App</span>
             </div>
          </div>
        </div>

        {/* Social Icons (Diganti menggunakan Raw SVG murni yang pasti work) */}
        <div className="py-8 flex gap-8">
           {/* Instagram SVG */}
           <a href="#" className="text-black hover:text-gray-500 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
           </a>
           {/* Twitter/X SVG */}
           <a href="#" className="text-black hover:text-gray-500 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
           </a>
           {/* Facebook SVG */}
           <a href="#" className="text-black hover:text-gray-500 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
           </a>
           {/* Youtube SVG */}
           <a href="#" className="text-black hover:text-gray-500 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.16 1 12 1 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 2C8.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.84 23 12 23 12s0-3.84-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
           </a>
           {/* TikTok SVG */}
           <a href="#" className="text-black hover:text-gray-500 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
           </a>
        </div>

        {/* Bawah: Legal & Copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col xl:flex-row gap-4 text-[12px] text-gray-600 font-medium">
          <p className="whitespace-nowrap">© Bose Corporation 2026</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="#" className="hover:text-black hover:underline">Sitemap</Link>
            <Link href="#" className="hover:text-black hover:underline">Legal</Link>
            <Link href="#" className="hover:text-black hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:text-black hover:underline">Accessibility</Link>
            <Link href="#" className="hover:text-black hover:underline">CA Notice of Collection</Link>
            <Link href="#" className="hover:text-black hover:underline">Your privacy choices</Link>
            <Link href="#" className="hover:text-black hover:underline">Cookies Notice</Link>
            <Link href="#" className="hover:text-black hover:underline">Terms of Sale</Link>
            <Link href="#" className="hover:text-black hover:underline">Terms of Use</Link>
            <Link href="#" className="hover:text-black hover:underline">CA Supply Chains Act</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}