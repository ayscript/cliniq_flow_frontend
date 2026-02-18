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
import WelcomeBanner from "../components/WelcomeBanner";

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
    name: "Boluwatife Gbadamosi",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="transition-all duration-300 p-4 overflow-auto w-full">
      {/* Header */}
      <header className="mb-8">
        <WelcomeBanner user={user} />
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

      <div className="flex">
        <div className="flex-1 w-full">
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
              <div className="overflow-x-auto w-full">
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
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          {/* Name & Email */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full bg-gray-200"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role & Department */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {user.role}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.department}
                              </span>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-2 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border
      ${user.status === "On Duty" ? "bg-green-100 text-green-700 border-green-200" : ""}
      ${user.status === "On Leave" ? "bg-orange-100 text-orange-700 border-orange-200" : ""}
      ${user.status === "In Surgery" ? "bg-purple-100 text-purple-700 border-purple-200" : ""}
      ${user.status === "Active" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
    `}
                            >
                              {user.status}
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
