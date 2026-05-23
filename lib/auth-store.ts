import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface CalculatorResult {
  groomName: string;
  greedScore: number;
  humanityScore: number;
  toxicityScore: number;
  islamicEthicsScore: number;
  dowryAmount: number;
  dowryFormatted: string;
  dowryItems: Array<{ id: string; name: string; value: number }>;
  aiCommentary: string;
  satiricalResponse: string;
  quote: string;
  timestamp: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  calculatorResult: CalculatorResult | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setCalculatorResult: (result: CalculatorResult | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      calculatorResult: null,
      login: async (email: string, password: string) => {
        // Mock login
        if (email && password.length >= 6) {
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'user',
          };
          set({ user: mockUser, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      signup: async (email: string, password: string, name: string) => {
        // Mock signup
        if (email && password.length >= 6 && name) {
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: 'user',
          };
          set({ user: mockUser, isAuthenticated: true });
        } else {
          throw new Error('Invalid input');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      setCalculatorResult: (result) => {
        set({ calculatorResult: result });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
