
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomerInfo } from '../types';

interface CheckoutStore {
  customerInfo: CustomerInfo;
  paymentMethod: string;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPaymentMethod: (method: string) => void;
  reset: () => void;
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
    (set) => ({
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
      }
    }),
    {
      name: 'checkout-storage',
    }
  )
);
