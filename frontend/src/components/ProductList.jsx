import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const addToCart = useCartStore(state => state.addToCart);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-500 border-l-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] px-4">
        <div className="bg-red-900/40 border border-red-500 text-red-200 px-6 py-4 rounded-xl shadow-lg relative max-w-lg text-center" role="alert">
          <strong className="block font-bold text-xl mb-2">Terjadi Kesalahan Server</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">Eksplorasi Produk</h2>
        <p className="text-neutral-400 text-lg">Pilih barang kesukaan Anda lalu masukkan ke troli.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="bg-[#1a1a1a] rounded-2xl shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-neutral-800 overflow-hidden relative"
          >
            {/* Foto Produk dengan Hover Tombol Cart */}
            <div className="relative w-full h-56 overflow-hidden flex items-center justify-center p-6 bg-white/5">
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-contain w-full h-full group-hover:scale-110 drop-shadow-md transition-transform duration-500 ease-out"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                {product.stock > 0 ? (
                  <button 
                    onClick={() => { addToCart(product); alert(`${product.name} ditambahkan ke Keranjang!`); }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" /> Beli Sekarang
                  </button>
                ) : (
                   <span className="bg-red-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 opacity-80">
                      Stok Habis
                   </span>
                )}
              </div>
            </div>

            {/* Informasi Produk */}
            <div className="p-6 flex-1 flex flex-col justify-between z-10 bg-[#1a1a1a]">
              <div>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2 border border-indigo-500/20 px-2 py-1 inline-block rounded-md bg-indigo-500/10">{product.category}</p>
                <h3 className="text-lg font-bold text-gray-100 leading-snug line-clamp-2 mb-1">{product.name}</h3>
              </div>
              
              <div className="mt-6 flex flex-col gap-3">
                {product.salePrice > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-white">{formatPrice(product.salePrice)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-500 text-[10px] font-black text-white animate-pulse">-{Math.round(((product.price - product.salePrice) / product.price) * 100)}%</span>
                    </div>
                    <span className="text-sm text-neutral-500 line-through font-medium opacity-60">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-black tracking-tight text-white">{formatPrice(product.price)}</span>
                )}
                <span className={`text-xs font-semibold px-2 py-1.5 rounded-md self-start flex items-center gap-1.5 ${product.stock > 0 ? 'text-neutral-400' : 'text-red-400'}`}>
                   {product.stock > 0 ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sisa {product.stock} Unit Tersedia</> : 'Tidak Dapat Dibeli'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
