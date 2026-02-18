import { useState } from "react";
import VoiceButton from "./VoiceButton";

export default function NurseIntakeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    vitals: "",
    symptoms: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className=" bg-white rounded-lg shadow p-6 items-center ">
      <h2 className="font-semibold text-lg mb-4">Nurse Intake Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="age"
          placeholder="Age"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        {/* Sex Selector */}
<div className="mt-4">
  <label className="block font-medium mb-1">Sex</label>

  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="sex"
        value="male"
        className="accent-teal-600"
      />
      Male
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="sex"
        value="female"
        className="accent-teal-600"
      />
      Female
    </label>
  </div>
</div>


        <input
          name="weight"
          placeholder="Weight (kg)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        {/* Vital Signs Section */}

        <h3 className="font-semibold text-gray-800 mb-3">
            Vital Signs
        </h3>

        

        <input
          name="vitals"
          placeholder="Vitals (Temp, BP, Pulse)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <textarea
          name="symptoms"
          placeholder="Enter symptoms..."
          className="w-full border p-2 rounded"
          rows="3"
          onChange={handleChange}
        />

        <VoiceButton />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Submit Intake
        </button>
      </form>
    </div>
  );
}
