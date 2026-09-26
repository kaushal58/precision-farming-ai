import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        document.documentElement.classList.toggle('dark', next === 'dark');
      },
      initTheme: () => {
        const theme = get().theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
    }),
    { name: 'acg-theme' }
  )
);
