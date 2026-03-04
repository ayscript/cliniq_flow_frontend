import GenderIcon from "./GenderIcon";
import StatusBadge from "./StatusBadge";

const QueuePage = ({
  patients,
  filtered,
  searchTerm,
  setSearchTerm,
  doctors,
  onTriageClick,
  onSendDoctorClick,
}) => {
  const awaitingTriage = patients.filter((p) => p.status === "Awaiting Triage").length;
  const seen = patients.filter((p) => p.status === "Seen").length;
  const inCons = patients.filter((p) => p.status === "In Cons").length;
  const awaitingCons = patients.filter((p) => p.status === "Awaiting Cons").length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <div className="lg:w-56 bg-gray-900 text-white flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-700">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-black text-white text-sm">
            C+
          </div>
          <span className="font-bold text-sm hidden lg:block">CarePlus</span>
        </div>

        {/* Hours */}
        <div className="p-4 border-b border-gray-700">
          <div className="text-base font-black leading-tight text-white">12.30 - 15.00,</div>
          <div className="text-base font-black leading-tight text-white">19.00 - 21.00</div>
          <div className="text-sm font-bold text-gray-300">Hour Clinic</div>
          <div className="text-xs text-gray-400 mt-2">Mon, Mar 02, 2026</div>
          <div className="mt-3 text-xs font-bold text-gray-300 uppercase tracking-widest">
            Total Visits - {patients.length}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-700">
          <div className="bg-orange-500 bg-opacity-20 rounded-xl p-2 text-center">
            <div className="text-2xl font-black text-orange-400">{awaitingTriage}</div>
            <div className="text-xs text-orange-300 leading-tight">Awaiting Triage</div>
          </div>
          <div className="bg-yellow-500 bg-opacity-20 rounded-xl p-2 text-center">
            <div className="text-2xl font-black text-yellow-400">{awaitingCons}</div>
            <div className="text-xs text-yellow-300 leading-tight">Awaiting Cons</div>
          </div>
          <div className="bg-blue-500 bg-opacity-20 rounded-xl p-2 text-center">
            <div className="text-2xl font-black text-blue-400">{inCons}</div>
            <div className="text-xs text-blue-300 leading-tight">In Cons</div>
          </div>
          <div className="bg-green-500 bg-opacity-20 rounded-xl p-2 text-center">
            <div className="text-2xl font-black text-green-400">{seen}</div>
            <div className="text-xs text-green-300 leading-tight">Seen</div>
          </div>
        </div>

        {/* Doctors */}
        <div className="p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Doctors In Clinic
          </div>
          <div className="text-xs text-blue-400 mb-3">
            Uncheck doctors not currently available
          </div>
          <div className="space-y-2">
            {doctors.map((d, i) => (
              <div key={d.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      d.available ? "bg-green-400" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs text-gray-300 leading-tight">
                    {i + 1}. {d.name}
                  </span>
                </div>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-bold">
                  {d.room}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top nav */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-gray-100">
              <span className="text-gray-600 text-lg"></span>
            </button>
            <span className="font-bold text-gray-800 text-sm md:text-base">
              Outpatient 
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search keywords, PID, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-sm outline-none w-44 md:w-64"
              />
             <div className="text-4xl mb-3">
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
             </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
             <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
              <i className="fa fa-user" aria-hidden="true"></i>
              <span className="hidden md:block">{currentUser.name}</span>
              <span className="text-xs text-gray-400 capitalize ml-1">({currentUser.role})</span>
            </div>
              <span className="hidden md:block">Adedotun Rofiat-Doctor</span>
            </div>
          </div>
        </div>

        {/* Patient list */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
               Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-300 transition">
               Display Locations
            </button>
          </div>

          {filtered.map((patient, idx) => (
            <div
              key={patient.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="flex items-start gap-4 p-4">
                <div className="text-gray-400 font-bold text-lg w-6 flex-shrink-0">{idx + 1}.</div>
                <div className="text-gray-500 text-xs font-mono w-28 flex-shrink-0 mt-1">
                  {patient.time}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-base ${
                    patient.payIcon === "green" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  
                </div>

                {/* Patient info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-gray-900 text-sm md:text-base">
                      {patient.name}
                    </span>
                    <GenderIcon gender={patient.gender} />
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    👤 DOCTOR IN CHARGE:{" "}
                    <span className="font-semibold text-gray-700">{patient.doctor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                    <span>
                      <span className="font-bold text-blue-600">PID#:</span> {patient.pid}
                    </span>
                    <span>
                      <span className="font-bold text-blue-600">DOB⊕:</span> {patient.dob} -{" "}
                      {patient.age}
                    </span>
                    <span>
                      <span className="font-bold text-blue-600">ENC#:</span> {patient.enc}
                    </span>
                  </div>
                  {patient.nhis && (
                    <div className="text-xs text-gray-500 mb-2">
                      Awaiting Authorisation ·{" "}
                      <span className="font-bold text-gray-700">NHIS#:{patient.nhis}</span> (
                      {patient.plan}) · {patient.insurer}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {["Eye Examination", "Eye History", "History Report", "Optometric Assessment"].map(
                      (btn) => (
                        <button
                          key={btn}
                          className="text-xs px-3 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition font-medium"
                        >
                          {btn}
                        </button>
                      )
                    )}
                  </div>
                  {patient.assignedDoctor && (
                    <div className="mt-2 text-xs text-green-600 font-semibold">
                       Assigned to: {patient.assignedDoctor}
                    </div>
                  )}
                </div>

                {/* Right side actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {patient.status === "Awaiting Triage" ? (
                    <button
                      onClick={() => onTriageClick(patient)}
                      className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-full transition shadow"
                    >
                      Awaiting Triage
                    </button>
                  ) : (
                    <StatusBadge status={patient.status} />
                  )}
                  <button
                    onClick={() => onSendDoctorClick(patient)}
                    className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                  >
                     Send to Doctor
                  </button>
                  <button className="text-gray-300 hover:text-gray-500 transition text-xl">⌄</button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
             <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Search PID, name, ENC..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="px-3 py-1.5 text-sm outline-none w-40 md:w-56" 
                />
                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </div>
                            <div className="text-sm">No patients found for "{searchTerm}"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueuePage;
