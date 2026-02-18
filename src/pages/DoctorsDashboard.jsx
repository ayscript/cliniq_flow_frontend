import React, { useState } from "react";
import {
  Users,
  LayoutDashboard,
  Settings,
  HelpCircle,
  FileText,
  Search,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  FolderOpen,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import ConsultationRoom from "../components/Patient"; // Ensure this path is correct
import { patientsList } from "../components/ActivePatientsList";

const DoctorsDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState("Ayomide");
  
  // New States for Navigation
  const [isConsulting, setIsConsulting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleStartExam = (patient) => {
    setSelectedPatient(patient);
    setIsConsulting(true);
  };

  const handleEndConsultation = () => {
    setIsConsulting(false);
    setSelectedPatient(null);
  };

  const getUrgencyStyles = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-700 border-red-200 animate-pulse font-bold";
      case "urgent":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 font-semibold";
      case "follow-up":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  // If we are in consultation mode, render the ConsultationRoom instead of the dashboard content
  if (isConsulting) {
    return (
      <div className="flex flex-1 h-screen bg-slate-50 overflow-hidden font-sans">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ConsultationRoom 
            patient={selectedPatient} 
            onCancel={handleEndConsultation} 
            onSave={(data) => {
              console.log("Saving Consultation Data:", data);
              handleEndConsultation();
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen bg-slate-50 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome, Dr. {user}</h1>
            <p className="text-slate-500 text-sm italic">System Active</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search patient record..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none w-64"
              />
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Triage Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Emergency</p>
                  <p className="text-2xl font-black text-slate-800">03</p>
                </div>
                <AlertTriangle className="text-red-500 opacity-20" size={32} />
              </div>
              <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Urgent</p>
                  <p className="text-2xl font-black text-slate-800">08</p>
                </div>
                <Clock className="text-yellow-500 opacity-20" size={32} />
              </div>
              <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Follow-up</p>
                  <p className="text-2xl font-black text-slate-800">14</p>
                </div>
                <CheckCircle className="text-green-500 opacity-20" size={32} />
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  Active Patients Queue
                </h2>
                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md uppercase">
                  Live Feed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-tighter text-slate-300">#</th>
                      <th className="px-6 py-4 font-bold text-slate-500">Patient</th>
                      <th className="px-6 py-4 font-bold text-center">Age</th>
                      <th className="px-6 py-4 font-bold">Triage Status</th>
                      <th className="px-6 py-4 font-bold">Activity Status</th>
                      <th className="px-6 py-4 font-bold text-center">Records</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientsList.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{patient.id}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {patient.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">{patient.Age}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter border shadow-sm ${getUrgencyStyles(patient.urgency)}`}>
                            {patient.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              {patient.active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${patient.active ? "bg-green-500" : "bg-slate-300"}`}></span>
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {patient.active ? "In Consultation" : "Waiting"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Medical History"
                          >
                            <FolderOpen size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleStartExam(patient)}
                            disabled={patient.active}
                            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                              patient.active
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg"
                            }`}
                          >
                            {patient.active ? "IN PROGRESS" : "START EXAM"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorsDashboard;