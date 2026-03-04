import { useState } from "react";

const SendDoctorModal = ({ patient, doctors, onSend, onClose }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="font-bold text-gray-800 mb-1 text-base">Send to Doctor</div>
        <div className="text-xs text-gray-500 mb-4">{patient.name}</div>

        <div className="space-y-2 mb-5">
          {doctors
            .filter((d) => d.available)
            .map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                  selected === d.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="doctor"
                  className="accent-blue-500"
                  checked={selected === d.id}
                  onChange={() => setSelected(d.id)}
                />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{d.name}</div>
                  <div className="text-xs text-gray-500">
                    {d.room} · Available
                  </div>
                </div>
              </label>
            ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => onSend(selected)}
            className={`flex-1 py-2 rounded-xl text-white text-sm font-bold transition ${
              selected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendDoctorModal;
