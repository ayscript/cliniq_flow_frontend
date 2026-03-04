import { create } from "zustand";
import { api } from "../utils/api";

const useAdminStore = create((set) => {
  return {
    users: [],
    isLoading: false,
    error: null,
    reset: () => set({users: [], isLoading: false, error: null}),
    setUsers: (users) => set({ users }),
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (userId) =>
      set((state) => ({ users: state.users.filter((u) => u.id !== userId) })),
    updateUser: (updatedUser) =>
      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u,
        ),
      })),
    fetchUsers: async () => {
      try {
        set({ isLoading: true, error: null });
        const data = await api.get("/admin/users");
        // API expected to return an array of users directly
        set({ users: Array.isArray(data) ? data : data.users || [] });
      } catch (err) {
        console.error(err);
        set({
          error:
            err.message || "An unexpected error occurred while fetching users.",
        });
        // keep existing users or clear
        set({ users: [] });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

export { useAdminStore };
