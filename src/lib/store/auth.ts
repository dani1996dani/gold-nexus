import { create } from 'zustand';
import { User } from '@/generated/prisma/client'; // Import User type

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: Omit<User, 'password'> | null; // Save the whole user object (without password)
  checkAuth: () => Promise<void>;
  login: (user: Omit<User, 'password'>) => void; // Login now accepts the user object
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  user: null, // Initialize user object
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const meResponse = await fetch('/api/users/me');

      if (meResponse.ok) {
        const user = await meResponse.json();
        set({ isLoggedIn: true, user: user });
        return;
      }

      if (meResponse.status === 401) {
        const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });

        if (refreshResponse.ok) {
          const userResponse = await fetch('/api/users/me');
          if (userResponse.ok) {
            const user = await userResponse.json();
            set({ isLoggedIn: true, user: user });
            return;
          }
        }
      }

      set({ isLoggedIn: false, user: null });
    } catch (error) {
      console.error('Auth check failed', error);
      set({ isLoggedIn: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  login: (user: Omit<User, 'password'>) => set({ isLoggedIn: true, user: user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
