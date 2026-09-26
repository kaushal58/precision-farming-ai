import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { email: email.trim(), password });
          set({ token: data.token, user: data.user, loading: false });
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          return data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (form) => {
        set({ loading: true });
        const { data } = await api.post('/auth/register', form);
        set({ token: data.token, user: data.user, loading: false });
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        return data;
      },

      logout: () => {
        delete api.defaults.headers.common.Authorization;
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },

      updateUser: (user) => set({ user }),
    }),
    { name: 'acg-auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);
