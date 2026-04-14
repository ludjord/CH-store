import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Package, 
  Search, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  ChevronRight
} from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showResiModal, setShowResiModal] = useState(false);
  const [resiData, setResiData] = useState({ trackingNumber: '', shippingStatus: 'Shipped' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleManualPay = async (id) => {
    if (!window.confirm("Konfirmasi pembayaran manual untuk pesanan ini? Email notifikasi akan dikirim ke pelanggan.")) return;
    try {
      await api.put(`/orders/${id}/pay-manual`);
      fetchOrders();
      alert("Pesanan ditandai LUNAS!");
    } catch (error) {
      alert("Gagal mengupdate status bayar");
    }
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${selectedOrder._id}/deliver`, resiData);
      setShowResiModal(false);
      setResiData({ trackingNumber: '', shippingStatus: 'Shipped' });
      fetchOrders();
      alert("Data pengiriman diperbarui & email dikirim!");
    } catch (error) {
      alert("Gagal update pengiriman");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || order._id.includes(searchTerm);
    if (filter === 'All') return matchesSearch;
    if (filter === 'Unpaid') return matchesSearch && !order.isPaid;
    if (filter === 'Pending Delivery') return matchesSearch && order.isPaid && order.shippingStatus !== 'Delivered';
    return matchesSearch;
  });

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-block px-3 py-1 mb-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">Transaction Manager</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kelola Pesanan & Pembayaran</h1>
          <p className="text-gray-400">Pantau arus kas dan logistik pengiriman barang pelanggan Anda.</p>
        </div>
        
        <div className="flex bg-[#151515] p-1 rounded-2xl border border-neutral-800">
          {['All', 'Unpaid', 'Pending Delivery'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {f === 'All' ? 'Semua' : f === 'Unpaid' ? 'Belum Bayar' : 'Perlu Dikirim'}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari ID Pesanan atau Nama Pelanggan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151515] border border-neutral-800 focus:border-indigo-500 rounded-3xl pl-14 pr-6 py-4 text-white outline-none transition-all shadow-inner"
          />
        </div>
        <div className="md:col-span-4 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-500 rounded-lg"><Package className="w-5 h-5 text-white"/></div>
             <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 leading-none">Total Order</p>
                <p className="text-xl font-black text-white">{orders.length}</p>
             </div>
          </div>
          <ChevronRight className="text-indigo-500/30 w-8 h-8"/>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#151515] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#1a1a1a] text-xs text-neutral-400 font-extrabold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Informasi Pesanan</th>
                <th className="px-8 py-6">Pelanggan</th>
                <th className="px-8 py-6 text-right">Total Tagihan</th>
                <th className="px-8 py-6 text-center">Status Bayar</th>
                <th className="px-8 py-6 text-center">Status Kirim</th>
                <th className="px-8 py-6 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-500 mx-auto"></div></td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-gray-500 font-bold">Tidak ada pesanan ditemukan.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-indigo-400 font-black text-xs mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-400 text-[10px] font-mono">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-white font-bold">{order.user?.name || 'Guest'}</p>
                    <p className="text-gray-500 text-xs italic">{order?.orderItems?.length || 0} Barang</p>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-white text-lg">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-black uppercase">
                        <CheckCircle className="w-3 h-3"/> LUNAS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-black uppercase">
                        <Clock className="w-3 h-3"/> BELUM BAYAR
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${order.shippingStatus === 'Pending' ? 'text-amber-400 bg-amber-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                        {order.shippingStatus}
                      </span>
                      {order.trackingNumber && <p className="text-[10px] text-gray-500 font-mono tracking-tighter">Resi: {order.trackingNumber}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!order.isPaid && (
                        <button 
                          onClick={() => handleManualPay(order._id)}
                          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg active:scale-90"
                          title="Konfirmasi Lunas Manual"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                      {order.isPaid && order.shippingStatus !== 'Delivered' && (
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowResiModal(true);
                          }}
                          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg active:scale-90"
                          title="Atur Pengiriman"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2.5 bg-neutral-800 text-gray-400 rounded-xl hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resi Modal */}
      {showResiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#151515] w-full max-w-md p-8 rounded-3xl border border-neutral-800 shadow-2xl space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 bg-blue-500/5 blur-3xl pointer-events-none"></div>
             <div className="flex items-center gap-3">
               <div className="p-3 bg-blue-500 rounded-2xl"><Truck className="text-white w-6 h-6"/></div>
               <h3 className="text-xl font-black text-white">Atur Logistik</h3>
             </div>
             
             <form onSubmit={handleUpdateShipping} className="space-y-6 relative z-10">
               <div>
                 <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nomor Resi (Tracking Number)</label>
                 <input 
                  required
                  type="text" 
                  value={resiData.trackingNumber}
                  onChange={(e) => setResiData({...resiData, trackingNumber: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-blue-500 rounded-2xl px-5 py-4 text-white outline-none"
                  placeholder="Contoh: JNE123456789"
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Status Kurir</label>
                 <select 
                   value={resiData.shippingStatus}
                   onChange={(e) => setResiData({...resiData, shippingStatus: e.target.value})}
                   className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-blue-500 rounded-2xl px-5 py-4 text-white outline-none appearance-none"
                 >
                   <option value="Shipped">📦 Sedang Dikirim (Shipped)</option>
                   <option value="Delivered">✅ Sampai Tujuan (Delivered)</option>
                   <option value="Processing">⏳ Sedang Dikemas</option>
                 </select>
               </div>

               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setShowResiModal(false)} className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold transition-all">Batal</button>
                 <button type="submit" className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20 uppercase tracking-wider">Simpan & Kirim Email</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
