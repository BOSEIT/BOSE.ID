"use client";

import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Data fallback untuk Header
  const fallbackNavData = {
    shopCategories: [], exploreCol1: [], exploreCol2: [], supportLinks: [],
    mothersDayLinks: [], shopPromo: null, explorePromo: null, supportPromo: null, mothersDayPromo: null
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User logged in:", result.user);
      router.push('/'); // Redirect ke home setelah sukses
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal login dengan Google. Cek konsol Firebase kamu.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header navData={fallbackNavData} />

      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-[420px] text-[#131317]">
          
          <h1 className="text-[48px] font-black tracking-tighter uppercase leading-[0.9] mb-4">
            {isLogin ? "Sign In" : "Join Us"}
          </h1>
          <p className="text-[15px] font-medium text-gray-500 mb-12">
            {isLogin ? "Welcome back to the world of sound." : "Experience sound like never before with My Bose."}
          </p>

          {/* Tombol Google Premium */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 border-2 border-gray-100 py-4 px-6 hover:border-black transition-all duration-300 font-bold text-[13px] tracking-widest uppercase mb-8"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-10">
            <div className="w-full border-t border-gray-100"></div>
            <span className="absolute bg-white px-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">or</span>
          </div>

          {/* Form Standar (Email/Pass) */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Email Address</label>
              <input type="email" className="w-full border-b-2 border-gray-100 py-3 focus:border-black outline-none transition-colors text-[16px] font-medium" />
            </div>
            <div className="group">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Password</label>
              <input type="password" className="w-full border-b-2 border-gray-100 py-3 focus:border-black outline-none transition-colors text-[16px] font-medium" />
            </div>

            <button className="w-full bg-[#131317] text-white py-4 font-bold text-[13px] tracking-[0.3em] uppercase hover:bg-black transition-all active:scale-[0.98] shadow-xl">
              {isLogin ? "Sign In" : "Join My Bose"}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-gray-100 pt-8">
            <p className="text-[14px] text-gray-500 font-medium">
              {isLogin ? "New to Bose?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-black font-bold underline underline-offset-4 hover:text-gray-500 transition-colors"
              >
                {isLogin ? "Create an Account" : "Sign In Now"}
              </button>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}