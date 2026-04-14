import { create } from 'zustand';
import api from '../utils/api';

// Persistence: Cek apakah user pernah login real sebelumnya di Browser ini
const savedUser = JSON.parse(localStorage.getItem('userInfo')) || null;

export const useAuthStore = create((set) => ({
  user: savedUser, 
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/users/login', { email, password });
      
      // Simpan identitas ke memori lokal
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      set({ user: res.data, loading: false });
      
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Gagal tersambung ke Server' };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/users/register', { name, email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      set({ user: res.data, loading: false });
      
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: error.response?.data?.message || 'Gagal tersambung ke Server' };
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  }
}));
