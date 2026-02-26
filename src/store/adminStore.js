import { create } from "zustand";

const useAdminStore = create((set) => {
  return {
    users: [],
    isLoading: false,
    error: null,
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
        const response = await fetch("/fetch_users");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        // Assuming API returns an array of users or an object { users: [...] }
        // Adjust 'data.users' or 'data' based on your actual API response structure
        // setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error(err);
        set({
          error:
            err.message || "An unexpected error occurred while fetching users.",
        });
        // Fallback mock data for demonstration purposes if API fails
        set({
          users: [
            {
              id: 1,
              name: "Dr. Gregory House",
              role: "Doctor",
              department: "Diagnostic Medicine",
              status: "On Duty",
              email: "g.house@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=1",
            },
            {
              id: 2,
              name: "Sarah Ratched",
              role: "Nurse",
              department: "Psychiatric Ward",
              status: "Active",
              email: "s.ratched@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=2",
            },
            {
              id: 3,
              name: "Officer Barbrady",
              role: "Record Officer",
              department: "Administration",
              status: "On Leave",
              email: "barbrady@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=3",
            },
            {
              id: 4,
              name: "Dr. Allison Cameron",
              role: "Doctor",
              department: "Immunology",
              status: "In Surgery",
              email: "a.cameron@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=4",
            },
            {
              id: 5,
              name: "Nurse Jackie",
              role: "Nurse",
              department: "Emergency Room",
              status: "Active",
              email: "jackie@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=5",
            },
            {
              id: 6,
              name: "James Wilson",
              role: "Doctor",
              department: "Oncology",
              status: "On Duty",
              email: "j.wilson@hospital.com",
              avatar: "https://i.pravatar.cc/150?u=6",
            },
          ],
        });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

export { useAdminStore };
