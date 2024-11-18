import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'John Supervisor', email: 'supervisor@demo.com', role: 'SUPERVISOR' },
  { id: '2', name: 'Dave Driver', email: 'driver@demo.com', role: 'DRIVER' },
  { id: '3', name: 'Sarah Sales', email: 'sales@demo.com', role: 'SALES' },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async ({ email, password }) => {
    // Simulate API call
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    set({ user });
  },
  logout: () => set({ user: null }),
}));