const ConfirmModal = ({ patient, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
      
        </div>
        <div>
          <div className="font-bold text-gray-800">Start Triage</div>
          <div className="text-xs text-gray-500">Outpatient · Ophthalmology</div>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-1">You are about to begin triage for:</p>
      <p className="font-bold text-gray-900 mb-4 text-base">{patient.name}</p>
      <p className="text-xs text-gray-500 mb-6">
        PID: {patient.pid} · ENC: {patient.enc}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition"
        >
          OK, Proceed
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
