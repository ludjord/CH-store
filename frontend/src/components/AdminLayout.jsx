import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Package, LogOut, Globe, Megaphone, ShoppingCart } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Guard Proteksi - Hanya admin yang boleh masuk area ini
  if (!user || user.role !== 'admin') {
    return <Navigate to="/?error=unauthorized" replace />;
  }

  const navLinks = [
    { name: 'Dashboard Induk', path: '/admin', icon: LayoutDashboard },
    { name: 'Gudang Produk', path: '/admin/products', icon: Package },
    { name: 'Kelola Pesanan', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Pusat Pemasaran', path: '/admin/marketing', icon: Megaphone }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar Admin Kiri */}
      <aside className="w-72 bg-[#101010] border-r border-neutral-800 flex flex-col hidden sm:flex z-20 shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-neutral-800/50 bg-[#161616]">
           <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-wide uppercase">
             Admin Area
           </h2>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            // Deteksi rute URL mana yang sedang aktif
            const isActive = location.pathname === link.path;
            
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-200 group relative ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0px_0px_20px_rgba(79,70,229,0.05)] border border-indigo-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-neutral-800/50 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Tombol kembali ke etalase utama */}
        <div className="p-6 border-t border-neutral-800 pb-8">
          <Link to="/" className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-xl text-sm font-semibold transition-all hover:-translate-y-1 text-gray-300 hover:text-white border border-neutral-700 hover:border-neutral-600 hover:shadow-lg">
            <Globe className="w-5 h-5" /> Kunjungi Etalase Toko
          </Link>
        </div>
      </aside>

      {/* Konten Utama Kanan */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[#0a0a0a]">
         {/* Navbar Atas Admin */}
         <header className="h-20 flex items-center justify-end px-10 bg-[#101010]/80 backdrop-blur-md border-b border-neutral-800 shrink-0 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end leading-tight">
                 <span className="text-sm font-bold text-gray-100">{user.name}</span>
                 <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Super Administrator</span>
              </div>
              <div className="h-10 w-px bg-neutral-700"></div>
              <button 
                onClick={logout} 
                className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                title="Keluar dari Admin"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
         </header>
         
         <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
            <Outlet />
         </div>
      </main>
    </div>
  );
}
