import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '../types';

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (orderId: string) => Order | undefined;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, order] 
      })),
      getOrder: (orderId) => {
        const orders = get().orders;
        return orders.find(order => order.id === orderId);
      },
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'tafaneen-orders',
    }
  )
);