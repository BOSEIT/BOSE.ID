"use client";

import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, MapPin, Plus, Edit2, X, Lock, ShieldCheck, HelpCircle, Truck, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  // --- STATE LIVE SEARCH KOTA ---
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '', firstName: '', lastName: '', phone: '', street: '', city: '', cityId: '', zip: '', country: 'Indonesia'
  });

  const [guestForm, setGuestForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '', city: '', cityId: '', zip: ''
  });
  const [isGuestFormValid, setIsGuestFormValid] = useState(false);
  
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState<number>(0);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // --- STATE PROMO CODE ---
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [loadingPromo, setLoadingPromo] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // --- LOGIKA MENGHITUNG DISKON PROMO ---
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      const calc = subtotal * (appliedPromo.value / 100);
      discountAmount = appliedPromo.maxDiscount ? Math.min(calc, appliedPromo.maxDiscount) : calc;
    } 
    else if (appliedPromo.type === 'fixed') {
      discountAmount = appliedPromo.value;
    } 
    else if (appliedPromo.type === 'freeShipping') {
      discountAmount = appliedPromo.maxDiscount ? Math.min(selectedShippingCost, appliedPromo.maxDiscount) : selectedShippingCost;
    }
  }

  const taxDisplay = Math.round(subtotal - (subtotal / 1.11)); 
  // Total akhir sekarang dikurangi diskon promo
  const total = subtotal + selectedShippingCost - discountAmount;

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    let script = document.createElement('script');
    script.src = midtransScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  const fetchUserAddresses = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, "users", uid, "addresses"));
    const userAddresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAddresses(userAddresses);
    return userAddresses;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const addrs = await fetchUserAddresses(currentUser.uid);
        if (addrs.length > 0) handleSelectAddress(addrs[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCitySearch = async (keyword: string) => {
    if (keyword.length < 3) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/cities?search=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCitySuggestions(data);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
      }
    } catch (err) {
      console.error("Gagal cari kota", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    if (!addressForm.cityId) {
      alert("Tolong ketik dan pilih kota dari kotak saran (suggestion box).");
      return;
    }

    const addrCol = collection(db, "users", user.uid, "addresses");
    if (editingAddressId) {
      await updateDoc(doc(db, "users", user.uid, "addresses", editingAddressId), addressForm);
    } else {
      await addDoc(addrCol, addressForm);
    }
    
    setShowAddressForm(false);
    setEditingAddressId(null);
    const updated = await fetchUserAddresses(user.uid);
    const newlySaved = updated.find((a: any) => a.name === addressForm.name) || updated[0];
    if (newlySaved) handleSelectAddress(newlySaved);
  };

  const openEditForm = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm(addr);
    setShowAddressForm(true);
  };

  const openAddForm = () => {
    setEditingAddressId(null);
    setAddressForm({ name: '', firstName: '', lastName: '', phone: '', street: '', city: '', cityId: '', zip: '', country: 'Indonesia' });
    setShowAddressForm(true);
  };

  const handleSelectAddress = async (addr: any) => {
    setSelectedAddress(addr);
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShippingCost(0);

    try {
      const totalWeight = cart.reduce((sum, item) => sum + (1000 * item.quantity), 0);
      const destId = addr.cityId; 

      if (!destId) {
        alert("Alamat ini tidak memiliki ID Kota yang valid. Silakan edit alamat.");
        setLoadingShipping(false);
        return;
      }

      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: destId, weight: totalWeight, courier: 'jne' }) 
      });

      const data = await response.json();
      if (data && data.length > 0) {
        const optionsList = data[0].costs || data;
        setShippingOptions(optionsList); 
        
        if (optionsList.length > 0) {
          const firstOption = optionsList[0];
          let defaultCost = 0;
          if (typeof firstOption.cost === 'number') defaultCost = firstOption.cost;
          else if (typeof firstOption.value === 'number') defaultCost = firstOption.value;
          else if (Array.isArray(firstOption.cost)) defaultCost = firstOption.cost[0]?.value || 0;
          
          setSelectedShippingCost(defaultCost);
        }
      }
    } catch (error) {
      console.error("Gagal ambil ongkir:", error);
    } finally {
      setLoadingShipping(false);
    }
  };

  // --- FUNGSI APPLY & REMOVE PROMO ---
  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setLoadingPromo(true);
    setPromoError('');
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput, subtotal })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedPromo(data);
        setPromoInput(''); // Clear input after success
      } else {
        setPromoError(data.error);
        setAppliedPromo(null);
      }
    } catch (err) {
      setPromoError('Gagal memverifikasi promo.');
    } finally {
      setLoadingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handlePay = async () => {
    if (!selectedAddress) {
      alert("Please select or enter a shipping address first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shippingCost: selectedShippingCost, discount: discountAmount }) 
      });
      const data = await response.json();

      if (data.token && data.orderId) {
        // --- 1. SIMPAN KE FIREBASE SEBAGAI 'PENDING' SEBELUM POPUP MUNCUL ---
        try {
          // Cari tau ini user login atau guest
          const customerEmail = user ? user.email : guestForm.email;
          const customerName = user ? addressForm.firstName : guestForm.firstName;
          
          await addDoc(collection(db, "orders"), {
            orderId: data.orderId,
            customerEmail: customerEmail,
            customerName: customerName,
            address: selectedAddress,
            items: cart,
            shippingCost: selectedShippingCost,
            discount: discountAmount,
            totalAmount: total,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          });
        } catch (fbError) {
          console.error("Gagal simpan order ke Firebase:", fbError);
        }

        // --- 2. TAMPILKAN POPUP MIDTRANS ---
        (window as any).snap.pay(data.token, {
          onSuccess: function() { clearCart(); router.push('/my-order'); }, // Otomatis lempar ke halaman My Order kalau sukses!
          onPending: function() { alert("Waiting for payment..."); },
          onError: function() { alert("Payment Failed!"); },
          onClose: function() { alert("You closed the popup without finishing the payment"); }
        });
      } else {
        alert(`Gagal memanggil Midtrans!\n\nAlasan: ${data.error || 'Token tidak ditemukan.'}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat menghubungi backend. Cek Console.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#191919] font-sans flex flex-col">
        <Header navData={null} />
        <div className="flex-grow flex flex-col items-center justify-center py-32 px-4">
          <h2 className="text-3xl md:text-[40px] font-black tracking-tighter uppercase mb-6">Your Cart is Empty</h2>
          <Link href="/shop" className="bg-[#131317] text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-black transition-all shadow-xl active:scale-95">Explore Products</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#131317] font-sans">
      <Header navData={null} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-12 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-green-700 font-bold uppercase tracking-widest text-[11px] mb-3"><Lock size={14} /> Secure Checkout</div>
            <h1 className="text-4xl md:text-[56px] font-black tracking-tighter uppercase leading-none">Checkout</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-16">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-4"><span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-[13px]">1</span> Shipping Address</h2>
              
              {!user ? (
                <div className="bg-white border border-gray-200 p-8 md:p-10 shadow-sm">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <h3 className="font-bold uppercase tracking-widest text-[13px]">Guest Information</h3>
                    <Link href="/login" className="text-[11px] font-bold text-gray-500 hover:text-black underline underline-offset-4 flex items-center gap-1">Already have an account? Sign In</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">First Name *</label>
                      <input className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" value={guestForm.firstName || ''} onChange={(e) => setGuestForm({...guestForm, firstName: e.target.value})} />
                    </div>
                    <div className="flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Last Name</label>
                      <input className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" value={guestForm.lastName || ''} onChange={(e) => setGuestForm({...guestForm, lastName: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Email Address *</label>
                      <input type="email" className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" value={guestForm.email || ''} onChange={(e) => setGuestForm({...guestForm, email: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Street Address *</label>
                      <input className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" value={guestForm.street || ''} onChange={(e) => setGuestForm({...guestForm, street: e.target.value})} />
                    </div>
                    
                    {/* CUSTOM DROPDOWN KOTA UNTUK GUEST */}
                    <div className="md:col-span-2 flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black flex justify-between">
                        City / District * {isSearching && <span className="text-gray-400 animate-pulse normal-case font-medium">Searching...</span>}
                      </label>
                      <div className="relative">
                        <input 
                          placeholder="Type min 3 letters (e.g. Jakar...)"
                          className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium pr-8"
                          value={guestForm.city || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGuestForm({...guestForm, city: val, cityId: ''});
                            handleCitySearch(val);
                          }}
                          onFocus={() => { if(citySuggestions.length > 0) setShowSuggestions(true); }}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                        />
                        <Search className="absolute right-0 top-3 text-gray-400" size={16} />
                        
                        {showSuggestions && citySuggestions.length > 0 && (
                          <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-52 overflow-y-auto z-50 rounded-b-md">
                            {citySuggestions.map((city: any) => (
                              <li 
                                key={city.city_id} 
                                className="p-3 text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                onMouseDown={() => {
                                  setGuestForm({...guestForm, city: city.city_name, cityId: city.city_id});
                                  setShowSuggestions(false);
                                }}
                              >
                                {city.city_name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col relative group">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Phone Number *</label>
                      <input className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" value={guestForm.phone || ''} onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})} />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (guestForm.firstName && guestForm.email && guestForm.street && guestForm.cityId && guestForm.phone) {
                         handleSelectAddress({ ...guestForm, id: 'guest-address' });
                         setIsGuestFormValid(true);
                      } else {
                         alert('Please fill in all fields and make sure to SELECT a city from the dropdown suggestion.');
                      }
                    }} 
                    className="mt-12 bg-black text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-gray-900 transition-colors w-full md:w-auto shadow-md"
                  >
                    Confirm Address
                  </button>

                  {isGuestFormValid && (
                    <div className="mt-6 text-green-700 bg-green-50 border border-green-200 px-4 py-3 text-[12px] font-bold flex items-center gap-3">
                      <CheckCircle2 size={18} /> Address confirmed. Please select your shipping method below.
                    </div>
                  )}
                </div>
              ) : showAddressForm ? (
                <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-sm animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <h3 className="font-bold uppercase tracking-widest text-[13px]">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-black transition-colors"><X size={24}/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="md:col-span-2 flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Address Label (e.g. Home / Office)</label>
                        <input value={addressForm.name || ''} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>
                    <div className="flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">First Name</label>
                        <input value={addressForm.firstName || ''} onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>
                    <div className="flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Last Name</label>
                        <input value={addressForm.lastName || ''} onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>
                    <div className="flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Phone Number</label>
                        <input value={addressForm.phone || ''} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>

                    {/* CUSTOM DROPDOWN KOTA UNTUK LOGGED IN USER */}
                    <div className="flex flex-col group relative">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black flex justify-between">
                          City / District {isSearching && <span className="text-gray-400 animate-pulse normal-case font-medium">Searching...</span>}
                        </label>
                        <div className="relative">
                          <input 
                            placeholder="Type min 3 letters (e.g. Jakar...)"
                            className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium pr-8"
                            value={addressForm.city || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAddressForm({...addressForm, city: val, cityId: ''});
                              handleCitySearch(val);
                            }}
                            onFocus={() => { if(citySuggestions.length > 0) setShowSuggestions(true); }}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          />
                          <Search className="absolute right-0 top-3 text-gray-400" size={16} />
                          
                          {showSuggestions && citySuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-52 overflow-y-auto z-50 rounded-b-md">
                              {citySuggestions.map((city: any) => (
                                <li 
                                  key={city.city_id} 
                                  className="p-3 text-[13px] font-medium text-gray-700 hover:text-black hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                  onMouseDown={() => {
                                    setAddressForm({...addressForm, city: city.city_name, cityId: city.city_id});
                                    setShowSuggestions(false);
                                  }}
                                >
                                  {city.city_name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">Street Address</label>
                        <input value={addressForm.street || ''} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>
                    <div className="flex flex-col group">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-black">ZIP Code</label>
                        <input value={addressForm.zip || ''} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-200 py-2 outline-none focus:border-black text-[15px] font-medium" />
                    </div>
                  </div>
                  <div className="mt-12 flex gap-4">
                    <button onClick={handleSaveAddress} className="bg-black text-white px-10 py-4 font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-gray-900 transition-colors shadow-md">Save Address</button>
                    <button onClick={() => setShowAddressForm(false)} className="border border-black text-black px-10 py-4 font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-6 border transition-all duration-300 relative group cursor-pointer ${selectedAddress?.id === addr.id ? 'border-black bg-white shadow-md ring-1 ring-black' : 'border-gray-200 bg-[#fcfcfc] hover:border-gray-400 hover:shadow-sm'}`}>
                      {selectedAddress?.id === addr.id && <CheckCircle2 className="absolute top-5 right-5 text-black" size={20} />}
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-2" onClick={() => handleSelectAddress(addr)}>
                            <MapPin size={18} className={selectedAddress?.id === addr.id ? 'text-black' : 'text-gray-400'} />
                            <span className="font-black text-[14px] uppercase tracking-tighter">{addr.name}</span>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); openEditForm(addr); }} className="text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity p-1"><Edit2 size={16}/></button>
                      </div>
                      <div className="text-[14px] text-gray-600 font-medium leading-relaxed" onClick={() => handleSelectAddress(addr)}>
                        <p className="text-black font-bold mb-1">{addr.firstName} {addr.lastName}</p>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.zip}</p>
                        <p className="mt-2 text-gray-500">{addr.phone}</p>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={openAddForm} className="border-2 border-dashed border-gray-200 bg-[#fafafa] p-8 flex flex-col items-center justify-center hover:border-black hover:bg-white transition-all group min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:border-black transition-colors shadow-sm">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Add New Address</span>
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: SHIPPING METHOD */}
            <div className={`transition-all duration-500 ${!selectedAddress ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-4">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-[13px]">2</span> 
                Shipping Method
              </h2>

              <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col gap-4">
                {loadingShipping ? (
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-500 p-4">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    Calculating best rates...
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <p className="text-[14px] text-gray-500 font-medium p-4 text-center border border-dashed border-gray-200">Please select an address above to view available shipping options.</p>
                ) : (
                  shippingOptions.map((option: any, idx: number) => {
                    const optionName = option.service || option.name || option.description || "Reguler";
                    let optionCost = 0;
                    if (typeof option.cost === 'number') optionCost = option.cost;
                    else if (typeof option.value === 'number') optionCost = option.value;
                    else if (Array.isArray(option.cost)) optionCost = option.cost[0]?.value || 0;

                    let optionEtd = option.etd || option.estimation || "-";
                    if (Array.isArray(option.cost)) optionEtd = option.cost[0]?.etd || optionEtd;

                    return (
                      <label 
                        key={idx} 
                        onClick={() => setSelectedShippingCost(optionCost)}
                        className={`flex items-center justify-between p-5 border transition-all cursor-pointer ${selectedShippingCost === optionCost ? 'border-black ring-1 ring-black bg-[#fafafa]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedShippingCost === optionCost ? 'border-black' : 'border-gray-300'}`}>
                              {selectedShippingCost === optionCost && <div className="w-3 h-3 bg-black rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-bold text-[15px] uppercase tracking-wide text-[#191919]">JNE {optionName}</p>
                            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Estimated Delivery: {optionEtd} Business Days</p>
                          </div>
                        </div>
                        <span className="font-black text-[16px]">Rp {optionCost.toLocaleString('id-ID')}</span>
                      </label>
                    )
                  })
                )}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: ORDER SUMMARY */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-[#fcfcfc] border border-gray-200 sticky top-24 shadow-2xl shadow-gray-200/50">
              <div className="p-8 md:p-10 border-b border-gray-200">
                <h2 className="text-[26px] font-black uppercase tracking-tighter mb-8">Order Summary</h2>
                <div className="flex flex-col gap-6 max-h-[350px] overflow-y-auto hide-scrollbar pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-5">
                      <div className="w-20 h-20 bg-white border border-gray-100 flex-shrink-0 p-2 shadow-sm">
                        <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-bold text-[14px] leading-snug line-clamp-2 mb-1 text-[#191919]">{item.name}</p>
                        <div className="flex justify-between items-center w-full mt-1">
                          <p className="text-[13px] text-gray-500 font-medium">Qty: {item.quantity}</p>
                          <p className="font-black text-[14px]">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BAGIAN PROMO CODE */}
              <div className="p-8 md:p-10 bg-[#fafafa] border-b border-gray-200">
                {!appliedPromo ? (
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Gift Card or Discount Code</label>
                    <div className="flex gap-3">
                      <input 
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Enter code" 
                        className="flex-1 bg-white border border-gray-300 px-4 py-3 outline-none focus:border-black text-[13px] font-bold uppercase"
                      />
                      <button 
                        onClick={applyPromo}
                        disabled={loadingPromo || !promoInput}
                        className="bg-black text-white px-6 font-bold uppercase tracking-widest text-[11px] disabled:opacity-50 hover:bg-gray-800 transition-colors"
                      >
                        {loadingPromo ? '...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && <p className="text-red-500 text-[12px] font-bold mt-1">{promoError}</p>}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Applied Promo</label>
                    <div className="flex justify-between items-center bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 size={16} />
                        <span className="font-bold uppercase text-[12px] tracking-widest">{appliedPromo.code}</span>
                      </div>
                      <button onClick={removePromo} className="text-gray-400 hover:text-red-500 transition-colors"><X size={16}/></button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 md:p-10 bg-white border-b border-gray-200">
                <div className="space-y-4 text-[14px] font-medium">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-black font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-black font-bold">{selectedShippingCost === 0 ? 'Calculated at next step' : `Rp ${selectedShippingCost.toLocaleString('id-ID')}`}</span>
                  </div>
                  
                  {/* BARIS DISKON MUNCUL KALAU ADA DISKON */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-bold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Taxes</span>
                        <HelpCircle size={14} className="text-gray-300" />
                    </div>
                    <span className="text-gray-400 text-[13px]">Included (Rp {taxDisplay.toLocaleString('id-ID')})</span>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-[#f8f8f8]">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-xl font-bold uppercase tracking-widest text-gray-800">Total</span>
                  <span className="text-4xl font-black tracking-tighter text-[#131317]">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                <button 
                  onClick={handlePay}
                  disabled={loading || cart.length === 0 || !selectedAddress || selectedShippingCost === 0}
                  className="w-full relative group overflow-hidden bg-black text-white py-5 font-black tracking-[0.2em] text-[13px] uppercase transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Lock size={16} />} 
                    {loading ? "Processing Securely..." : "Proceed to Secure Payment"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}