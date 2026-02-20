// import { useState } from "react";
// import NurseIntakeForm from "../components/NurseIntakeForm";
// import TriageResult from "../components/TriageResult";
// import ActiveQueue from "../components/ActiveQueue";

// function NurseDashboard() {
//   const [triageResult, setTriageResult] = useState(null);

//   return (
//     <div className="grid grid-cols-3 gap-6 p-6">
//       <NurseIntakeForm onSubmit={setTriageResult} />
//       <TriageResult result={triageResult} />
//       <ActiveQueue />
//     </div>
//   );
// }

// export default NurseDashboard;

// import { useState } from "react";
// import NurseIntakeForm from "../components/NurseIntakeForm";
// import TriageResult from "../components/TriageResult";
// import ActiveQueue from "../components/ActiveQueue";

// function NurseDashboard() {
//   const [patients, setPatients] = useState([]);
//   const [triageResult, setTriageResult] = useState(null);

//   const handleNewPatient = (patientData) => {
//     setTriageResult(patientData);

//     setPatients((prev) => [
//       ...prev,
//       { id: Date.now(), ...patientData },
//     ]);
//   };

//   const handleSendToDoctor = (id) => {
//     setPatients((prev) =>
//       prev.filter((patient) => patient.id !== id)
//     );
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
//       <NurseIntakeForm onSubmit={handleNewPatient} />
//       <TriageResult result={triageResult} />
//       <ActiveQueue
//         patients={patients}
//         onSendToDoctor={handleSendToDoctor}
//       />
//     </div>
//   );
// }

// export default NurseDashboard;


import { useState } from "react";
import NurseIntakeForm from "../components/NurseIntakeForm";
import TriageResult from "../components/TriageResult";
import ActiveQueue from "../components/ActiveQueue";

function NurseDashboard() {
  const [patients, setPatients] = useState([]);
  const [triageResult, setTriageResult] = useState(null);

  const handleNewPatient = (patientData) => {
    const newPatient = { id: Date.now(), ...patientData };
    setTriageResult(newPatient);
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleSendToDoctor = (id) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
    setTriageResult(null); // ✅ clear triage result after sending
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
      <NurseIntakeForm onSubmit={handleNewPatient} />
      <TriageResult result={triageResult} onSendToDoctor={handleSendToDoctor} />
      <ActiveQueue patients={patients} onSendToDoctor={handleSendToDoctor} />
    </div>
  );
}

export default NurseDashboard;
