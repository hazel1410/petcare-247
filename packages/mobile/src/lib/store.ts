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
  token: null,
  setAuth: (user, role, token) => set({ user, role, token }),
  clearAuth: () => set({ user: null, role: null, token: null }),
}));
