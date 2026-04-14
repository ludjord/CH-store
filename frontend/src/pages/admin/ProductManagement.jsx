import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, RefreshCw, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State form Tambah Produk
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', stock: '', image: '', salePrice: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID produk yang sedang diedit
  
  const user = useAuthStore(state => state.user);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Penghapusan Bersifat Permanen. Lanjutkan?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert("Gagal menghapus produk. Note: Pastikan server online.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
         name: formData.name, 
         price: Number(formData.price), 
         salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
         category: formData.category, 
         stock: Number(formData.stock), 
         image: formData.image || 'https://via.placeholder.com/300'
      };

      if (editingId) {
        // Mode Edit (PUT)
        const { data } = await api.put(`/products/${editingId}`, payload);
        setProducts(products.map(p => p._id === editingId ? data : p));
      } else {
        // Mode Tambah Baru (POST)
        const { data } = await api.post('/products', payload);
        setProducts([...products, data]);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', price: '', category: '', stock: '', image: '', salePrice: '' });
    } catch (error) {
      alert("Gagal memproses data produk.");
    } finally {
       setIsSubmitting(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || '',
      category: product.category,
      stock: product.stock,
      image: product.image
    });
    setShowForm(true);
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <div className="inline-block px-3 py-1 mb-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">Master Data</div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen Katalog</h1>
            <p className="text-gray-400">Atur ketersediaan barang dan sistem diskon di etalase toko Anda secara instan.</p>
         </div>
         <div className="flex gap-3 mt-4 md:mt-0">
             <button onClick={fetchProducts} title="Segarkan Data" className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl transition-all shadow-md active:scale-90">
               <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
             </button>
             <button 
               onClick={() => {
                 setShowForm(!showForm);
                 if (showForm) setEditingId(null); // Reset jika tutup form
               }} 
               className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
             >
               <Plus className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`} /> {showForm ? 'Batal' : 'Produk Baru'}
             </button>
         </div>
       </div>

       {showForm && (
         <div className="bg-[#151515] p-8 rounded-3xl border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Package className="text-indigo-400"/> {editingId ? 'Edit Data Produk' : 'Formulir Entri Data Baru'}</h2>
            
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-6 relative z-10">
               <div className="md:col-span-12">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Nama Barang</label>
                 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="Cth: MacBook Air M2 256GB" />
               </div>
               
               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Harga Normal (Rp)</label>
                 <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="15000000" />
               </div>

               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-gray-200 mb-2 uppercase tracking-wider flex items-center gap-2">Harga Diskon <span className="text-[10px] bg-red-500 px-1 rounded text-white animate-pulse">SALE</span></label>
                 <input type="number" min="0" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="w-full bg-red-500/5 border border-red-500/20 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="0 = Tanpa Diskon" />
               </div>
               
               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Kategori Valid</label>
                 <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="Elektronik / Pakaian" />
               </div>

               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Stok Unit</label>
                 <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="100 Unit" />
               </div>
               
               <div className="md:col-span-12">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Link Foto URL (Opsional/Bebas)</label>
                 <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-5 py-4 text-white outline-none transition-all shadow-inner" placeholder="https://source.unsplash.com/random/500x500/?gadget" />
               </div>
               
               <div className="md:col-span-12 pt-4">
                 <button disabled={isSubmitting} type="submit" className="w-full py-5 flex justify-center items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black tracking-widest text-lg shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all hover:-translate-y-1 active:translate-y-0">
                   {isSubmitting ? <><RefreshCw className="w-6 h-6 animate-spin"/> Merekam...</> : (editingId ? 'SIMPAN PERUBAHAN' : 'REKAM KE DATABASE')}
                 </button>
               </div>
            </form>
         </div>
       )}

       <div className="bg-[#151515] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden mt-8">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-[#1a1a1a] text-xs text-neutral-400 font-extrabold uppercase tracking-widest">
                  <tr>
                     <th className="px-8 py-6">Katalog Terekam</th>
                     <th className="px-8 py-6 text-right">Harga Jual</th>
                     <th className="px-8 py-6 text-center">Status Barang</th>
                     <th className="px-8 py-6 text-center">Tindakan</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-800/50">
                  {loading && products.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-20 text-gray-500 font-bold"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-500 mx-auto"></div></td></tr>
                  ) : products.map(p => (
                     <tr key={p._id} className="hover:bg-[#1a1a1a] transition-colors group">
                        <td className="px-8 py-5 flex items-center gap-5">
                           <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex shrink-0 shadow-lg border border-neutral-800">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           <div>
                              <span className="inline-block px-2 text-indigo-400 bg-indigo-400/10 rounded-md text-[10px] font-black uppercase mb-1.5 border border-indigo-500/20">{p.category}</span>
                              <h4 className="text-gray-100 font-bold text-base whitespace-normal max-w-[200px] sm:max-w-sm line-clamp-2 leading-snug">{p.name}</h4>
                              <p className="text-xs text-neutral-500 mt-1 font-mono">ID: {p._id}</p>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           {p.salePrice > 0 ? (
                              <div className="flex flex-col items-end">
                                 <span className="text-xs text-red-500 line-through opacity-60 font-medium">{formatPrice(p.price)}</span>
                                 <span className="text-white font-black text-lg">{formatPrice(p.salePrice)}</span>
                              </div>
                           ) : (
                              <span className="text-white font-black text-lg">{formatPrice(p.price)}</span>
                           )}
                        </td>
                        <td className="px-8 py-5 text-center">
                           <span className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase border inline-flex items-center gap-2 ${p.stock > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                             {p.stock > 0 ? <><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>{p.stock} Unit</> : 'Terjual Habis'}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-center flex items-center justify-center gap-2">
                           <button onClick={() => startEdit(p)} className="p-3 text-indigo-400 bg-indigo-400/10 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500 hover:text-white rounded-xl transition-all active:scale-90" title="Edit Discount">
                             <Plus className="w-5 h-5 rotate-45 scale-75"/> Disk
                           </button>
                           <button onClick={() => handleDelete(p._id)} className="p-3 text-red-500 bg-red-500/10 border border-transparent hover:border-red-500/30 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90" title="Delete Product">
                             <Trash2 className="w-5 h-5"/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
       </div>
    </div>
  );
}
