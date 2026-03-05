// 
import { useState } from "react";
import GenderIcon from "./GenderIcon";
import SendDoctorModal from "./SendDoctorModal";

const VITAL_FIELDS = [
  { key: "temp",   label: "Temperature",     unit: "°C",    placeholder: "36.5", icon: "", normalMin: 36.1, normalMax: 37.2 },
  { key: "pulse",  label: "Pulse Rate",       unit: "bpm",   placeholder: "72",   icon: "",  normalMin: 60,   normalMax: 100  },
  { key: "resp",   label: "Respiration Rate", unit: "cpm",   placeholder: "16",   icon: "",  normalMin: 12,   normalMax: 20   },
  { key: "spo2",   label: "SpO₂",             unit: "%",     placeholder: "98",   icon: "",  normalMin: 95,   normalMax: 100  },
  { key: "weight", label: "Weight",           unit: "kg",    placeholder: "70",   icon: ""  },
  { key: "height", label: "Height",           unit: "cm",    placeholder: "170",  icon: ""  },
  { key: "sugar",  label: "Blood Sugar",      unit: "mg/dL", placeholder: "90",   icon: "",  normalMin: 70,   normalMax: 140  },
];

const getStatus = (field, value) => {
  if (!value || !field.normalMin) return "normal";
  const n = parseFloat(value);
  if (isNaN(n)) return "normal";
  if (n < field.normalMin) return "low";
  if (n > field.normalMax) return "high";
  return "normal";
};

const C = {
  normal: { bg: "bg-green-500",  badge: "bg-green-100 text-green-700",   border: "border-green-300",  txt: "text-green-700"  },
  high:   { bg: "bg-red-500",    badge: "bg-red-100 text-red-700",       border: "border-red-300",    txt: "text-red-700"    },
  low:    { bg: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700", border: "border-yellow-300", txt: "text-yellow-700" },
};

const calcBMI = (w, h) => {
  const wt = parseFloat(w), ht = parseFloat(h) / 100;
  if (!wt || !ht) return null;
  return (wt / (ht * ht)).toFixed(1);
};

const bmiLabel = (b) => {
  if (!b) return null;
  const v = parseFloat(b);
  if (v < 18.5) return { label: "Underweight", color: "text-yellow-600" };
  if (v < 25)   return { label: "Normal",      color: "text-green-600"  };
  if (v < 30)   return { label: "Overweight",  color: "text-orange-500" };
  return              { label: "Obese",         color: "text-red-600"    };
};

// Single vital input card
const VitalCard = ({ field, value, onChange, saved }) => {
  const st  = getStatus(field, value);
  const col = C[st];
  const has = !!value;
  return (
    <div className={`bg-white rounded-xl border-2 p-3 transition-all ${has && saved ? col.border : "border-gray-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">{field.icon}</span>
          <span className="text-xs font-semibold text-gray-600 leading-tight">{field.label}</span>
        </div>
        {has && saved && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${col.badge}`}>
            {st === "normal" ? "OK" : st === "high" ? "High↑" : "Low↓"}
          </span>
        )}
      </div>
      <input
        type="number" step="0.1"
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={`w-full border rounded-lg px-2 py-2 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-400
          ${has && saved ? `${col.txt} ${col.border} border-2` : "text-gray-700 border-gray-200"}`}
      />
      <div className="text-center text-xs text-gray-400 mt-1">{field.unit}</div>
      {field.normalMin && (
        <div className="text-center text-xs text-gray-300 mt-0.5">
          Normal: {field.normalMin}–{field.normalMax}
        </div>
      )}
    </div>
  );
};

