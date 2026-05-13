"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Plus, Trash2, X, Check, MapPin } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { useWishlistStore } from '../../store/wishlist';
import { useCartStore } from '../../store/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TOP_TABS = ['MY ACCOUNT', 'MY ORDERS', 'MY PRODUCTS', 'MY SERVICE REQUESTS', 'MY WISH LIST'];
const SIDE_TABS = ['Personal Details', 'Addresses', 'Payment methods', 'Marketing communications'];

export default function AccountPage() {
  const router = useRouter();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState('MY ACCOUNT');
  const [activeSideTab, setActiveSideTab] = useState('Personal Details');
  
  // Data Profil
  const [extendedData, setExtendedData] = useState({ mobile: '', birthday: '', firstName: '', lastName: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // --- STATE ADDRESSES & CITIES ---
  const [addresses, setAddresses] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '', firstName: '', lastName: '', phone: '', street: '', city: '', cityId: '', zip: '', country: 'Indonesia'
  });

  const fallbackNavData = { shopCategories: [], exploreCol1: [], exploreCol2: [], supportLinks: [], mothersDayLinks: [], shopPromo: null, explorePromo: null, supportPromo: null, mothersDayPromo: null };

  const validWishlistItems = wishlistItems.filter(item => item && typeof item === 'object' && item.price !== undefined);

  useEffect(() => {
    // 1. Load Daftar Kota RajaOngkir
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCities(data); })
      .catch(err => console.error("Gagal load kota", err));

    // 2. Load User Data
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExtendedData(docSnap.data() as any);
        } else {
          const initial = { 
            firstName: currentUser.displayName?.split(' ')[0] || '', 
            lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
            mobile: '', birthday: '' 
          };
          setExtendedData(initial);
          await setDoc(docRef, initial);
        }
        fetchAddresses(currentUser.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAddresses = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, "users", uid, "addresses"));
    setAddresses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), extendedData);
    setIsEditingProfile(false);
  };

  const handleOpenAddressForm = (existingAddress: any = null) => {
    if (existingAddress) {
      setEditingAddressId(existingAddress.id);
      // Fallback jika alamat lama belum punya cityId
      setAddressForm({ cityId: '', ...existingAddress });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        name: '', firstName: extendedData.firstName || '', lastName: extendedData.lastName || '', 
        phone: extendedData.mobile || '', street: '', city: '', cityId: '', zip: '', country: 'Indonesia'
      });
    }
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    if (!addressForm.cityId) { 
      alert("Tolong pilih kota dari menu dropdown terlebih dahulu."); 
      return; 
    }

    const addrCol = collection(db, "users", user.uid, "addresses");
    if (editingAddressId) {
      await updateDoc(doc(db, "users", user.uid, "addresses", editingAddressId), addressForm);
    } else {
      await addDoc(addrCol, addressForm);
    }
    setShowAddressForm(false);
    fetchAddresses(user.uid);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this address?")) return;
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    fetchAddresses(user.uid);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>;

  const memberSince = user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';
  const isGoogleAuth = user?.providerData.some((p: any) => p.providerId === 'google.com');

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans text-[#131317]">
      <Header navData={fallbackNavData} />

      <main className="flex-grow flex flex-col pt-16 md:pt-24 pb-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 w-full mb-10">
          <p className="text-[13px] font-medium text-gray-500 mb-2">My Bose</p>
          <h1 className="text-4xl md:text-[56px] font-black tracking-tighter uppercase leading-[0.9]">
            Welcome back, {extendedData.firstName || 'User'}
          </h1>
        </div>

        <div className="w-full bg-[#f8f8f8] border-y border-gray-100 mb-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex overflow-x-auto hide-scrollbar">
            {TOP_TABS.map((tab) => (
              <button key={tab} onClick={() => tab === 'MY SERVICE REQUESTS' ? window.open('https://service.bettersound.id') : setActiveTopTab(tab)} className={`py-5 px-6 whitespace-nowrap text-[12px] md:text-[13px] tracking-widest uppercase transition-colors ${activeTopTab === tab ? 'font-black text-black border-b-2 border-black -mb-[1px]' : 'font-medium text-gray-500'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 w-full flex flex-col md:flex-row gap-16 lg:gap-32">
          {/* SIDEBAR */}
          {activeTopTab === 'MY ACCOUNT' && (
            <div className="w-full md:w-[220px] flex-shrink-0 flex flex-col gap-6">
              {SIDE_TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveSideTab(tab)} className={`text-left text-[14px] transition-all w-max ${activeSideTab === tab ? 'font-bold text-black border-b-[2px] border-black pb-0.5' : 'font-medium text-gray-600 hover:text-black'}`}>{tab}</button>
              ))}
            </div>
          )}

          <div className="flex-1 w-full max-w-[900px]">
            {/* VIEW: PERSONAL DETAILS */}
            {activeTopTab === 'MY ACCOUNT' && activeSideTab === 'Personal Details' && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-[40px] font-black tracking-tighter uppercase mb-12">Personal Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 mb-10">
                  <span className="text-[14px] font-bold uppercase tracking-wider">Member Since:</span>
                  <span className="text-[14px] font-medium text-gray-700">{memberSince}</span>
                </div>

                {/* Sign In Info */}
                <div className="border-t border-gray-200 pt-8 mb-10">
                  <h3 className="text-[15px] font-bold mb-8 uppercase tracking-widest">My Sign In</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-y-6 text-[14px]">
                    <span className="font-bold">Email:</span>
                    <span className="text-gray-600">{user?.email}</span>
                    <span className="font-bold">Password:</span>
                    <span className="text-gray-600 italic">{isGoogleAuth ? 'Externally Managed (Google)' : '********'}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-8 mb-16">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[15px] font-bold uppercase tracking-widest">My Contact Information</h3>
                    {isEditingProfile ? (
                      <div className="flex gap-4">
                        <button onClick={() => setIsEditingProfile(false)} className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1"><X className="w-4 h-4" /> Cancel</button>
                        <button onClick={handleSaveProfile} className="text-[11px] font-bold uppercase tracking-widest text-black hover:text-gray-500 flex items-center gap-1"><Check className="w-4 h-4" /> Save</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditingProfile(true)} className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-y-8 text-[14px]">
                    <span className="font-bold">First Name:</span>
                    {isEditingProfile ? <input value={extendedData.firstName} onChange={e => setExtendedData({...extendedData, firstName: e.target.value})} className="border-b border-black outline-none pb-1" /> : <span className="text-gray-600">{extendedData.firstName || '-'}</span>}

                    <span className="font-bold">Last Name:</span>
                    {isEditingProfile ? <input value={extendedData.lastName} onChange={e => setExtendedData({...extendedData, lastName: e.target.value})} className="border-b border-black outline-none pb-1" /> : <span className="text-gray-600">{extendedData.lastName || '-'}</span>}

                    <span className="font-bold">Mobile:</span>
                    {isEditingProfile ? <input value={extendedData.mobile} onChange={e => setExtendedData({...extendedData, mobile: e.target.value})} className="border-b border-black outline-none pb-1" placeholder="e.g. 0812..." /> : <span className="text-gray-600">{extendedData.mobile || '-'}</span>}

                    <span className="font-bold">Birthday:</span>
                    {isEditingProfile ? <input type="date" value={extendedData.birthday} onChange={e => setExtendedData({...extendedData, birthday: e.target.value})} className="border-b border-black outline-none pb-1" /> : <span className="text-gray-600">{extendedData.birthday || '-'}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: ADDRESSES */}
            {activeTopTab === 'MY ACCOUNT' && activeSideTab === 'Addresses' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-[40px] font-black tracking-tighter uppercase mb-8">Addresses</h2>
                
                {showAddressForm ? (
                  <div className="bg-[#f8f8f8] p-8 md:p-12 border border-gray-200">
                    <h3 className="font-bold uppercase tracking-widest text-[13px] mb-8">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">Address Name (e.g. Home / Office)</label>
                        <input value={addressForm.name} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">First Name</label>
                        <input value={addressForm.firstName} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">Last Name</label>
                        <input value={addressForm.lastName} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">Phone Number</label>
                        <input value={addressForm.phone} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                      </div>

                      {/* DROPDOWN KOTA RAJAONGKIR */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">City / Regency</label>
                        <select 
                          value={addressForm.cityId}
                          onChange={(e) => {
                            const selectedCity = cities.find(c => c.city_id === e.target.value);
                            setAddressForm({...addressForm, cityId: e.target.value, city: selectedCity ? `${selectedCity.type} ${selectedCity.city_name}` : ''});
                          }}
                          className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm cursor-pointer"
                        >
                          <option value="">Select your city...</option>
                          {cities.map((city: any) => (
                            <option key={city.city_id} value={city.city_id}>{city.type} {city.city_name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">Street Address</label>
                        <input value={addressForm.street} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase">ZIP Code</label>
                        <input value={addressForm.zip} className="bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black text-sm" onChange={e => setAddressForm({...addressForm, zip: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-12">
                      <button onClick={handleSaveAddress} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition">Save Address</button>
                      <button onClick={() => setShowAddressForm(false)} className="border border-black px-10 py-4 font-bold uppercase tracking-widest text-[11px] hover:bg-gray-50 transition">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                      <div key={addr.id} className="border border-gray-200 p-8 flex flex-col relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="font-black text-[14px] uppercase tracking-tighter">{addr.name}</span>
                          </div>
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenAddressForm(addr)} className="text-gray-400 hover:text-black"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed">{addr.firstName} {addr.lastName}<br/>{addr.street}<br/>{addr.city}, {addr.zip}<br/>{addr.phone}</p>
                      </div>
                    ))}
                    <button onClick={() => handleOpenAddressForm(null)} className="border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center hover:border-black transition-colors group">
                      <Plus className="w-8 h-8 text-gray-300 group-hover:text-black mb-2" />
                      <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black">Add Address</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: PAYMENT METHODS */}
            {activeTopTab === 'MY ACCOUNT' && activeSideTab === 'Payment methods' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-[40px] font-black tracking-tighter uppercase mb-12">Payment Methods</h2>
                
                <div className="bg-[#f8f8f8] p-8 md:p-16 border border-gray-200 flex flex-col items-center text-center">
                  <div className="flex gap-6 mb-8">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" className="h-6 md:h-8 object-contain grayscale opacity-80" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" className="h-6 md:h-8 object-contain grayscale opacity-80" alt="Mastercard" />
                  </div>
                  <h3 className="text-[17px] font-black uppercase tracking-widest mb-4">No Saved Cards Yet</h3>
                  <p className="text-[14px] text-gray-600 font-medium leading-relaxed max-w-md mb-10">
                    Faster checkout is just a click away. Pay securely with Midtrans and save your credit or debit card for future purchases.
                  </p>
                  <button className="border-2 border-dashed border-gray-300 bg-white px-10 py-5 text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:border-black transition-colors flex items-center gap-3 group shadow-sm">
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add a Card securely
                  </button>
                  <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    <Check className="w-3 h-3" /> Powered by Midtrans Tokenization
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: MY WISH LIST */}
            {activeTopTab === 'MY WISH LIST' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-[40px] font-black tracking-tighter uppercase mb-12">My Wish List</h2>
                {validWishlistItems.length === 0 ? (
                  <p className="text-gray-500 font-medium">Empty wishlist.</p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {validWishlistItems.map((item) => (
                      <div key={item.id} className="flex border border-gray-100 bg-[#fafafa] p-4 items-center gap-8">
                        <img src={item.image} className="w-24 h-24 object-contain mix-blend-multiply" alt={item.name} />
                        <div className="flex-1">
                          <h3 className="font-bold text-[16px]">{item.name}</h3>
                          <p className="font-black">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => removeFromWishlist(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                          <button onClick={() => addToCart({ ...item, quantity: 1 })} className="bg-black text-white px-6 py-2 text-[11px] font-bold uppercase tracking-widest">Add To Cart</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}