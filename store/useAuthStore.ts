import { create } from "zustand";

interface User {
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      set({
        user: { email, name: "John Doe", profileImage: "" },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updatedUser) => {
    set({ user: updatedUser });
  },
}));
