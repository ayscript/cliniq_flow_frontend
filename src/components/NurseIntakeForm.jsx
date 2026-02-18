import { useState } from "react";
import VoiceButton from "./VoiceButton";

export default function NurseIntakeForm({ onSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    temperature: "",
    respiratoryRate: "",
    pulse: "",
    symptoms: "",
  });

  const [isEstimated, setIsEstimated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const runTriage = () => {
    const temp = Number(formData.temperature);
    const rr = Number(formData.respiratoryRate);
    const symptoms = formData.symptoms.toLowerCase();

    let level = "GREEN";
    let color = "green";
    let reasons = [];

    if (temp >= 39) {
      level = "RED";
      color = "red";
      reasons.push("Very high fever detected");
    }

    if (rr >= 30) {
      level = "RED";
      color = "red";
      reasons.push("High respiratory rate");
    }

    if (symptoms.includes("difficulty breathing")) {
      level = "RED";
      color = "red";
      reasons.push("Difficulty breathing reported");
    }

    if (level !== "RED" && temp >= 38) {
      level = "YELLOW";
      color = "yellow";
      reasons.push("Fever detected");
    }

    if (reasons.length === 0) {
      reasons.push("Vitals within normal range");
    }

    onSubmit({ level, color, reasons });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Nurse Intake Form</h2>
      </div>

      {/* Age */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Age</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Sex */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sex</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="sex" className="accent-teal-600" />
            Male
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="sex" className="accent-teal-600" />
            Female
          </label>
        </div>
      </div>

      {/* Weight */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsEstimated(!isEstimated)}
          className="flex items-center gap-2 mt-6 cursor-pointer"
        >
          <div className={`w-10 h-5 rounded-full relative transition-colors ${
            isEstimated ? "bg-teal-500" : "bg-gray-300"
          }`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
              isEstimated ? "right-1" : "left-1"
            }`}></div>
          </div>
          <span className="text-sm">Estimated</span>
        </button>
      </div>

      {/* Vital Signs */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Vital Signs</h3>

        {/* Temperature */}
        <div className="mb-3 flex items-center gap-2">
          <label className="w-40 text-sm">Temperature:</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
          <span className="text-sm">°C</span>
        </div>

        {/* Respiratory Rate */}
        <div className="mb-3 flex items-center gap-2">
          <label className="w-40 text-sm">Respiratory Rate:</label>
          <input
            type="number"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
          <span className="text-sm">breaths/min</span>
        </div>

        {/* Pulse */}
        <div className="mb-3 flex items-center gap-2">
          <label className="w-40 text-sm">Pulse:</label>
          <input
            type="number"
            name="pulse"
            value={formData.pulse}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
          <span className="text-sm">bpm</span>
        </div>

        {/* Blood Pressure */}
        <div className="flex items-center gap-2">
          <label className="w-40 text-sm">Blood Pressure:</label>
          <input
            type="number"
            placeholder=""
            className="w-24 border rounded px-3 py-2"
          />
          <span>/</span>
          <input
            type="number"
            className="w-24 border rounded px-3 py-2"
          />
          <span className="text-sm">mmHg</span>
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Symptoms</label>
        <textarea
          rows="3"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="Enter symptoms..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Voice Input */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 border rounded py-2 mb-4"
      >
        🎤 Voice Input
      </button>

      {/* Submit */}
      <button
        type="button"
        onClick={runTriage}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Submit Intake
      </button>

      {/* Triage Result */}
      {/* {triageResult && (
        <div
          className={`mt-6 p-4 rounded text-white ${
            triageResult.color === "red"
              ? "bg-red-600"
              : triageResult.color === "yellow"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          <h3 className="font-bold text-lg mb-2">
            {triageResult.level === "RED"
              ? "Emergency"
              : triageResult.level === "YELLOW"
              ? "Urgent"
              : "Stable"}
          </h3>

          <ul className="list-disc ml-5 text-sm">
            {triageResult.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
