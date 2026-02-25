import { create } from "zustand";

const useAdminStore = create((set) => {
    return {
        users: [],
        setUsers: (users) => set({ users }),
        addUser: (user) => set((state) => ({ users: [...state.users, user] })),
        removeUser: (userId) => set((state) => ({ users: state.users.filter(u => u.id !== userId) })),
        updateUser: (updatedUser) => set((state) => ({
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        })),
    }
})

export { useAdminStore };