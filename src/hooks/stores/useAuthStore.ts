import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@utils/axios';
import { authApi } from '@services/api';

export interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

function syncTokenToAxios(token: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

try {
  const stored = localStorage.getItem('resto-app-auth');
  if (stored) {
    const parsed = JSON.parse(stored) as { state?: { token?: string } };
    if (parsed?.state?.token) {
      syncTokenToAxios(parsed.state.token);
    }
  }
} catch {
  // ignore
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        syncTokenToAxios(token);
      },
      logout: () => {
        set({ user: null, token: null });
        syncTokenToAxios(null);
      },
      hydrate: async () => {
        const state = useAuthStore.getState();
        if (!state.token) return;
        try {
          const res = await authApi.me();
          set({ user: (res.data?.data ?? res.data) as User });
        } catch {
          set({ user: null, token: null });
          syncTokenToAxios(null);
        }
      },
    }),
    {
      name: 'resto-app-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) syncTokenToAxios(state.token);
      },
    }
  )
);

useAuthStore.subscribe((state) => {
  syncTokenToAxios(state.token);
});
