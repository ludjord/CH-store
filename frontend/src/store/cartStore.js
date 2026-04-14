import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  
  addToCart: (product) => set((state) => {
    const existingItem = state.cartItems.find(item => item._id === product._id);
    // Jika barang sudah ada, tambah qty saja
    if (existingItem) {
       return {
          cartItems: state.cartItems.map(item => 
             item._id === product._id ? { ...item, qty: item.qty + 1 } : item
          )
       };
    } 
    // Barang baru
    return { cartItems: [...state.cartItems, { ...product, qty: 1 }] };
  }),
  
  updateQty: (id, qty) => set((state) => ({
     cartItems: state.cartItems.map(item => item._id === id ? { ...item, qty: Math.max(1, qty) } : item)
  })),

  removeFromCart: (id) => set((state) => ({
     cartItems: state.cartItems.filter(item => item._id !== id)
  })),
  
  clearCart: () => set({ cartItems: [] })
}));
