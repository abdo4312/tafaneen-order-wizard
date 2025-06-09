
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { product, quantity }]
          };
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === productId);
          
          if (existingItem && existingItem.quantity > 1) {
            return {
              items: state.items.map(item =>
                item.product.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
            };
          }
          
          return {
            items: state.items.filter(item => item.product.id !== productId)
          };
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: quantity === 0
            ? state.items.filter(item => item.product.id !== productId)
            : state.items.map(item =>
                item.product.id === productId
                  ? { ...item, quantity }
                  : item
              )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
