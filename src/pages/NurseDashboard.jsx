// import { useMemo, useState } from "react";
// import { usePatients } from "../components/PatientContext";
// import StatusBadge from "../components/StatusBadge";
// import api from "../services/api";

// export default function NurseDashboard() {
//   const { patients, setPatients } = usePatients();
//   const [loadingId, setLoadingId] = useState(null);
//   const [search, setSearch] = useState("");

//   const filtered = useMemo(() =>
//     patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
//     [patients, search]
//   );

//   const totalToday       = patients.length;
//   const emergencyCount   = patients.filter(p => p.priority === "critical" || p.priority === "immediate").length;
//   const stableCount      = patients.filter(p => p.priority === "standard"  || p.priority === "non-urgent").length;
//   const seenCount        = patients.filter(p => p.status === "Seen").length;
//   const queueCount       = patients.filter(p => p.status !== "Seen" && p.status !== "In Cons").length;

//   const handlePriorityChange = async (id, value) => {
//     try {
//       setLoadingId(id);
//       await api.updatePatient(id, { priority: value });
//       setPatients(prev => prev.map(p => p.id === id ? { ...p, priority: value } : p));
//     } catch (err) {
//       console.error("Priority update failed:", err);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleStatusChange = async (id, value) => {
//     try {
//       await api.updatePatient(id, { status: value });
//       setPatients(prev => prev.map(p => p.id === id ? { ...p, status: value } : p));
//     } catch (err) {
//       console.error("Status update failed:", err);
//     }
//   };

//   const priorityCls = (priority) => {
//     switch (priority) {
//       case "critical":   return "bg-red-600   text-white border-red-600   animate-pulse";
//       case "immediate":  return "bg-red-500   text-white border-red-500   animate-pulse";
//       case "urgent":     return "bg-orange-500 text-white border-orange-500";
//       case "non-urgent": return "bg-green-500  text-white border-green-500";
//       default:           return "bg-yellow-400 text-gray-800 border-yellow-400"; // standard
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">

//       <h1 className="text-2xl md:text-3xl font-bold mb-6">Nurse Dashboard</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//         <StatCard title="Total Today" value={totalToday} />
//         <StatCard title="Emergency"   value={emergencyCount} color="red" />
//         <StatCard title="Stable"      value={stableCount}    color="green" />
//         <StatCard title="Seen"        value={seenCount}      color="blue" />
//         <StatCard title="Queue"       value={queueCount}     color="yellow" />
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search patient..."
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//         className="w-full mb-6 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Patient list */}
//       <div className="space-y-4">
//         {filtered.length === 0 && (
//           <div className="text-center py-12 text-gray-400 text-sm">No patients found.</div>
//         )}

//         {filtered.map(patient => (
//           <div
//             key={patient.id}
//             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
//           >
//             {/* Left */}
//             <div className="flex-1">
//               <h2 className="font-semibold text-base text-gray-900">{patient.name}</h2>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {patient.vitals?.temp  ? `Temp: ${patient.vitals.temp}°C` : ""}
//                 {patient.vitals?.pulse ? ` | Pulse: ${patient.vitals.pulse}` : ""}
//                 {patient.vitals?.resp  ? ` | RR: ${patient.vitals.resp}` : ""}
//               </p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 <span className="font-semibold text-blue-600">PID:</span> {patient.pid}
//                 {patient.enc ? <><span className="mx-2 text-gray-300">|</span><span className="font-semibold text-blue-600">ENC:</span> {patient.enc}</> : null}
//               </p>
//               <p className="text-xs mt-1 text-gray-600">
//                 Status: <span className="font-semibold">{patient.status}</span>
//               </p>
//             </div>

//             {/* Right */}
//             <div className="flex flex-col items-end gap-2 shrink-0">

//               {/* Priority dropdown */}
//               <select
//                 value={patient.priority || "standard"}
//                 disabled={loadingId === patient.id}
//                 onChange={e => handlePriorityChange(patient.id, e.target.value)}
//                 className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer focus:outline-none
//                   disabled:opacity-60 ${priorityCls(patient.priority)}`}
//               >
//                 <option value="critical">🔴 Critical / High</option>
//                 <option value="immediate">🔴 Immediate / Emergency</option>
//                 <option value="urgent">🟠 Urgent</option>
//                 <option value="standard">🟡 Standard / Moderate</option>
//                 <option value="non-urgent">🟢 Non-Urgent / Low</option>
//               </select>

//               {/* Send to Doctor */}
//               <button
//                 onClick={() => handleStatusChange(patient.id, "Awaiting Cons")}
//                 className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
//               >
//                 <i className="fa fa-paper-plane mr-1" aria-hidden="true"></i>Send to Doctor
//               </button>

//               {/* Quick status */}
//               <select
//                 value={patient.status}
//                 onChange={e => handleStatusChange(patient.id, e.target.value)}
//                 className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-600"
//               >
//                 {["Awaiting Triage","Awaiting Cons","In Cons","Seen","Awaiting Authorization"].map(s => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, color }) {
//   const colors = {
//     red:    "text-red-600",
//     green:  "text-green-600",
//     blue:   "text-blue-600",
//     yellow: "text-yellow-600",
//   };
//   return (
//     <div className="p-4 rounded-2xl shadow-sm bg-white border border-gray-100">
//       <p className="text-xs text-gray-500 mb-1">{title}</p>
//       <h2 className={`text-2xl font-bold ${colors[color] || "text-gray-800"}`}>{value}</h2>
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });

