import { useMemo, useState } from "react";
import { usePatients } from "../components/PatientContext";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function NurseDashboard() {
  const { patients, setPatients } = usePatients();
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [patients, search]
  );

  const totalToday       = patients.length;
  const emergencyCount   = patients.filter(p => p.priority === "critical" || p.priority === "immediate").length;
  const stableCount      = patients.filter(p => p.priority === "standard"  || p.priority === "non-urgent").length;
  const seenCount        = patients.filter(p => p.status === "Seen").length;
  const queueCount       = patients.filter(p => p.status !== "Seen" && p.status !== "In Cons").length;

  const handlePriorityChange = async (id, value) => {
    try {
      setLoadingId(id);
      await api.updatePatient(id, { priority: value });
      setPatients(prev => prev.map(p => p.id === id ? { ...p, priority: value } : p));
    } catch (err) {
      console.error("Priority update failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      await api.updatePatient(id, { status: value });
      setPatients(prev => prev.map(p => p.id === id ? { ...p, status: value } : p));
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const priorityCls = (priority) => {
    switch (priority) {
      case "critical":   return "bg-red-600   text-white border-red-600   animate-pulse";
      case "immediate":  return "bg-red-500   text-white border-red-500   animate-pulse";
      case "urgent":     return "bg-orange-500 text-white border-orange-500";
      case "non-urgent": return "bg-green-500  text-white border-green-500";
      default:           return "bg-yellow-400 text-gray-800 border-yellow-400"; // standard
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Nurse Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Today" value={totalToday} />
        <StatCard title="Emergency"   value={emergencyCount} color="red" />
        <StatCard title="Stable"      value={stableCount}    color="green" />
        <StatCard title="Seen"        value={seenCount}      color="blue" />
        <StatCard title="Queue"       value={queueCount}     color="yellow" />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Patient list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No patients found.</div>
        )}

        {filtered.map(patient => (
          <div
            key={patient.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left */}
            <div className="flex-1">
              <h2 className="font-semibold text-base text-gray-900">{patient.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {patient.vitals?.temp  ? `Temp: ${patient.vitals.temp}°C` : ""}
                {patient.vitals?.pulse ? ` | Pulse: ${patient.vitals.pulse}` : ""}
                {patient.vitals?.resp  ? ` | RR: ${patient.vitals.resp}` : ""}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="font-semibold text-blue-600">PID:</span> {patient.pid}
                {patient.enc ? <><span className="mx-2 text-gray-300">|</span><span className="font-semibold text-blue-600">ENC:</span> {patient.enc}</> : null}
              </p>
              <p className="text-xs mt-1 text-gray-600">
                Status: <span className="font-semibold">{patient.status}</span>
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2 shrink-0">

              {/* Priority dropdown */}
              <select
                value={patient.priority || "standard"}
                disabled={loadingId === patient.id}
                onChange={e => handlePriorityChange(patient.id, e.target.value)}
                className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer focus:outline-none
                  disabled:opacity-60 ${priorityCls(patient.priority)}`}
              >
                <option value="critical">🔴 Critical / High</option>
                <option value="immediate">🔴 Immediate / Emergency</option>
                <option value="urgent">🟠 Urgent</option>
                <option value="standard">🟡 Standard / Moderate</option>
                <option value="non-urgent">🟢 Non-Urgent / Low</option>
              </select>

              {/* Send to Doctor */}
              <button
                onClick={() => handleStatusChange(patient.id, "Awaiting Cons")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
              >
                <i className="fa fa-paper-plane mr-1" aria-hidden="true"></i>Send to Doctor
              </button>

              {/* Quick status */}
              <select
                value={patient.status}
                onChange={e => handleStatusChange(patient.id, e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-600"
              >
                {["Awaiting Triage","Awaiting Cons","In Cons","Seen","Awaiting Authorization"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    red:    "text-red-600",
    green:  "text-green-600",
    blue:   "text-blue-600",
    yellow: "text-yellow-600",
  };
  return (
    <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-100">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color] || "text-gray-800"}`}>{value}</h2>
    </div>
  );
}
