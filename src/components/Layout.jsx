import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Layout() {
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

  const [activePage, setActivePage] = useState("dashboard");

  const user = {
    name: "Boluwatife Gbadamosi",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar
        logo="MedAdmin"
        menuItems={menuItems}
        activeItem={activePage}
        onNavigate={setActivePage}
        userProfile={user}
      />
      <Outlet />
    </div>
  );
}
