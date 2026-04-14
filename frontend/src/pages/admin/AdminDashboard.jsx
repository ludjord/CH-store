import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrendingUp, Users, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto Refresh
  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders')
      .then(res => setSales(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateResi = async (id, currentResi) => {
      const resiBaru = window.prompt("Masukkan Nomor Resi Kurir (JNE/JNT/Gojek):", currentResi || '');
      if (resiBaru === null) return;
      try {
         await api.put(`/orders/${id}/deliver`, 
            { trackingNumber: resiBaru, shippingStatus: 'Shipped' }
         );
         fetchOrders(); // refresh table
         alert('Resi berhasil diperbarui!');
      } catch (e) { alert('Gagal update resi (Pastikan Database menyala): ' + (e.response?.data?.message || e.message)); }
  };

  // Menurunkan Array order menjadi akumulasi angka Total
  const totalSalesVal = sales.reduce((acc, order) => acc + order.totalPrice, 0);

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

  const stats = [
    { title: 'Total Pendapatan', value: formatPrice(totalSalesVal), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { title: 'Pesanan Masuk', value: sales.length, icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Total Pelanggan', value: new Set(sales.map(s => s.user?.name)).size, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            Overview System
         </div>
        <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Capaian Toko Anda</h1>
        <p className="text-neutral-400 text-lg">Statistik performa penjualan harian secara real-time.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {stats.map((item, idx) => (
              <div key={idx} className="p-8 bg-[#151515] rounded-3xl border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors shadow-2xl shadow-black/50 hover:-translate-y-1 duration-300">
                 <div className="space-y-2">
                    <p className="text-neutral-400 font-semibold uppercase tracking-wider text-xs">{item.title}</p>
                    <p className="text-3xl font-black text-white">{item.value}</p>
                 </div>
                 <div className={`p-5 rounded-2xl border ${item.bg}`}>
                    <item.icon className={`w-8 h-8 ${item.color} drop-shadow-md`} />
                 </div>
              </div>
            ))}
          </div>

          {/* Tabel Order Terbaru */}
          <div className="bg-[#151515] rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-neutral-800 bg-[#111]">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <ShoppingBag className="w-5 h-5 text-indigo-400" /> Histori Transaksi Live
               </h3>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#1a1a1a]">
                     <tr className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        <th className="px-6 py-5">Ref ID</th>
                        <th className="px-6 py-5">Customer Profile</th>
                        <th className="px-6 py-5 text-right">Nominal</th>
                        <th className="px-6 py-5 text-center">Status Pembayaran</th>
                        <th className="px-6 py-5 text-center">Resi / Ekspedisi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                     {sales.map((order) => (
                        <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-6 py-6"><span className="text-xs bg-black/40 px-2 py-1.5 rounded-lg text-indigo-400 font-mono tracking-wider border border-white/5">#{order._id.substring(0, 8)}</span></td>
                           <td className="px-6 py-6 font-semibold text-gray-200 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                {order.user?.name?.charAt(0) || 'U'}
                              </div>
                              {order.user?.name}
                           </td>
                           <td className="px-6 py-6 text-right text-white font-bold">{formatPrice(order.totalPrice)}</td>
                           <td className="px-6 py-6 text-center">
                              <span className={`px-4 py-1.5 justify-center inline-flex rounded-full text-[11px] font-bold w-28 uppercase tracking-widest ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                {order.isPaid ? 'Lunas' : 'Menunggu'}
                              </span>
                           </td>
                           <td className="px-6 py-6 text-center">
                              {order.trackingNumber ? (
                                  <div className="flex flex-col items-center gap-1">
                                      <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded inline-block border border-emerald-500/20">{order.trackingNumber}</span>
                                      <button onClick={() => handleUpdateResi(order._id, order.trackingNumber)} className="text-[10px] text-gray-500 hover:text-white underline">Ubah</button>
                                  </div>
                              ) : (
                                  <button onClick={() => handleUpdateResi(order._id)} className="text-[11px] font-bold text-blue-400 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500 hover:text-white transition-colors">
                                     + Input Resi
                                  </button>
                              )}
                           </td>
                        </tr>
                     ))}
                     {sales.length === 0 && (
                       <tr>
                         <td colSpan="5" className="text-center py-12 text-gray-500 italic">Belum ada aliran kas masuk.</td>
                       </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
