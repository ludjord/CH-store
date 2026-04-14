import React, { useState } from 'react';
import api from '../utils/api';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
           const { data } = await api.post('/users/forgotpassword', { email });
           setMsg(data.message);
        } catch (error) {
           setMsg(error.response?.data?.message || 'Server Error');
        } finally {
           setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-[#111] p-10 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full"></div>
                
                <Link to="/login" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4"/> Kembali
                </Link>

                <h2 className="text-3xl font-extrabold text-white mb-2">Lupa Kata Sandi?</h2>
                <p className="text-sm text-gray-400 mb-8">
                    Masukkan email terdaftar Anda, dan kami akan mengirimkan instruksi untuk me-reset kata sandi Anda.
                </p>
                
                {msg && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                        {msg}
                    </div>
                )}
                
                <form onSubmit={submitHandler} className="space-y-6 relative z-10">
                    <div>
                        <input 
                            required 
                            type="email" 
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-neutral-800 focus:border-blue-500 rounded-xl px-5 py-3.5 text-white outline-none transition-all shadow-inner focus:ring-1 focus:ring-blue-500/50" 
                            placeholder="Alamat Email Valid Anda" 
                        />
                    </div>
                    <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-black text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition-all disabled:opacity-50 active:scale-95 uppercase tracking-widest"
                    >
                        {isSubmitting ? 'Memproses...' : <><Mail className="w-4 h-4"/> Kirim Token Reset</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
