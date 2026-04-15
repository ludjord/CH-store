import React, { useState } from 'react';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCartStore();
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Kalkulasi total bayar
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const handleCheckout = async () => {
    // Memaksa pengguna Login jika Guest
    if (!user) return alert("Silakan Sign In sebagai Pembeli Biasa terlebih dahulu di sudut kanan atas layar!");

    setIsProcessing(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty
      }));
      
      const { data: order } = await api.post('/orders', {
         orderItems,
         totalPrice
      });

      if(order) {
         clearCart();
         alert(`Pesanan Berhasil Dibuat!\nID Pesanan: #${order._id.substring(0,8)}. Silakan hubungi Admin untuk proses pembayaran manual.`);
         navigate('/');
      }
    } catch (error) {
      alert("Checkout Gagal. " + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto animate-in zoom-in duration-500">
         <div className="w-32 h-32 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-neutral-600" />
         </div>
         <h2 className="text-2xl font-bold text-white mb-3">Troli Anda Masih Kosong!</h2>
         <p className="text-gray-400 mb-8">Pilih gadget atau pakaian kesukaan Anda lalu tambahkan ke troli untuk melakukan pembayaran.</p>
         <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 py-3 px-8 rounded-full font-bold text-white shadow-xl flex items-center gap-2 group transition-all">
           Mulai Belanja <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-in fade-in duration-700 relative z-10">
       <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali Belanja
       </Link>
       
       <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Troli Belanja ({cartItems.length} Produk)</h1>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Daftar Barang Kiri */}
          <div className="lg:col-span-8 space-y-4">
             {cartItems.map((item) => (
                <div key={item._id} className="bg-[#151515] p-5 rounded-3xl border border-neutral-800 flex flex-col sm:flex-row items-center gap-6 relative shadow-lg">
                   <div className="w-full sm:w-28 h-28 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   
                   <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                         <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{item.name}</h3>
                         <p className="text-indigo-400 font-black mt-2">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg border border-neutral-800 p-1">
                            <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-3 py-1 font-bold text-gray-400 hover:text-white">-</button>
                            <span className="font-bold w-6 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-3 py-1 font-bold text-gray-400 hover:text-white">+</button>
                         </div>
                         <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Kotak Kalkulasi Kanan */}
          <div className="lg:col-span-4">
             <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] p-8 rounded-3xl border border-neutral-800 sticky top-32 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">Ringkasan Faktur</h3>
                
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-gray-400">
                      <span>Total Harga Barang</span>
                      <span>{formatPrice(totalPrice)}</span>
                   </div>
                   <div className="flex justify-between text-gray-400">
                      <span>Pajak (0%)</span>
                      <span>Rp 0</span>
                   </div>
                   <div className="flex justify-between text-gray-400">
                      <span>Biaya Pengiriman</span>
                      <span className="text-indigo-400 bg-indigo-500/10 px-2 rounded-md font-bold text-xs uppercase self-center">GRATIS</span>
                   </div>
                </div>
                
                <div className="border-t border-neutral-800 pt-6 mb-8 flex justify-between items-center">
                   <span className="text-lg font-medium text-gray-300">Total Tagihan</span>
                   <span className="text-2xl font-black text-white">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={handleCheckout}
                     disabled={isProcessing}
                     className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                   >
                     {isProcessing ? 'Memproses API...' : <><CreditCard className="w-5 h-5"/> Bayar Melalui Kasir</>}
                   </button>
                   {!user && (
                      <p className="text-center text-xs text-orange-400 flex items-center justify-center gap-1 mt-2">
                        <ShieldCheck className="w-3 h-3" /> Silakan Login Publik Dulu Di Header
                      </p>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
