import React, {useState} from "react";
import RegistrationForm from "../components/registration/RegistrationForm";
import Sidebar from "../components/Sidebar";
import { Calendar, DownloadCloud, File, LayoutDashboard, Search } from "lucide-react";

const RecordOfficerDasboard = () => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'register-patient', label: 'Register Patient', icon: <DownloadCloud size={20} /> },
    { id: 'patient-records', label: 'Patient Records', icon: <File size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    ];

    const user = {
    name: "Olamide Akinleye",
    role: "Record Officer",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

    const [activePage, setActivePage] = useState("register-patient");


  return (
    <div className="flex h-screen bg-gray-50">
      
      <Sidebar
        logo="MedAdmin"
        menuItems={menu}
        activeItem={activePage}
        onNavigate={setActivePage}
        userProfile={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Search */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="w-1/3 relative">
            <input
              type="text"
              placeholder="Search existing patients (Name, PID, NIN)..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Search size={16} />
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              OA
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <RegistrationForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordOfficerDasboard;
