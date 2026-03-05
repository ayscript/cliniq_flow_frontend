import React, { useState, useEffect } from "react";
import {
  Mic,
  Square,
  Save,
  RotateCcw,
  FileText,
  User,
  Activity,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const ConsultationRoom = ({ patient, onSave, onCancel }) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [audioChunks, setAudioChunks] = useState([]);
  const recorderRef = React.useRef(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [medOrderId, setMedOrderId] = useState(null);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  // Simple timer logic for the recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // cleanup mediaRecorder on unmount
  useEffect(() => {
    return () => {
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        rec.stop();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // handlers for medication actions
  const startRecording = async () => {
    setTimer(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          // also perform incremental transcription
          transcribeBlob(e.data);
        }
      };
      recorder.onstop = async () => {
        setAudioChunks(chunks);
        const blob = new Blob(chunks, { type: "audio/webm" });
        // convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result.split(",")[1];
          // send to backend ASR
          try {
            // send full recording as blob using multipart
            const auth_token = await (await import("../utils/uitils")).getToken();
            const form = new FormData();
            form.append("file", blob, "recording.webm");
            form.append("session_id", "frontend");
            form.append("chunk_index", "0");
            const r = await fetch("http://127.0.0.1:8000/translate/chunk", {
              method: "POST",
              headers: { Authorization: `Bearer ${auth_token}` },
              body: form,
            });
            if (r.ok) {
              const data = await r.json();
              setTranscript((prev) => prev + " " + (data.chunk_conversation || ""));
            } else {
              console.error("ASR full failed", r.status);
            }
          } catch (err) {
            console.error("ASR failed", err);
            alert("Transcription failed");
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("could not start recording", err);
      alert("Unable to access microphone");
    }
  };

  const stopRecording = () => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
    setIsRecording(false);
  };

  // send a small audio blob to backend for transcription and append result
  const transcribeBlob = async (blob) => {
    try {
      const form = new FormData();
      form.append("file", blob, "chunk.webm");
      form.append("session_id", "frontend");
      form.append("chunk_index", "0");
      const auth_token = await (await import("../utils/uitils")).getToken();
      const r = await fetch("http://127.0.0.1:8000/translate/chunk", {
        method: "POST",
        headers: { Authorization: `Bearer ${auth_token}` },
        body: form,
      });
      if (r.ok) {
        const data = await r.json();
        setTranscript((prev) => prev + " " + (data.chunk_conversation || ""));
      }
    } catch (err) {
      console.error("live ASR failed", err);
    }
  };
  const handleAcceptSuggestion = async () => {
    if (!patient?.id || !patient?.suggestion) return;
    try {
      const payload = {
        visit_id: String(patient.id),
        drug_name: patient.suggestion.drug_name,
        dose_mg_per_day: patient.suggestion.dose_mg_per_day,
        frequency_per_day: patient.suggestion.frequency_per_day,
        is_safe: patient.suggestion.is_safe,
        dose_check_result: patient.suggestion.dose_check_result,
      };
      const result = await api.post("/med-orders", payload);
      setOrderCreated(true);
      setMedOrderId(result.id || result.med_order_id || null);
    } catch (e) {
      console.error("failed to create med order", e);
      alert("Failed to create med order");
    }
  };

  const handleSubmitOverride = async () => {
    if (!medOrderId) return;
    try {
      const auth_token = await (await import("../utils/uitils")).getToken();
      const resp = await fetch(
        `http://127.0.0.1:8000/med-orders/${medOrderId}/override`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
            "X-Doctor-Id": user?.id || "",
          },
          body: JSON.stringify({ reason: overrideReason }),
        },
      );
      if (!resp.ok) throw new Error("status " + resp.status);
      const data = await resp.json();
      console.log("override result", data);
      alert("Override logged");
      setOverrideMode(false);
    } catch (e) {
      console.error("override failed", e);
      alert("Failed to log override");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      {/* Top Session Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
              {patient?.name || "Patient Consultation"}
            </h2>
            <p className="text-sm text-slate-500">
              Age: {patient?.Age} • ID: #{patient?.id}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg transition-all"
          >
            Cancel Session
          </button>
          <button
            onClick={() => onSave(transcript)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-green-100 transition-all"
          >
            <Save size={18} />
            FINISH & SAVE
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Left Column: Voice Recording & Transcription */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          {/* Voice Recorder Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Waveform Decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Activity size={300} strokeWidth={1} />
            </div>

            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? "bg-red-500 scale-110 shadow-xl shadow-red-200" : "bg-slate-100 text-slate-400"}`}
            >
              <Mic
                size={40}
                className={isRecording ? "text-white animate-pulse" : ""}
              />
            </div>

            <div className="mt-6 text-center z-10">
              <span className="text-4xl font-mono font-black text-slate-800 tracking-tighter">
                {formatTime(timer)}
              </span>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {isRecording
                  ? "Listening to patient notes..."
                  : "Click microphone to start recording"}
              </p>
            </div>

            <div className="mt-8 flex gap-4 z-10">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 transition-all"
                >
                  <Mic size={20} /> START RECORDING
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-8 py-3 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
                >
                  <Square size={20} /> STOP & PROCESS
                </button>
              )}
            </div>
          </div>

          {/* AI Transcription Area */}
          <div className="bg-white rounded-3xl flex-1 border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 italic">
                <RotateCcw size={16} className="text-blue-500" />
                AI Real-time Transcription
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase">
                Auto-Scribing
              </span>
            </div>
            <textarea
              className="flex-1 p-6 text-slate-700 leading-relaxed focus:outline-none resize-none bg-slate-50/30"
              placeholder="The consultation transcript will appear here automatically as you speak..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Clinical Quick Tasks */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-400">
              <CheckCircle2 size={20} />
              Session Checklist
            </h3>
            <ul className="space-y-4">
              {[
                "Review Medical History",
                "Check Vital Signs",
                "Symptom Discussion",
                "Prescription Update",
                "Next Appointment",
              ].map((task, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* dosage suggestion card */}
          {patient?.suggestion && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">
                AI Dosage Suggestion
              </h3>
              <p className="text-sm text-slate-600">
                Drug: {patient.suggestion.drug_name}
              </p>
              <p className="text-sm text-slate-600">
                Dose: {patient.suggestion.dose_mg_per_day} mg/day &middot;{" "}
                {patient.suggestion.frequency_per_day}/day
              </p>
              <p className="text-sm text-slate-600 mb-4">
                Safe: {patient.suggestion.is_safe ? "✅" : "⚠️"}
              </p>

              {!orderCreated ? (
                <button
                  onClick={handleAcceptSuggestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Accept Suggestion
                </button>
              ) : (
                <div>
                  <p className="text-xs text-green-600 mb-2">
                    Order created{medOrderId ? ` (ID: ${medOrderId})` : ""}
                  </p>
                  {!overrideMode ? (
                    <button
                      onClick={() => setOverrideMode(true)}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all"
                    >
                      Override
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="Reason for override"
                        className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={handleSubmitOverride}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      >
                        Submit Override
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" />
              Patient Vitals (Latest)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Blood Pressure
                </p>
                <p className="text-lg font-black text-slate-700">120/80</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Heart Rate
                </p>
                <p className="text-lg font-black text-slate-700">72 bpm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
