import { useState } from "react";
import NurseIntakeForm from "../components/NurseIntakeForm";
import TriageResult from "../components/TriageResult";
import ActiveQueue from "../components/ActiveQueue";

function NurseDashboard() {
  const [triageResult, setTriageResult] = useState(null);

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <NurseIntakeForm onSubmit={setTriageResult} />
      <TriageResult result={triageResult} />
      <ActiveQueue />
    </div>
  );
}

export default NurseDashboard;

