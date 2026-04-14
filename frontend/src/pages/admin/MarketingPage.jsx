import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Megaphone, Save, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function MarketingPage() {
  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchMarketing = async () => {
      try {
        const { data } = await api.get('/marketing');
        if (data) {
          setFormData({
            message: data.message || '',
            isActive: data.isActive || false,
            endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
          });
        }
      } catch (error) {
        console.error('Failed to load marketing settings');
      } finally {
        setLoading(false);
      }
    };
    fetchMarketing();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.post('/marketing', formData);
      setStatus({ type: 'success', text: 'Siaran Berhasil Diperbarui!' });
    } catch (error) {
      setStatus({ type: 'error', text: 'Gagal memperbarui siaran.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500 mx-auto"></div></div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <Megaphone className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Pusat Pemasaran Live</h1>
          <p className="text-gray-400 mt-1">Siarkan pesan promo langsung ke seluruh pengunjung website Anda.</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in duration-300 ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{status.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#151515] p-8 rounded-3xl border border-neutral-800 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] pointer-events-none"></div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Pesan Siaran (Broadcast Message)</label>
          <textarea 
            required
            rows="3"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-6 py-4 text-white outline-none transition-all text-lg"
            placeholder="Contoh: Flash Sale 10.10! Diskon hingga 50% untuk semua Sepatu Dr. Martens!"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Waktu Berakhir (Countdown)
            </label>
            <input 
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-6 py-4 text-white outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest">Status Aktif</label>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-indigo-600' : 'bg-neutral-800'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-9' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-bold ${formData.isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                {formData.isActive ? 'Siaran Sedang Berlangsung' : 'Siaran Dinonaktifkan'}
              </span>
            </div>
          </div>
        </div>

        <button 
          disabled={saving}
          type="submit" 
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black tracking-widest text-lg shadow-xl shadow-indigo-600/20 transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
        >
          {saving ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <><Save className="w-6 h-6" /> TERBITKAN SEKARANG</>}
        </button>
      </form>

      <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <p className="text-sm text-amber-500/80 leading-relaxed font-medium">
          Pesan ini akan segera muncul di bagian paling atas website untuk <span className="font-bold underline">seluruh pengunjung</span>. Pastikan informasi promo, kode voucher, atau batasan waktu sudah benar sebelum menerbitkan siaran.
        </p>
      </div>
    </div>
  );
}