const api = {
  getPatients:       () => fetch(`${BASE_URL}/record-officer/patients`, { headers: authHeaders() }).then(r => r.json()),
  updatePatient:     (id, data)   => fetch(`${BASE_URL}/record-officer/patients/${id}`, { method:"PATCH", headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  saveVitals:        (id, vitals) => fetch(`${BASE_URL}/record-officer/patients/${id}/vitals`, { method:"PATCH", headers: authHeaders(), body: JSON.stringify(vitals) }).then(r => r.json()),
  addNote:           (id, note)   => fetch(`${BASE_URL}/record-officer/patients/${id}/notes`, { method:"POST", headers: authHeaders(), body: JSON.stringify(note) }).then(r => r.json()),
  addRx:             (id, rx)     => fetch(`${BASE_URL}/record-officer/patients/${id}/rx`, { method:"POST", headers: authHeaders(), body: JSON.stringify(rx) }).then(r => r.json()),
  runAITriage:       (transcript, patient_age, patient_sex) =>
    fetch(`${BASE_URL}/nlp/process`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ transcript, patient_age, patient_sex }),
    }).then(r => r.json()),
};

const MOCK_DOCTORS = [
  { id:1, name:"Dr. Aremo Anuoluwapo", room:"Rm 4", available:true,  signedIn:true },
  { id:2, name:"Salahu Abiola Ishaq",  room:"Rm 1", available:true,  signedIn:true },
  { id:3, name:"Sule-Odu Ibrahim",     room:"Rm 2", available:true,  signedIn:true },
  { id:4, name:"Abikoye Peter O",      room:"Rm 3", available:false, signedIn:true },
];

const MOCK_PATIENTS = [
  { id:1, name:"HASSAN AKIBU OLUWASHINA", gender:"male",   arrivalTime:"08:56:49 am", pid:"10126537", dob:"02/01/1959", age:"67 Years",        enc:"576594", status:"Awaiting Triage",       doctorId:1, doctor:"Abikoye Peter O",    payIcon:"green", priority:"urgent",    vitals:{temp:"",bp:"",pulse:"",resp:"",weight:"",height:"",bmi:"",sugar:""}, diagnosis:"Glaucoma Suspect",     notes:[{id:1,type:"doctor",author:"SMITH JONES",  time:"10:15:00 AM",content:"Patient presents with blurred vision.\nReports gradual onset over 3 months.\n\nO/E: alert, not pale, not icteric.\n\nPlan:\n- IOP measurement\n- Visual field test\n- Fundoscopy"}], nurseNotes:[{id:1,type:"nurse",author:"NURSE ADAEZE",time:"09:05:00 AM",content:"Patient arrived ambulatory. Vitals taken."}], rx:[{id:1,date:"Mon, Mar 02, 2026",name:"Timolol 0.5% Eye Drops",status:"Pending"},{id:2,date:"Mon, Mar 02, 2026",name:"Latanoprost 0.005%",status:"Pending"}], lab:[], services:[], assignedDoctor:null },
  { id:2, name:"SHODIPO QUAM OKIKIOLA",  gender:"male",   arrivalTime:"09:18:56 am", pid:"10125937", dob:"28/10/2020", age:"5 Years 5 Months", enc:"576649", status:"Awaiting Triage",       doctorId:2, doctor:"Salahu Abiola Ishaq", payIcon:"green", priority:"standard",  vitals:{temp:"",bp:"",pulse:"",resp:"",weight:"",height:"",bmi:"",sugar:""}, diagnosis:"Pediatric Eye Check",  notes:[{id:1,type:"doctor",author:"SALAHU ABIOLA",time:"09:30:00 AM",content:"5 year old male.\n\nPlan:\n- Refraction\n- Cycloplegic exam"}], nurseNotes:[], rx:[], lab:[], services:[], assignedDoctor:null },
  { id:3, name:"ADEYEMI FLORENCE",       gender:"female", arrivalTime:"07:43:30 am", pid:"10100070", dob:"15/06/1957", age:"68 Years",         enc:"576407", status:"Awaiting Triage",       doctorId:3, doctor:"Sule-Odu Ibrahim",   payIcon:"red",   priority:"standard",  vitals:{temp:"",bp:"",pulse:"",resp:"",weight:"",height:"",bmi:"",sugar:""}, diagnosis:"Cataract - Right Eye", notes:[{id:1,type:"doctor",author:"IBRAHIM SULE",  time:"08:00:00 AM",content:"Progressive vision loss.\n\nPlan:\n- Biometry\n- Pre-op assessment"}], nurseNotes:[{id:1,type:"nurse",author:"NURSE BISI",time:"07:50:00 AM",content:"BP slightly elevated. Patient calm."}], rx:[{id:1,date:"Mon, Mar 02, 2026",name:"Chloramphenicol Eye Drops",status:"Pending"}], lab:[], services:[], assignedDoctor:null },
  { id:4, name:"ALAO-AFUNLEHIN HALIMA",  gender:"female", arrivalTime:"08:11:37 am", pid:"10034262", dob:"27/12/1979", age:"46 Years",         enc:"576479", status:"Awaiting Authorization", doctorId:3, doctor:"Sule-Odu Ibrahim",   payIcon:"red",   priority:"non-urgent",vitals:{temp:"",bp:"",pulse:"",resp:"",weight:"",height:"",bmi:"",sugar:""}, diagnosis:"Dry Eye Syndrome",     notes:[], nurseNotes:[], rx:[], lab:[], services:[], assignedDoctor:null, nhis:"2490336-PL", plan:"Local Plan", insurer:"Redcare Health Services Limited" },
];

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

const GenderIcon = ({ gender }) => (
  <span style={{ color: gender==="male"?"#3b82f6":"#ec4899", fontWeight:700 }}>{gender==="male"?"♂":"♀"}</span>
);

