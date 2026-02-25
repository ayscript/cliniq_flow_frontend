import { create } from "zustand";
import { supabase } from "../utils/supabaseClient";

export const useAuthStore = create((set) => {
  return {
    isAuthenticated: false,
    user: null,
    login: async (userData) => {
      const { data, error } = await supabase.auth.signInWithPassword(userData);
      if (error) {
        console.error("Login error:", error);
        return error;
      } else {
        console.log("Login successful:", data.user);
        set({ isAuthenticated: true, user: data.user });
      }
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
    },
  };
});
