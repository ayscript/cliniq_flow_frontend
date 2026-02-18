export default function TriageResult({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-teal-600 h-2"></div>
        <div className="p-6 text-gray-400 text-center">
          Triage result will appear here
        </div>
      </div>
    );
  }

  const styles = {
    RED: "bg-red-600 text-white",
    YELLOW: "bg-yellow-500 text-black",
    GREEN: "bg-green-600 text-white",
  };

  const labels = {
    RED: "EMERGENCY",
    YELLOW: "URGENT",
    GREEN: "STABLE",
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Top teal bar */}
      <div className="bg-teal-600 h-2"></div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Rule-based Triage Result</h2>

        {/* Status block */}
        <div className={`py-6 text-center mb-6 ${styles[result.level]}`}>
          <h3 className="text-4xl font-bold">{labels[result.level]}</h3>
        </div>

        {/* Explanation section */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Explanation:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {result.reasons && result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Send to Doctor button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
          Send to Doctor
        </button>
      </div>
    </div>
  );
}
