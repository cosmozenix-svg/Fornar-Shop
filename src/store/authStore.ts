import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  adminToken: string | null;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  adminToken: localStorage.getItem('adminToken') || null,
  adminLogin: (token) => {
    localStorage.setItem('adminToken', token);
    set({ adminToken: token });
  },
  adminLogout: () => {
    localStorage.removeItem('adminToken');
    set({ adminToken: null });
  }
}));
