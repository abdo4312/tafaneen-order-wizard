
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { validateAndSaveOrder } from '../utils/invoice';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  validateCartData: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1) => {
        // التحقق من صحة بيانات المنتج
        if (!product.id || !product.name || !product.price) {
          console.error('بيانات المنتج غير صحيحة:', product);
          return;
        }
        
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            console.log('تحديث كمية المنتج الموجود:', product.name, 'الكمية الجديدة:', existingItem.quantity + quantity);
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          console.log('إضافة منتج جديد للسلة:', product.name, 'الكمية:', quantity);
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
      },
      
      validateCartData: () => {
        const { items } = get();
        
        if (!items || items.length === 0) {
          console.warn('السلة فارغة');
          return false;
        }
        
        const hasValidItems = items.every(item => 
          item.product?.id &&
          item.product?.name &&
          item.product?.price > 0 &&
          item.quantity > 0
        );
        
        if (!hasValidItems) {
          console.error('السلة تحتوي على منتجات غير صحيحة');
          return false;
        }
        
        console.log('بيانات السلة صحيحة');
        return true;
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
