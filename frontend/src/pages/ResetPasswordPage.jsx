import React, { useState } from 'react';
import api from '../utils/api';
import { KeyRound } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
           const { data } = await api.put(`/users/resetpassword/${token}`, { password });
           alert(data.message);
           navigate('/login');
        } catch (error) {
           setMsg(error.response?.data?.message || 'Server Error');
        } finally {
           setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-[#111] p-10 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-green-500/10 blur-[80px] pointer-events-none rounded-full"></div>

                <h2 className="text-3xl font-extrabold text-white mb-2">Tentukan Sandi Baru</h2>
                <p className="text-sm text-gray-400 mb-8">
                    Silakan ketikkan kombinasi kata sandi baru Anda yang kuat.
                </p>
                
                {msg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                        {msg}
                    </div>
                )}
                
                <form onSubmit={submitHandler} className="space-y-6 relative z-10">
                    <div>
                        <input 
                            required 
                            minLength="6"
                            type="password" 
                            value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-neutral-800 focus:border-green-500 rounded-xl px-5 py-3.5 text-white outline-none transition-all shadow-inner focus:ring-1 focus:ring-green-500/50" 
                            placeholder="Ketik password baru (min 6 karakter)" 
                        />
                    </div>
                    <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-green-500/20 text-sm font-black text-white bg-green-600 hover:bg-green-500 focus:outline-none transition-all disabled:opacity-50 active:scale-95 uppercase tracking-widest"
                    >
                        {isSubmitting ? 'Memproses...' : <><KeyRound className="w-4 h-4"/> Perbarui Password</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
