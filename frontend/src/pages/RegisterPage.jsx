import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldAlert, UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { register, loading } = useAuthStore();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        const res = await register(name, email, password);
        if(res.success) {
            alert('Pembuatan Akun Database Berhasil!');
            navigate('/');
        } else {
            setErrorMsg(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="max-w-md w-full space-y-8 bg-[#111] p-10 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 p-24 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full"></div>
                
                <div className="text-center relative z-10">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Buat Akun Nyata</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Data akan disimpan valid menggunakan MongoDB & Bcrypt
                    </p>
                </div>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm relative z-10 font-medium">
                        <ShieldAlert className="w-5 h-5 shrink-0"/> {errorMsg}
                    </div>
                )}
                
                <form className="mt-8 space-y-6 relative z-10" onSubmit={submitHandler}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-400 ml-1">Nama Lengkap</label>
                            <input 
                                required 
                                type="text" 
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full mt-1 bg-[#1a1a1a] border border-neutral-800 focus:border-purple-500 rounded-xl px-5 py-3.5 text-white outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/50" 
                                placeholder="Jhon Doe" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 ml-1">Email Aktif</label>
                            <input 
                                required 
                                type="email" 
                                value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full mt-1 bg-[#1a1a1a] border border-neutral-800 focus:border-purple-500 rounded-xl px-5 py-3.5 text-white outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/50" 
                                placeholder="nyata@email.com" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-400 ml-1">Password Rahasia</label>
                            <input 
                                required 
                                type="password" 
                                value={password} onChange={e => setPassword(e.target.value)}
                                minLength="6"
                                className="w-full mt-1 bg-[#1a1a1a] border border-neutral-800 focus:border-purple-500 rounded-xl px-5 py-3.5 text-white outline-none transition-all shadow-inner focus:ring-1 focus:ring-purple-500/50" 
                                placeholder="Minimal 6 Karakter" 
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-500/20 text-sm font-black text-white bg-purple-600 hover:bg-purple-500 focus:outline-none transition-all disabled:opacity-50 active:scale-95 uppercase tracking-widest"
                        >
                            {loading ? 'Menyimpan State...' : <><UserPlus className="w-4 h-4"/> Daftarkan Diri</>}
                        </button>
                    </div>
                    
                    <div className="text-center text-sm font-medium text-gray-500">
                        Sudah punya akun? 
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors">Silakan Sign In.</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
