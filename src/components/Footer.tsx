import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#191919] text-white pt-16 pb-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        
        {/* Atas: Newsletter Signup */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-16 border-b border-gray-800">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-2">Sound is Power.</h3>
            <p className="text-gray-400 text-sm">Subscribe to receive the latest news, product releases, and exclusive offers from Bose.</p>
          </div>
          <div className="w-full md:w-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-b border-white py-2 w-full md:w-[300px] outline-none focus:border-gray-400 transition text-sm"
            />
            <button className="font-bold border-b-2 border-white pb-1 hover:text-gray-400 hover:border-gray-400 transition text-sm">
              Sign Up
            </button>
          </div>
        </div>

        {/* Tengah: Navigasi Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] uppercase tracking-widest mb-2">Shop</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Headphones</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Speakers</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Audio Sunglasses</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] uppercase tracking-widest mb-2">Explore</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Stories</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Innovations</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Sustainability</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[13px] uppercase tracking-widest mb-2">Support</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Order Status</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white">Product Help</Link>
          </div>
          <div className="flex flex-col gap-4 text-gray-400">
             <h4 className="font-bold text-[13px] text-white uppercase tracking-widest mb-2">Follow Us</h4>
             <div className="flex gap-5 mt-2 items-center">
                {/* Facebook SVG */}
                <a href="#" className="hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                {/* Twitter (X) SVG */}
                <a href="#" className="hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                {/* Instagram SVG */}
                <a href="#" className="hover:text-white"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
             </div>
          </div>
        </div>

        {/* Bawah: Legal & Copyright */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between gap-6 text-[11px] text-gray-500 font-medium">
          <div className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-wider">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Sale</Link>
            <Link href="#" className="hover:text-white">Terms of Use</Link>
            <Link href="#" className="hover:text-white">Cookie Notice</Link>
          </div>
          <p>© Bose Corporation 2026</p>
        </div>
      </div>
    </footer>
  );
}