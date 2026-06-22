import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from '@petcare/shared';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  setAuth: (user: User | null, role: UserRole | null, token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: localStorage.getItem('auth-token'),
  setAuth: (user, role, token) => {
    if (token) localStorage.setItem('auth-token', token);
    else localStorage.removeItem('auth-token');
    set({ user, role, token });
  },
  clearAuth: () => {
    localStorage.removeItem('auth-token');
    set({ user: null, role: null, token: null });
  },
}));
