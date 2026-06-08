import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,

  login: async (email: string, password: string) => {
    const data = await api<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    set({
      user: data.user,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  },

  register: async (email: string, password: string) => {
    const data = await api<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
    set({
      user: data.user,
      token: data.accessToken,
      refreshToken: data.refreshToken,
    });
  },

  logout: () => {
    set({ user: null, token: null, refreshToken: null });
  },
}));
