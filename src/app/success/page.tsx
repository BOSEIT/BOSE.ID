import Header from '../../components/Header';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white text-[#191919] font-sans flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-[120px] pb-20">
        <CheckCircle size={80} className="text-green-600 mb-8" />
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-center">
          Thank you for your order!
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 text-center max-w-lg">
          Your payment has been successfully processed. We've sent a confirmation email with your order details.
        </p>

        <div className="bg-[#f3f3f3] p-8 rounded-lg w-full max-w-md mb-10">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <ul className="text-gray-700 space-y-3 text-[15px]">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              You will receive tracking information once your item ships.
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              Standard shipping usually takes 3-5 business days.
            </li>
          </ul>
        </div>

        <Link 
          href="/" 
          className="bg-[#191919] text-white py-4 px-12 rounded-full font-bold hover:bg-black transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}