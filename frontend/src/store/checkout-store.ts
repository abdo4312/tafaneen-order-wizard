
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomerInfo } from '../types';

interface CheckoutStore {
  customerInfo: CustomerInfo;
  paymentMethod: string;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPaymentMethod: (method: string) => void;
  reset: () => void;
  autoConfirmOrder: () => void;
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  phone: '',
  street: '',
  buildingNumber: '',
  floor: '',
  area: ''
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      customerInfo: initialCustomerInfo,
      paymentMethod: '',
      
      setCustomerInfo: (info: CustomerInfo) => {
        set({ customerInfo: info });
      },
      
      setPaymentMethod: (method: string) => {
        set({ paymentMethod: method });
      },
      
      reset: () => {
        set({ 
          customerInfo: initialCustomerInfo,
          paymentMethod: ''
        });
      },

      autoConfirmOrder: () => {
        // وظيفة إقرار السلة تلقائياً بعد كل عملية دفع
        const { reset } = get();
        
        // إقرار تلقائي للطلب
        console.log('تم إقرار الطلب تلقائياً');
        
        // إفراغ البيانات
        reset();
        
        // حفظ سجل الطلب
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const newOrder = {
          id: `AUTO-${Date.now()}`,
          confirmedAt: new Date().toISOString(),
          status: 'confirmed'
        };
        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      }
    }),
    {
      name: 'checkout-storage',
    }
  )
);