const StatusBadge = ({ status }) => {
  const map = { "Awaiting Triage":"bg-orange-500 text-white","Seen":"bg-green-500 text-white","In Cons":"bg-blue-500 text-white","Awaiting Cons":"bg-yellow-500 text-white","Awaiting Authorization":"bg-purple-500 text-white" };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${map[status]||"bg-gray-400 text-white"}`}>{status}</span>;
};

function Toast({ message, type="success" }) {
  const c={success:"bg-green-600",error:"bg-red-600",info:"bg-blue-600"};
  const i={success:"",error:"",info:"ℹ"};
  return <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold text-white ${c[type]}`}>{i[type]} {message}</div>;
}

function ConfirmTriageModal({ patient, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl"></div>
          <div><div className="font-bold text-gray-800">Start Triage</div><div className="text-xs text-gray-500">Outpatient · Ophthalmology</div></div>
        </div>
        <p className="text-gray-700 text-sm mb-1">You are about to begin triage for:</p>
        <p className="font-bold text-gray-900 mb-1">{patient.name}</p>
        <p className="text-xs text-gray-500 mb-6">PID: {patient.pid} · ENC: {patient.enc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600">OK, Proceed</button>
        </div>
      </div>
    </div>
  );
}

function SendDoctorModal({ patient, doctors, onSend, onClose }) {
  const [selected, setSelected] = useState(null);
  const available = doctors.filter(d => d.available && d.signedIn);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="font-bold text-gray-800 mb-1">Send to Doctor</div>
        <div className="text-xs text-gray-500 mb-4">{patient.name}</div>
        {available.length===0 && <div className="text-sm text-red-500 mb-4">No available doctors currently signed in.</div>}
        <div className="space-y-2 mb-5">
          {available.map(d => (
            <label key={d.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${selected===d.id?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-blue-300"}`}>
              <input type="radio" name="doc" className="accent-blue-500" checked={selected===d.id} onChange={() => setSelected(d.id)} />
              <div><div className="text-sm font-semibold text-gray-800">{d.name}</div><div className="text-xs text-gray-500">{d.room} · Available</div></div>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
          <button disabled={!selected} onClick={() => onSend(selected)} className={`flex-1 py-2 rounded-xl text-white text-sm font-bold ${selected?"bg-blue-600 hover:bg-blue-700":"bg-gray-300 cursor-not-allowed"}`}>Send</button>
        </div>
      </div>
    </div>
  );
}

function AddRxModal({ onAdd, onClose }) {
  const [name,setName]=useState(""); const [dose,setDose]=useState(""); const [freq,setFreq]=useState(""); const [duration,setDuration]=useState("");
  const today = new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
  const handleAdd = () => { if(!name.trim())return; onAdd({name:[name,dose,freq&&`— ${freq}`,duration&&`× ${duration}`].filter(Boolean).join(" "),status:"Pending",date:today}); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="font-bold text-gray-800 mb-4"> Add Prescription</div>
        <div className="space-y-3">
          <input className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Drug name *" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Dose (e.g. 500mg)" value={dose} onChange={e=>setDose(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Frequency (e.g. 3× daily)" value={freq} onChange={e=>setFreq(e.target.value)} />
          <input className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Duration (e.g. 7 days)" value={duration} onChange={e=>setDuration(e.target.value)} />
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleAdd} disabled={!name.trim()} className={`flex-1 py-2 rounded-xl text-white text-sm font-bold ${name.trim()?"bg-green-600 hover:bg-green-700":"bg-gray-300 cursor-not-allowed"}`}>Add</button>
        </div>
      </div>
    </div>
  );
}

function AITriageResultBanner({ result, onClose }) {
  if (!result) return null;
  const levelColors = { EMERGENCY:"bg-red-600", HIGH:"bg-orange-500", MEDIUM:"bg-yellow-500 text-gray-800", LOW:"bg-green-500" };
  const bg = levelColors[result.urgency?.level] || "bg-gray-500";
  return (
    <div className={`${bg} text-white px-4 py-3 flex flex-wrap items-center gap-4 text-xs`}>
      <span className="font-bold text-sm"> AI Triage Result: {result.urgency?.level}</span>
      {result.urgency?.score != null && <span>Score: <b>{result.urgency.score.toFixed(2)}</b></span>}
      {result.urgency?.reasons?.length > 0 && <span>Reasons: <b>{result.urgency.reasons.join(", ")}</b></span>}
      {result.urgency?.critical_flags?.length > 0 && <span className="font-bold">{result.urgency.critical_flags.join(", ")}</span>}
      <button onClick={onClose} className="ml-auto font-bold opacity-80 hover:opacity-100">✕ Dismiss</button>
    </div>
  );
}

function TriagePage({ patient, doctors, currentUser, onBack, onUpdatePatient, showToast }) {
  const now = useLiveClock();
  const [activeTab,setActiveTab]=useState("rx");
  const [noteTab,setNoteTab]=useState(currentUser?.role==="nurse"?"nurse":"doctor");
  const [newNote,setNewNote]=useState(""); const [newNurseNote,setNewNurseNote]=useState("");
  const [notes,setNotes]=useState(patient.notes||[]);
  const [nurseNotes,setNurseNotes]=useState(patient.nurseNotes||[]);
  const [diagnosis,setDiagnosis]=useState(patient.diagnosis||"");
  const [vitals,setVitals]=useState({temp:"",bp:"",pulse:"",resp:"",weight:"",height:"",bmi:"",sugar:"",...patient.vitals});
  const [editingVitals,setEditingVitals]=useState(!patient.vitals?.temp);
  const [savingVitals,setSavingVitals]=useState(false);
  const [rx,setRx]=useState(patient.rx||[]);
  const [lab,setLab]=useState(patient.lab||[]);
  const [sendModal,setSendModal]=useState(false);
  const [addRxModal,setAddRxModal]=useState(false);
  const [patientStatus,setPatientStatus]=useState(patient.status);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiResult,setAiResult]=useState(null);

  const VITAL_FIELDS=[
    {key:"temp",  label:"Temperature",      unit:"°C",   placeholder:"36.5"},
    {key:"bp",    label:"Blood Pressure",   unit:"mmHg", placeholder:"120/80"},
    {key:"pulse", label:"Pulse",            unit:"bpm",  placeholder:"72"},
    {key:"resp",  label:"Respiration Rate", unit:"cpm",  placeholder:"18"},
    {key:"weight",label:"Weight",           unit:"kg",   placeholder:"70"},
    {key:"height",label:"Height",           unit:"cm",   placeholder:"170"},
    {key:"bmi",   label:"BMI",              unit:"kg/m²",placeholder:"24.2"},
    {key:"sugar", label:"Blood Sugar",      unit:"mg/dL",placeholder:"90"},
  ];

  const vitalColor=(key,val)=>{
    if(!val)return"bg-gray-200 text-gray-500";
    if(key==="temp"){const n=parseFloat(val);return n>=37.5?"bg-red-500 text-white":n<36?"bg-blue-400 text-white":"bg-green-500 text-white";}
    if(key==="bp"){const s=parseInt(val.split("/")[0]);return s>=140?"bg-red-500 text-white":"bg-green-500 text-white";}
    return"bg-green-500 text-white";
  };

  const handleAITriage = async () => {
    try {
      setAiLoading(true);
      const transcript = `Patient ${patient.name} presenting for triage. Diagnosis: ${patient.diagnosis||"unknown"}. Gender: ${patient.gender}.`;
      const result = await api.runAITriage(transcript, patient.age, patient.gender);
      setAiResult(result);
      const urgencyMap = { EMERGENCY:"critical", HIGH:"immediate", MEDIUM:"urgent", LOW:"non-urgent" };
      const newPriority = urgencyMap[result.urgency?.level] || "standard";
      onUpdatePatient(patient.id, { priority: newPriority });
      showToast(` AI Triage: ${result.urgency?.level} → priority set to ${newPriority}`);
    } catch { showToast("AI Triage failed — is the backend running?","error"); }
    finally { setAiLoading(false); }
  };

  const saveVitals=async()=>{ setSavingVitals(true); try{await api.saveVitals(patient.id,vitals); onUpdatePatient(patient.id,{vitals}); setEditingVitals(false); showToast("Vitals saved");}catch{showToast("Failed to save vitals","error");} setSavingVitals(false); };
  const saveNote=async()=>{ if(!newNote.trim())return; const note={id:Date.now(),type:"doctor",author:currentUser?.name||"DR. CURRENT USER",time:now.toLocaleTimeString(),content:newNote}; try{await api.addNote(patient.id,note); const u=[...notes,note]; setNotes(u); onUpdatePatient(patient.id,{notes:u}); setNewNote(""); showToast("Note saved");}catch{showToast("Failed","error");} };
  const saveNurseNote=async()=>{ if(!newNurseNote.trim())return; const note={id:Date.now(),type:"nurse",author:currentUser?.name||"NURSE",time:now.toLocaleTimeString(),content:newNurseNote}; try{await api.addNote(patient.id,note); const u=[...nurseNotes,note]; setNurseNotes(u); onUpdatePatient(patient.id,{nurseNotes:u}); setNewNurseNote(""); showToast("Note saved");}catch{showToast("Failed","error");} };
  const updateStatus=async(s)=>{ try{await api.updatePatient(patient.id,{status:s}); setPatientStatus(s); onUpdatePatient(patient.id,{status:s}); showToast(`Status → ${s}`);}catch{showToast("Failed","error");} };
  const addRxItem=async(item)=>{ try{await api.addRx(patient.id,item); const u=[...rx,{...item,id:Date.now()}]; setRx(u); onUpdatePatient(patient.id,{rx:u}); showToast("Prescription added");}catch{showToast("Failed","error");} };
  const dispenseRx=(idx)=>{ const u=rx.map((r,i)=>i===idx?{...r,status:"Dispensed"}:r); setRx(u); onUpdatePatient(patient.id,{rx:u}); showToast("Marked as dispensed"); };
  const handleSendToDoctor=async(doctorId)=>{ const doc=doctors.find(d=>d.id===doctorId); try{await api.updatePatient(patient.id,{doctorId,doctor:doc.name,status:"Awaiting Cons"}); onUpdatePatient(patient.id,{assignedDoctor:doc.name,doctor:doc.name,status:"Awaiting Cons"}); setPatientStatus("Awaiting Cons"); setSendModal(false); showToast(`Sent to ${doc.name}`);}catch{showToast("Failed","error");} };

  return (
    <div className="min-h-screen bg-gray-100">
      {sendModal  && <SendDoctorModal patient={patient} doctors={doctors} onSend={handleSendToDoctor} onClose={()=>setSendModal(false)} />}
      {addRxModal && <AddRxModal onAdd={addRxItem} onClose={()=>setAddRxModal(false)} />}

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 sticky top-0 z-30 shadow-sm flex-wrap">
        <button onClick={onBack} className="text-blue-600 text-sm font-semibold hover:underline shrink-0">← BACK</button>
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-bold text-gray-800 text-sm md:text-base">{patient.name}</span>
          <GenderIcon gender={patient.gender} />
          <span className="text-gray-400 text-xs">PID:{patient.pid}</span>
          <span className="text-gray-400 text-xs">| ENC:{patient.enc}</span>
          <span className="text-gray-400 text-xs">| DOB:{patient.dob} — {patient.age}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <select value={patientStatus} onChange={e=>updateStatus(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold text-gray-700">
            {["Awaiting Triage","Awaiting Cons","In Cons","Seen","Awaiting Authorization"].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={()=>setSendModal(true)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 whitespace-nowrap"> Send to Doctor</button>
          {/* ── AI TRIAGE BUTTON (Triage Page) ── */}
          <button
            onClick={handleAITriage}
            disabled={aiLoading}
            className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-purple-700 whitespace-nowrap disabled:opacity-50 transition"
          >
            {aiLoading ? " Running..." : " AI Triage"}
          </button>
        </div>
      </div>

      {/* AI Result Banner */}
      <AITriageResultBanner result={aiResult} onClose={()=>setAiResult(null)} />

      {/* Vitals */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Vitals</span>
          <button onClick={()=>setEditingVitals(!editingVitals)} className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${editingVitals?"bg-gray-200 text-gray-700":"bg-blue-100 text-blue-700 hover:bg-blue-200"}`}>{editingVitals?"Cancel":" Edit Vitals"}</button>
        </div>
        {editingVitals?(
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {VITAL_FIELDS.map(f=>(
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-0.5 block">{f.label} <span className="text-gray-400">({f.unit})</span></label>
                  <input value={vitals[f.key]||""} onChange={e=>setVitals(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder} className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              ))}
            </div>
            <button onClick={saveVitals} disabled={savingVitals} className="bg-green-600 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50">{savingVitals?"Saving...":" Save Vitals"}</button>
          </>
        ):(
          <div className="flex gap-3 flex-wrap">
            {VITAL_FIELDS.map(f=>(
              <div key={f.key} className="flex flex-col items-start">
                <div className={`rounded-md px-3 py-1 text-sm font-bold min-w-[60px] text-center ${vitalColor(f.key,vitals[f.key])}`}>{vitals[f.key]||"—"}</div>
                <div className="text-xs text-gray-400 mt-0.5">{f.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-60 bg-white border-r border-gray-200 p-4 space-y-4 shrink-0">
          <div>
            <div className="text-xs text-gray-400 mb-1">Arrived Facility</div>
            <div className="text-xs font-semibold text-gray-700">{now.toDateString()} | {patient.arrivalTime}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-3xl font-black text-blue-700">1</div>
            <div className="text-xs text-blue-500 font-semibold">Day</div>
            <div className="text-xs text-gray-500 capitalize">{patient.gender} Ophthalmology</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Days Spent</div>
            <span className="text-sm font-bold text-blue-700 bg-blue-50 rounded px-2 py-0.5">1</span>
            <button className="ml-2 text-xs text-blue-500 hover:underline">See Details</button>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Doctor In Charge</div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <i className="fa fa-user" aria-hidden="true"></i>
                <span className="hidden md:block">{currentUser.name}</span>
                <span className="text-xs text-gray-400 capitalize ml-1">({currentUser.role})</span>
                </div></div>
              <div>
                <div className="text-xs font-bold text-gray-800 leading-tight">{patient.doctor}</div>
                <div className="text-xs text-gray-400">Doctor In Charge</div>
                <button className="text-xs text-blue-500 hover:underline mt-0.5">Edit</button>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Diagnosis</div>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-2 mb-2">
              <div className="text-xs font-bold text-gray-700">{diagnosis||"Not set"}</div>
            </div>
            <input className="w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Update diagnosis..." value={diagnosis} onChange={e=>{setDiagnosis(e.target.value);onUpdatePatient(patient.id,{diagnosis:e.target.value});}} />
          </div>
          {patient.nhis&&(
            <div className="bg-purple-50 rounded-xl p-3 text-xs space-y-0.5">
              <div className="font-bold text-purple-700">NHIS</div>
              <div className="text-gray-600">{patient.nhis} ({patient.plan})</div>
              <div className="text-gray-500">{patient.insurer}</div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button onClick={()=>setNoteTab("doctor")} className={`flex-1 py-3 text-sm font-semibold transition ${noteTab==="doctor"?"bg-blue-50 text-blue-700 border-b-2 border-blue-500":"text-gray-500 hover:bg-gray-50"}`}>Doctor's Notes</button>
              <button onClick={()=>setNoteTab("nurse")}  className={`flex-1 py-3 text-sm font-semibold transition ${noteTab==="nurse" ?"bg-pink-50 text-pink-700 border-b-2 border-pink-500":"text-gray-500 hover:bg-gray-50"}`}> Nurse's Notes</button>
            </div>
            <div className="p-4">
              {noteTab==="doctor"?(
                <>
                  {notes.length===0&&<div className="text-xs text-gray-400 mb-3">No doctor notes yet.</div>}
                  {notes.map((n,i)=>(
                    <div key={i} className="mb-4 border-l-4 border-blue-400 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{n.author}</span>
                        <span className="text-xs text-gray-400"> {n.time}</span>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{n.content}</pre>
                    </div>
                  ))}
                  <textarea className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mt-2" rows={4} placeholder="Add doctor's note..." value={newNote} onChange={e=>setNewNote(e.target.value)} />
                  <button onClick={saveNote} className="mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 font-semibold"> Save Note</button>
                </>
              ):(
                <>
                  {nurseNotes.length===0&&<div className="text-xs text-gray-400 mb-3">No nurse notes yet.</div>}
                  {nurseNotes.map((n,i)=>(
                    <div key={i} className="mb-4 border-l-4 border-pink-400 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">{n.author}</span>
                        <span className="text-xs text-gray-400"> {n.time}</span>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{n.content}</pre>
                    </div>
                  ))}
                  <textarea className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none mt-2" rows={4} placeholder="Add nurse's note..." value={newNurseNote} onChange={e=>setNewNurseNote(e.target.value)} />
                  <button onClick={saveNurseNote} className="mt-2 bg-pink-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-pink-600 font-semibold"> Save Note</button>
                </>
              )}
            </div>
          </div>

          {/* Rx / Lab / etc Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {[{id:"rx",label:" Rx"},{id:"lab",label:" Lab"},{id:"diagnostics",label:" Other Diagnostics"},{id:"services",label:" Med. Services"},{id:"bill",label:" Auto Bill"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${activeTab===t.id?"bg-blue-50 text-blue-700 border-b-2 border-blue-500":"text-gray-500 hover:bg-gray-50"}`}>{t.label}</button>
              ))}
            </div>
            <div className="p-4">
              {activeTab==="rx"&&(
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button onClick={()=>setAddRxModal(true)} className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600">+ Add</button>
                    <button className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600">+ Dispense From My Shelf</button>
                    <button className="bg-gray-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-600">⚙ Manage List</button>
                  </div>
                  {rx.length===0&&<div className="text-xs text-gray-400">No prescriptions yet.</div>}
                  {rx.map((item,i)=>(
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm text-gray-700 font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400"> {item.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status==="Dispensed"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{item.status}</span>
                        {item.status!=="Dispensed"&&<button onClick={()=>dispenseRx(i)} className="text-xs text-green-600 hover:underline font-medium">Dispense</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="lab"&&<div><button className="mb-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600">+ Request Lab Test</button>{lab.length===0?<div className="text-xs text-gray-400">No lab requests yet.</div>:lab.map((l,i)=><div key={i} className="text-sm py-2 border-b">{l.name} — <span className="text-yellow-600 font-semibold">{l.status}</span></div>)}</div>}
              {activeTab==="diagnostics"&&<div className="text-xs text-gray-400">No diagnostic requests yet. <button className="text-blue-600 ml-2 hover:underline font-semibold">+ Add</button></div>}
              {activeTab==="services"&&<div className="text-xs text-gray-400">No medical services added. <button className="text-blue-600 ml-2 hover:underline font-semibold">+ Add</button></div>}
              {activeTab==="bill"&&(
                <div>
                  <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Auto Bill Summary</div>
                  {rx.length===0&&lab.length===0?<div className="text-xs text-gray-400">No billable items yet.</div>:(
                    <div className="space-y-2">
                      {rx.map((r,i)=><div key={i} className="flex justify-between text-sm border-b pb-2"><span className="text-gray-700">{r.name}</span><span className="text-gray-400 text-xs">{r.status}</span></div>)}
                      <div className="flex justify-between font-bold text-sm pt-2"><span>Total</span><span className="text-blue-700">Calculated by billing dept.</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NurseDashboard() {
  const now = useLiveClock();
  const [patients,setPatients]=useState(MOCK_PATIENTS);
  const [doctors,setDoctors]=useState(MOCK_DOCTORS);
  const [loading,setLoading]=useState(false);
  const [refreshing,setRefreshing]=useState(false);
  const [searchTerm,setSearchTerm]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [toast,setToast]=useState(null);
  const [triagePatient,setTriagePatient]=useState(null);
  const [confirmPatient,setConfirmPatient]=useState(null);
  const [sendModal,setSendModal]=useState(null);
  const [triageLoadingId,setTriageLoadingId]=useState(null);  // ← AI Triage loading per card

  const currentUser = JSON.parse(localStorage.getItem("user")||"null")||{name:"Adedotun Rofiat",role:"nurse"};
  const showToast=useCallback((msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3500); },[]);

  const loadData=useCallback(async()=>{
    setLoading(true);
    try {
      const p = await api.getPatients();
      if (Array.isArray(p)) setPatients(p);
    } catch { showToast("Using mock data — backend not reachable","info"); }
    setLoading(false);
  },[showToast]);

  useEffect(()=>{ loadData(); },[loadData]);

  const handleRefresh=async()=>{
    setRefreshing(true);
    await loadData();
    showToast("Patient list refreshed");
    setRefreshing(false);
  };

  const toggleDoctor=(id,available)=>{
    setDoctors(prev=>prev.map(d=>d.id===id?{...d,available}:d));
    const doc=doctors.find(d=>d.id===id);
    showToast(`${doc.name} marked as ${available?"available":"unavailable"}`);
  };

  const handleSendDoctor=async(patientId,doctorId)=>{
    const doc=doctors.find(d=>d.id===doctorId);
    try{
      await api.updatePatient(patientId,{doctorId,doctor:doc.name,status:"Awaiting Cons"});
      setPatients(prev=>prev.map(p=>p.id===patientId?{...p,assignedDoctor:doc.name,doctor:doc.name,status:"Awaiting Cons"}:p));
      setSendModal(null);
      showToast(`Patient sent to ${doc.name} (${doc.room})`);
    }catch{ showToast("Failed to assign doctor","error"); }
  };

  const handleQuickStatus=async(patientId,newStatus)=>{
    try{
      await api.updatePatient(patientId,{status:newStatus});
      setPatients(prev=>prev.map(p=>p.id===patientId?{...p,status:newStatus}:p));
      const p=patients.find(x=>x.id===patientId);
      showToast(`${p?.name} → ${newStatus}`);
    }catch{ showToast("Failed to update status","error"); }
  };

  const handleUpdatePatient=useCallback((patientId,data)=>{
    setPatients(prev=>prev.map(p=>p.id===patientId?{...p,...data}:p));
  },[]);

  
  //    AI TRIAGE — called from each patient queue card
  const handleAITriageFromQueue = async (patient) => {
    try {
      setTriageLoadingId(patient.id);
      const transcript = `Patient ${patient.name} presenting for triage. Diagnosis: ${patient.diagnosis||"unknown"}. Gender: ${patient.gender}.`;
      const result = await api.runAITriage(transcript, patient.age, patient.gender);
      const urgencyMap = { EMERGENCY:"critical", HIGH:"immediate", MEDIUM:"urgent", LOW:"non-urgent" };
      const newPriority = urgencyMap[result.urgency?.level] || "standard";
      setPatients(prev=>prev.map(p=>p.id===patient.id?{...p,priority:newPriority}:p));
      showToast(` ${patient.name}: ${result.urgency?.level} → ${newPriority}`);
    } catch { showToast("AI Triage failed — is the backend running?","error"); }
    finally { setTriageLoadingId(null); }
  };

  const stats={
    awaitingTriage:patients.filter(p=>p.status==="Awaiting Triage").length,
    awaitingCons:  patients.filter(p=>p.status==="Awaiting Cons").length,
    inCons:        patients.filter(p=>p.status==="In Cons").length,
    seen:          patients.filter(p=>p.status==="Seen").length,
    total:         patients.length,
  };

  const signedInDoctors=doctors.filter(d=>d.signedIn);

  const filtered=patients.filter(p=>{
    const name=p.name||p.full_name||"";
    const pid=String(p.pid||p.id||"");
    const enc=String(p.enc||"");
    const ms=name.toLowerCase().includes(searchTerm.toLowerCase())||pid.includes(searchTerm)||enc.includes(searchTerm);
    const mf=filterStatus==="All"||p.status===filterStatus;
    return ms&&mf;
  });

  const priorityCls=(priority)=>{
    switch(priority){
      case "critical":   return "bg-red-600 text-white border-red-600 animate-pulse";
      case "immediate":  return "bg-red-500 text-white border-red-500 animate-pulse";
      case "urgent":     return "bg-orange-500 text-white border-orange-500";
      case "non-urgent": return "bg-green-500 text-white border-green-500";
      default:           return "bg-yellow-400 text-gray-800 border-yellow-400";
    }
  };

  const fmtDate=d=>d.toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
  const fmtTime=d=>d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  if(triagePatient){
    const fresh=patients.find(p=>p.id===triagePatient.id)||triagePatient;
    return <TriagePage patient={fresh} doctors={doctors} currentUser={currentUser} onBack={()=>setTriagePatient(null)} onUpdatePatient={handleUpdatePatient} showToast={showToast} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {toast&&<Toast message={toast.msg} type={toast.type} />}
      {confirmPatient&&<ConfirmTriageModal patient={confirmPatient} onConfirm={()=>{setTriagePatient(confirmPatient);setConfirmPatient(null);}} onCancel={()=>setConfirmPatient(null)} />}
      {sendModal&&<SendDoctorModal patient={sendModal} doctors={doctors} onSend={docId=>handleSendDoctor(sendModal.id,docId)} onClose={()=>setSendModal(null)} />}

      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* SIDEBAR */}
        <div className="lg:w-60 bg-gray-900 text-white shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="text-base font-black leading-tight">12.30 - 15.00,</div>
            <div className="text-base font-black leading-tight">19.00 - 21.00</div>
            <div className="text-sm font-bold text-gray-300">Hour Clinic</div>
            <div className="text-xs text-green-400 font-mono mt-2">{fmtDate(now)}</div>
            <div className="text-sm text-green-300 font-mono font-bold">{fmtTime(now)}</div>
            <div className="mt-2 text-xs font-bold text-gray-300 uppercase tracking-widest">Total Visits — {stats.total}</div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-700">
            {[
              {label:"Awaiting Triage",count:stats.awaitingTriage,status:"Awaiting Triage",bg:"bg-orange-500/20",text:"text-orange-400",sub:"text-orange-300"},
              {label:"Awaiting Cons",  count:stats.awaitingCons,  status:"Awaiting Cons",  bg:"bg-yellow-500/20",text:"text-yellow-400",sub:"text-yellow-300"},
              {label:"In Cons",        count:stats.inCons,        status:"In Cons",        bg:"bg-blue-500/20",  text:"text-blue-400",  sub:"text-blue-300"},
              {label:"Seen",           count:stats.seen,          status:"Seen",           bg:"bg-green-500/20", text:"text-green-400", sub:"text-green-300"},
            ].map(s=>(
              <button key={s.label} onClick={()=>setFilterStatus(prev=>prev===s.status?"All":s.status)}
                className={`rounded-xl p-2 text-center transition border-2 ${s.bg} ${filterStatus===s.status?"border-white scale-95":"border-transparent hover:border-gray-500"}`}>
                <div className={`text-2xl font-black ${s.text}`}>{s.count}</div>
                <div className={`text-xs leading-tight ${s.sub}`}>{s.label}</div>
              </button>
            ))}
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Doctors In Clinic</div>
            <div className="text-xs text-blue-400 mb-3">Uncheck doctors not currently available</div>
            <div className="space-y-2.5">
              {signedInDoctors.length===0&&<div className="text-xs text-gray-500">No doctors signed in.</div>}
              {signedInDoctors.map((d,i)=>(
                <div key={d.id} className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input type="checkbox" checked={d.available} onChange={e=>toggleDoctor(d.id,e.target.checked)} className="accent-green-400 w-3.5 h-3.5 shrink-0" />
                    <span className={`text-xs leading-tight truncate ${d.available?"text-gray-200":"text-gray-500 line-through"}`}>{i+1}. {d.name}</span>
                  </label>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-bold shrink-0">{d.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col min-w-0">

          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              {/* <button className="p-2 rounded hover:bg-gray-100 text-gray-600 text-lg">☰</button> */}
              <span className="font-bold text-gray-800 text-sm md:text-base">Outpatient</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <input type="text" placeholder="Search PID, name, ENC..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="px-3 py-1.5 text-sm outline-none w-40 md:w-56" />
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"> <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <input 
                        type="text" 
                        placeholder="Search PID, name, ENC..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="px-3 py-1.5 text-sm outline-none w-40 md:w-56" 
                    />
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                    </div></button>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                    <i className="fa fa-user" aria-hidden="true"></i>
                    <span className="hidden md:block">{currentUser.name}</span>
                    <span className="text-xs text-gray-400 capitalize ml-1">({currentUser.role})</span>
                    </div>
                <span className="hidden md:block">{currentUser.name}</span>
                <span className="text-xs text-gray-400 capitalize ml-1">({currentUser.role})</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 flex-wrap">
            <button onClick={handleRefresh} disabled={refreshing} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition ${refreshing?"bg-gray-100 text-gray-400 cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"}`}>
              <span className={refreshing?"inline-block animate-spin":""}></span>
              {refreshing?"Refreshing...":"Refresh"}
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200"> Display Locations</button>
            <div className="flex gap-1 flex-wrap ml-auto">
              {["All","Awaiting Triage","Awaiting Cons","In Cons","Seen"].map(s=>(
                <button key={s} onClick={()=>setFilterStatus(s)} className={`text-xs px-3 py-1 rounded-full font-semibold transition ${filterStatus===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {s}{s!=="All"&&<span className="ml-1 opacity-70">({patients.filter(p=>p.status===s).length})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Patient List */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {loading&&<div className="text-center py-16 text-gray-400"><div className="text-3xl animate-spin mb-2"></div><div className="text-sm">Loading patients...</div></div>}

            {!loading&&filtered.map((patient,idx)=>(
              <div key={patient.id} className={`bg-white rounded-2xl shadow-sm border hover:shadow-md transition ${patient.priority==="critical"||patient.priority==="immediate"?"border-red-300":"border-gray-100"}`}>
                <div className="flex items-start gap-3 p-4 flex-wrap md:flex-nowrap">
                  <div className="text-gray-400 font-bold w-6 shrink-0 mt-0.5">{idx+1}.</div>
                  <div className="text-gray-500 text-xs font-mono w-24 shrink-0 mt-1">{patient.arrivalTime}</div>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm ${patient.payIcon==="green"?"bg-green-500":"bg-red-500"}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-gray-900 text-sm md:text-base">{patient.name||patient.full_name}</span>
                      <GenderIcon gender={patient.gender} />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">👤 DOCTOR IN CHARGE: <span className="font-semibold text-gray-700">{patient.doctor||"Not assigned"}</span></div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mb-2">
                      <span><span className="font-bold text-blue-600">PID#:</span> {patient.pid||patient.id}</span>
                      <span><span className="font-bold text-blue-600">DOB⊕:</span> {patient.dob||patient.date_of_birth||"—"} — {patient.age||"—"}</span>
                      <span><span className="font-bold text-blue-600">ENC#:</span> {patient.enc||"—"}</span>
                    </div>
                    {patient.nhis&&<div className="text-xs text-gray-500 mb-2">Awaiting Auth · <span className="font-bold text-gray-700">NHIS#:{patient.nhis}</span> ({patient.plan}) · {patient.insurer}</div>}
                    <div className="flex flex-wrap gap-2">
                      {["👁 Eye Examination"," Eye History"," History Report"," Optometric Assessment"].map(btn=>(
                        <button key={btn} className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition font-medium">{btn}</button>
                      ))}
                    </div>
                    {patient.assignedDoctor&&<div className="mt-1.5 text-xs text-green-600 font-semibold"> Assigned to: {patient.assignedDoctor}</div>}
                  </div>

                  {/* Right action column */}
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-auto">

                    {/* Priority dropdown */}
                    <select
                      value={patient.priority||"standard"}
                      onChange={async e=>{
                        const priority=e.target.value;
                        setPatients(prev=>prev.map(p=>p.id===patient.id?{...p,priority}:p));
                        try{ await api.updatePatient(patient.id,{priority}); showToast(`Priority → ${priority}`); }
                        catch{ showToast("Failed to update priority","error"); }
                      }}
                      className={`text-xs font-bold px-3 py-1 rounded-full border-2 cursor-pointer focus:outline-none ${priorityCls(patient.priority)}`}
                    >
                      <option value="critical">🔴 Critical</option>
                      <option value="immediate">🔴 Immediate</option>
                      <option value="urgent">🟠 Urgent</option>
                      <option value="standard">🟡 Standard</option>
                      <option value="non-urgent">🟢 Non-Urgent</option>
                    </select>

                    {/* Triage / Status badge */}
                    {patient.status==="Awaiting Triage"?(
                      <button onClick={()=>setConfirmPatient(patient)} className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-full transition shadow">Awaiting Triage</button>
                    ):(
                      <StatusBadge status={patient.status} />
                    )}

                    {/* ──  AI TRIAGE BUTTON ── */}
                    <button
                      onClick={()=>handleAITriageFromQueue(patient)}
                      disabled={triageLoadingId===patient.id}
                      className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 transition disabled:opacity-50 whitespace-nowrap shadow-sm"
                    >
                      {triageLoadingId===patient.id ? " Running..." : " AI Triage"}
                    </button>

                    <button onClick={()=>setSendModal(patient)} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-100 transition"> Send to Doctor</button>

                    <select value={patient.status} onChange={e=>handleQuickStatus(patient.id,e.target.value)} className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-600 max-w-[140px]">
                      {["Awaiting Triage","Awaiting Cons","In Cons","Seen","Awaiting Authorization"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {!loading&&filtered.length===0&&(
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">
                    <i className="fa fa-search" aria-hidden="true"></i>
                </div>
                <div className="text-sm">{searchTerm?`No patients found for "${searchTerm}"`:`No patients with status "${filterStatus}"`}</div>
                {filterStatus!=="All"&&<button onClick={()=>setFilterStatus("All")} className="mt-2 text-blue-600 text-sm hover:underline">Show all patients</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}