// Blood pressure card — two linked inputs
const BPCard = ({ sys, dia, onChange, saved }) => {
  const has     = sys || dia;
  const isHigh  = parseInt(sys) > 140 || parseInt(dia) > 90;
  const isLow   = parseInt(sys) < 90  || parseInt(dia) < 60;
  const st      = has && saved ? (isHigh ? "high" : isLow ? "low" : "normal") : "normal";
  const col     = C[st];
  return (
    <div className={`bg-white rounded-xl border-2 p-3 transition-all ${has && saved ? col.border : "border-gray-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">💉</span>
          <span className="text-xs font-semibold text-gray-600">Blood Pressure</span>
        </div>
        {has && saved && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${col.badge}`}>
            {st === "normal" ? "OK" : st === "high" ? "High↑" : "Low↓"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <div className="flex-1">
          <input type="number" placeholder="Sys" value={sys}
            onChange={(e) => onChange("systolic", e.target.value)}
            className="w-full border rounded-lg px-1 py-2 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <div className="text-center text-xs text-gray-400 mt-0.5">Systolic</div>
        </div>
        <span className="text-gray-400 font-black text-lg pb-4">/</span>
        <div className="flex-1">
          <input type="number" placeholder="Dia" value={dia}
            onChange={(e) => onChange("diastolic", e.target.value)}
            className="w-full border rounded-lg px-1 py-2 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <div className="text-center text-xs text-gray-400 mt-0.5">Diastolic</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-1">mmHg</div>
      <div className="text-center text-xs text-gray-300 mt-0.5">Normal: 90/60 – 140/90</div>
    </div>
  );
};

// ─── Main component 
const TriagePage = ({ patient, onBack, doctors }) => {
  const [vitals, setVitals] = useState({ temp: "", pulse: "", resp: "", spo2: "", weight: "", height: "", sugar: "" });
  const [bpSys,  setBpSys]  = useState("");
  const [bpDia,  setBpDia]  = useState("");
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeTab,    setActiveTab]    = useState("rx");
  const [noteTab,      setNoteTab]      = useState("doctor");
  const [newNote,      setNewNote]      = useState("");
  const [newNurseNote, setNewNurseNote] = useState("");
  const [doctorNotes,  setDoctorNotes]  = useState(patient.notes      || []);
  const [nurseNotes,   setNurseNotes]   = useState(patient.nurseNotes || []);
  const [diagnosis,    setDiagnosis]    = useState(patient.diagnosis   || "");
  const [sendModal,    setSendModal]    = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, err = false) => { setToast({ msg, err }); setTimeout(() => setToast(null), 3500); };

  const bmi     = calcBMI(vitals.weight, vitals.height);
  const bmiInfo = bmiLabel(bmi);

  const handleVitalChange = (key, val) => { setSaved(false); setVitals((p) => ({ ...p, [key]: val })); };
  const handleBPChange    = (side, val) => {
    setSaved(false);
    if (side === "systolic")  setBpSys(val);
    if (side === "diastolic") setBpDia(val);
  };

  const handleSaveVitals = async () => {
    if (!vitals.temp && !bpSys) { showToast("Enter at least Temperature or Blood Pressure", true); return; }
    setSaving(true);
    try {
      const payload = {
        temp:       vitals.temp   ? `${vitals.temp}°C`      : "",
        bp:         bpSys         ? `${bpSys}/${bpDia}`     : "",
        pulse:      vitals.pulse  ? `${vitals.pulse}bpm`    : "",
        resp:       vitals.resp   ? `${vitals.resp}cpm`     : "",
        spo2:       vitals.spo2   ? `${vitals.spo2}%`       : "",
        weight:     vitals.weight ? `${vitals.weight}kg`    : "",
        height:     vitals.height ? `${vitals.height}cm`    : "",
        sugar:      vitals.sugar  ? `${vitals.sugar}mg/dL`  : "",
        bmi:        bmi           || "",
        recordedAt: new Date().toISOString(),
        recordedBy: "NURSE CURRENT USER",
      };

      // ── Uncomment when backend API is ready 
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/patients/${patient.id}/vitals`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      

      await new Promise((r) => setTimeout(r, 700)); // ← remove when API ready
      setSaved(true);
      showToast(" Vitals saved successfully");
    } catch { showToast("Failed to save vitals. Try again.", true); }
    finally  { setSaving(false); }
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setDoctorNotes([...doctorNotes, { author: "DR. CURRENT USER", time: new Date().toLocaleTimeString(), content: newNote }]);
    setNewNote("");
  };
  const addNurseNote = () => {
    if (!newNurseNote.trim()) return;
    setNurseNotes([...nurseNotes, { author: "NURSE CURRENT USER", time: new Date().toLocaleTimeString(), content: newNurseNote }]);
    setNewNurseNote("");
  };
  const handleSend = (doctorId) => {
    const doc = doctors.find((d) => d.id === doctorId);
    setSendModal(false);
    showToast(`Patient sent to ${doc.name}`);
  };

  const RX_TABS = [
    { id: "rx", label: " Rx" }, { id: "lab", label: " Lab" },
    { id: "diagnostics", label: " Diagnostics" }, { id: "services", label: " Med. Services" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.err ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      {sendModal && <SendDoctorModal patient={patient} doctors={doctors} onSend={handleSend} onClose={() => setSendModal(false)} />}

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
        <button onClick={onBack} className="text-blue-600 text-sm font-semibold hover:underline">← Queue</button>
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-800 text-sm md:text-base">{patient.name}</span>
          <GenderIcon gender={patient.gender} />
          <span className="text-gray-400 text-xs">PID:{patient.pid}</span>
          <span className="text-gray-400 text-xs">| ENC:{patient.enc}</span>
          <span className="text-gray-400 text-xs">| DOB:{patient.dob} - {patient.age}</span>
        </div>
        <button onClick={() => setSendModal(true)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
          📤 Send to Doctor
        </button>
      </div>

      {/* Saved vitals summary bar */}
      {saved && (
        <div className="bg-white border-b px-4 py-2 flex gap-3 flex-wrap items-center shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Vitals:</span>
          {[
            { label: "Temp",  val: vitals.temp  ? `${vitals.temp}°C`      : "—", key: "temp"  },
            { label: "BP",    val: bpSys         ? `${bpSys}/${bpDia}`     : "—", key: null    },
            { label: "Pulse", val: vitals.pulse  ? `${vitals.pulse}bpm`    : "—", key: "pulse" },
            { label: "Resp",  val: vitals.resp   ? `${vitals.resp}cpm`     : "—", key: "resp"  },
            { label: "SpO₂",  val: vitals.spo2   ? `${vitals.spo2}%`      : "—", key: "spo2"  },
            { label: "Sugar", val: vitals.sugar  ? `${vitals.sugar}mg/dL`  : "—", key: "sugar" },
            { label: "BMI",   val: bmi || "—",                                    key: null    },
          ].map((v) => {
            const field = VITAL_FIELDS.find((f) => f.key === v.key);
            const st    = field ? getStatus(field, vitals[v.key]) : "normal";
            return (
              <div key={v.label} className="flex flex-col items-center">
                <div className={`${C[st].bg} text-white rounded-md px-3 py-0.5 text-xs font-bold`}>{v.val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{v.label}</div>
              </div>
            );
          })}
          <button onClick={() => setSaved(false)} className="ml-auto text-xs text-blue-600 hover:underline font-semibold">Edit Vitals</button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">

        {/* Left sidebar */}
        <div className="lg:w-56 bg-white border-r border-gray-200 p-4 space-y-4 flex-shrink-0">
          <div>
            <div className="text-xs text-gray-400 mb-1">Arrived Facility</div>
            <div className="text-xs font-semibold text-gray-700">Mon, Mar 02, 2026 | 08:56 AM</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-3xl font-black text-blue-700">1</div>
            <div className="text-xs text-blue-500 font-semibold">Day</div>
            <div className="text-xs text-gray-500">{patient.gender === "female" ? "Female" : "Male"} Ophthalmology</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Doctor In Charge</div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
             <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <i className="fa fa-user" aria-hidden="true"></i>
                <span className="hidden md:block">{currentUser.name}</span>
                <span className="text-xs text-gray-400 capitalize ml-1">({currentUser.role})</span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800 leading-tight">{patient.doctor}</div>
                <div className="text-xs text-gray-400">Doctor In Charge</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">Diagnosis</div>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-2 mb-2">
              <div className="text-xs font-bold text-gray-700">{diagnosis || "Not set"}</div>
            </div>
            <input className="w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Update diagnosis..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </div>
          {bmi && (
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
              <div className="text-xs text-gray-400 mb-1">BMI (Auto-calculated)</div>
              <div className="text-2xl font-black text-gray-800">{bmi}</div>
              {bmiInfo && <div className={`text-xs font-bold mt-1 ${bmiInfo.color}`}>{bmiInfo.label}</div>}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 space-y-4">

          {/* VITALS ENTRY CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-white">
              <div>
                <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  🩺 Patient Vitals Entry
                  {saved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Saved</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Nurse enters all measurements — green = normal · red = high · yellow = low
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                <BPCard sys={bpSys} dia={bpDia} onChange={handleBPChange} saved={saved} />
                {VITAL_FIELDS.map((field) => (
                  <VitalCard key={field.key} field={field} value={vitals[field.key]} onChange={handleVitalChange} saved={saved} />
                ))}
              </div>

              {/* Normal ranges reference */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Normal Ranges</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-gray-500">
                  <span> Temp: 36.1–37.2°C</span>
                  <span> BP: 90/60–140/90 mmHg</span>
                  <span> Pulse: 60–100 bpm</span>
                  <span> Resp: 12–20 cpm</span>
                  <span> SpO₂: ≥95%</span>
                  <span> Sugar: 70–140 mg/dL</span>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-gray-400">
                  Recorded by: <span className="font-semibold text-gray-600">Nurse Current User</span>
                  {" · "}{new Date().toLocaleString()}
                </div>
                <button onClick={handleSaveVitals} disabled={saving}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition shadow-md
                    ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}>
                  {saving ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg> Saving...</>
                  ) : " Save Vitals"}
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {["doctor", "nurse"].map((t) => (
                <button key={t} onClick={() => setNoteTab(t)}
                  className={`flex-1 py-3 text-sm font-semibold capitalize transition ${noteTab === t ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500" : "text-gray-500 hover:bg-gray-50"}`}>
                  {t === "doctor" ? "🩺 Doctor's Notes" : "💉 Nurse's Notes"}
                </button>
              ))}
            </div>
            <div className="p-4">
              {noteTab === "doctor" ? (
                <>
                  {doctorNotes.length === 0 && <div className="text-xs text-gray-400 mb-3">No doctor notes yet.</div>}
                  {doctorNotes.map((n, i) => (
                    <div key={i} className="mb-4 border-l-4 border-blue-400 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{n.author}</span>
                        <span className="text-xs text-gray-400"> {n.time}</span>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{n.content}</pre>
                    </div>
                  ))}
                  <textarea className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mt-2"
                    rows={4} placeholder="Add doctor's note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                  <button onClick={addNote} className="mt-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition font-semibold">Save Note</button>
                </>
              ) : (
                <>
                  {nurseNotes.length === 0 && <div className="text-xs text-gray-400 mb-3">No nurse notes yet.</div>}
                  {nurseNotes.map((n, i) => (
                    <div key={i} className="mb-4 border-l-4 border-pink-400 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">{n.author}</span>
                        <span className="text-xs text-gray-400"> {n.time}</span>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{n.content}</pre>
                    </div>
                  ))}
                  <textarea className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none mt-2"
                    rows={4} placeholder="Add nurse's note..." value={newNurseNote} onChange={(e) => setNewNurseNote(e.target.value)} />
                  <button onClick={addNurseNote} className="mt-2 bg-pink-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-pink-600 transition font-semibold">Save Note</button>
                </>
              )}
            </div>
          </div>

          {/* Rx / Lab / etc */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {RX_TABS.map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${activeTab === t.id ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500" : "text-gray-500 hover:bg-gray-50"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {activeTab === "rx" && (
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 transition">+ Add</button>
                    <button className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition">+ Dispense From My Shelf</button>
                    <button className="bg-gray-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-600 transition">⚙ Manage List</button>
                  </div>
                  {patient.rx.length === 0 && <div className="text-xs text-gray-400">No prescriptions yet.</div>}
                  {patient.rx.map((group, gi) => (
                    <div key={gi} className="mb-3">
                      <div className="text-xs font-bold text-blue-600 mb-2"> {group.date}</div>
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-center justify-between py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-700">{item.name}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "lab"         && <div className="text-xs text-gray-400">No lab requests yet.</div>}
              {activeTab === "diagnostics" && <div className="text-xs text-gray-400">No diagnostic requests yet.</div>}
              {activeTab === "services"    && <div className="text-xs text-gray-400">No medical services added yet.</div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TriagePage;
