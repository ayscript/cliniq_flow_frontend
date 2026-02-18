import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Activity,
  ClipboardList,
  Stethoscope,
  User,
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  // State for storing users and loading status
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  // State for the Add User Form
  const [formData, setFormData] = useState({
    name: "",
    role: "Doctor", // Default selection
  });

  // Calculate stats dynamically from the user list
  const stats = {
    doctors: users.filter((u) => u.role === "Doctor").length,
    nurses: users.filter((u) => u.role === "Nurse").length,
    officers: users.filter((u) => u.role === "Record Officer").length,
  };

  // --- API INTERACTION ---

  // 1. Fetch Users on Component Mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/fetch_users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      // Assuming API returns an array of users or an object { users: [...] }
      // Adjust 'data.users' or 'data' based on your actual API response structure
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error(err);
      setError("Could not load dashboard data.");
      // Fallback mock data for demonstration purposes if API fails
      setUsers([
        { id: 1, name: "Dr. Gregory House", role: "Doctor" },
        { id: 2, name: "Nurse Ratched", role: "Nurse" },
        { id: 3, name: "Officer Barbrady", role: "Record Officer" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "doctors", label: "Users", icon: <Users size={20} /> },
    { id: "records", label: "Records", icon: <FileText size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    { id: "help", label: "Help & Support", icon: <HelpCircle size={20} /> },
  ];

  // 2. Add User Function
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/add_users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh list to show new user and update counts
        fetchUsers();
        setFormData({ ...formData, name: "" }); // Reset name field only
        alert(`${formData.role} added successfully!`);
      } else {
        alert("Failed to add user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const user = {
    name: "Admin User",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        logo="MedAdmin"
        menuItems={menuItems}
        activeItem={activePage}
        onNavigate={setActivePage}
        userProfile={user}
      />
      <div className="flex-1 transition-all duration-300 p-4 mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Hospital Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of hospital staff and personnel management.
          </p>
        </header>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Doctors"
            count={stats.doctors}
            icon={<Stethoscope size={32} />}
            color="bg-blue-500"
          />
          <StatCard
            title="Nurses"
            count={stats.nurses}
            icon={<UserPlus size={32} />}
            color="bg-emerald-500"
          />
          <StatCard
            title="Record Officers"
            count={stats.officers}
            icon={<ClipboardList size={32} />}
            color="bg-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Add User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-gray-600" />
                Add New Staff
              </h2>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Record Officer">Record Officer</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <UserPlus size={18} />
                  Add User
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Users Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users size={20} className="text-gray-600" />
                  Staff Directory
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Total: {users.length}
                </span>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading data...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr
                            key={user.id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                  <User size={16} />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {user.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <RoleBadge role={user.role} />
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No users found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Cleanliness ---

const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group">
    <div
      className={`absolute right-0 top-0 w-24 h-24 transform translate-x-8 -translate-y-8 rounded-full opacity-10 ${color}`}
    ></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{count}</h3>
      </div>
      <div className={`p-3 rounded-lg text-white shadow-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    Doctor: "bg-blue-100 text-blue-800 border-blue-200",
    Nurse: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Record Officer": "bg-amber-100 text-amber-800 border-amber-200",
  };

  // Default fallback style
  const activeStyle =
    styles[role] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${activeStyle}`}
    >
      {role}
    </span>
  );
};

export default Dashboard;
