import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  roles: string[];
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  roles: [],
  loading: true,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });

    if (data.session?.user) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role:roles(name)')
        .eq('user_id', data.session.user.id);
      set({ roles: (roles ?? []).map((r: any) => r.role?.name).filter(Boolean) });
    }
  },

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role:roles(name)')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '');
    set({ roles: (roles ?? []).map((r: any) => r.role?.name).filter(Boolean) });
  },

  register: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, roles: [] });
  },
}));
