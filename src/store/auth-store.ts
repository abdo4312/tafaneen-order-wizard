
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: string[];
  purchaseHistory: string[];
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: string[]) => void;
  addToPurchaseHistory: (productId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // محاكاة API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const savedUsers = JSON.parse(localStorage.getItem('app-users') || '[]');
        const user = savedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      signup: async (name: string, email: string, password: string) => {
        // محاكاة API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const savedUsers = JSON.parse(localStorage.getItem('app-users') || '[]');
        
        // تحقق من وجود المستخدم
        if (savedUsers.some((u: any) => u.email === email)) {
          return false;
        }
        
        const newUser = {
          id: generateId(),
          name,
          email,
          password,
          preferences: [],
          purchaseHistory: [],
          createdAt: new Date().toISOString()
        };
        
        savedUsers.push(newUser);
        localStorage.setItem('app-users', JSON.stringify(savedUsers));
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updatePreferences: (preferences: string[]) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, preferences };
          set({ user: updatedUser });
        }
      },
      
      addToPurchaseHistory: (productId: string) => {
        const { user } = get();
        if (user) {
          const updatedHistory = [...user.purchaseHistory, productId];
          const updatedUser = { ...user, purchaseHistory: updatedHistory };
          set({ user: updatedUser });
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
