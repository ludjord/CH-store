import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import MarketingPage from './pages/admin/MarketingPage';
import OrderManagement from './pages/admin/OrderManagement';
import { ShoppingBag, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import LogoImg from './assets/logo.png';
import LivePromoBanner from './components/LivePromoBanner';

const UserLayout = () => {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.cartItems);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500/30">
      <LivePromoBanner />
      <nav className="sticky top-0 z-50 bg-[#101010]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all h-20 shadow-2xl">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1 rounded-xl group-hover:scale-110 transition-transform">
            <img 
               src={LogoImg} 
               alt="CHSTORE Logo" 
               className="w-10 h-10 object-contain drop-shadow-md" 
               style={{ filter: 'invert(1) brightness(1.8)', mixBlendMode: 'screen' }}
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight hidden sm:flex items-center gap-1">
            CH<span className="text-indigo-400 font-bold">STORE</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6">
           {user?.role === 'admin' && (
             <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 text-sm font-bold flex gap-2 items-center bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20 transition-colors">
                <ShieldCheck className="w-4 h-4"/> <span className="hidden sm:inline">Ruang Admin</span>
             </Link>
           )}

           <Link to="/cart" className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition group relative px-2">
             <div className="relative">
               <ShoppingBag className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
               {totalItems > 0 && (
                 <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#101010] animate-in zoom-in">
                   {totalItems}
                 </span>
               )}
             </div>
             <span className="hidden md:block ml-1">Troli</span>
           </Link>

          <div className="h-6 w-px bg-neutral-800 hidden sm:block mx-1"></div>

          {user ? (
             <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-300 hidden md:block">Halo, {user.name}</span>
                <button onClick={logout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full text-sm font-bold text-red-500 border border-red-500/20 transition-all focus:ring-2 focus:ring-red-500/50">
                  <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Keluar</span>
                </button>
             </div>
          ) : (
             <Link to="/login" className="flex items-center gap-2 bg-white hover:bg-indigo-50 px-5 py-2.5 rounded-full text-sm font-bold text-slate-900 shadow-xl transition-all active:scale-95">
               <User className="w-4 h-4" /> Masuk Akun
             </Link>
          )}
        </div>
      </nav>
      
      <main className="relative overflow-hidden min-h-[calc(100vh-160px)]">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -mt-40 -mr-40 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none -mb-40 -ml-40 mix-blend-screen"></div>
        
        <Outlet />
      </main>

      <footer className="border-t border-neutral-800 py-12 relative z-10 w-full bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} CHSTORE Eksklusif. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
