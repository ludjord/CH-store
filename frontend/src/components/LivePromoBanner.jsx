import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Timer, Zap } from 'lucide-react';

export default function LivePromoBanner() {
  const [promo, setPromo] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const { data } = await api.get('/marketing');
        if (data && data.isActive && data.message) {
          setPromo(data);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch promo banner');
      }
    };

    fetchPromo();
    // Refresh promo data every 5 minutes
    const interval = setInterval(fetchPromo, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!promo || !promo.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(promo.endDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft('ENDED');
        setIsVisible(false);
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  if (!isVisible || !promo) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white py-2.5 px-4 relative overflow-hidden flex items-center justify-center gap-6 z-[60] border-b border-white/10 shadow-lg group">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out"></div>

      <div className="flex items-center gap-2 relative z-10 shrink-0">
        <div className="p-1 bg-indigo-500 rounded-lg animate-bounce">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/20">Live Promo</span>
      </div>

      <p className="text-sm font-bold tracking-tight relative z-10 truncate max-w-2xl">
        <span className="text-indigo-300 mr-2">🔥</span> 
        {promo.message}
      </p>

      {promo.endDate && (
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 relative z-10 shrink-0">
          <Timer className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-black tracking-tighter text-indigo-400 w-16">
            {timeLeft}
          </span>
        </div>
      )}

      <button onClick={() => setIsVisible(false)} className="absolute right-4 text-white/50 hover:text-white transition-colors p-1" aria-label="Close Banner">
         <span className="text-xs">⨉</span>
      </button>
    </div>
  );
}
