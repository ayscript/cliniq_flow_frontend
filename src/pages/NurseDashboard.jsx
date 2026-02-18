import { useState } from "react";
import NurseIntakeForm from "../components/NurseIntakeForm";
import TriageResult from "../components/TriageResult";

export default function NurseDashboard() {
  const [triageResult, setTriageResult] = useState(null);

  function handleSubmit(triageData) {
    setTriageResult(triageData);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NurseIntakeForm onSubmit={handleSubmit} />
      <TriageResult result={triageResult} />
    </div>
  );
}
