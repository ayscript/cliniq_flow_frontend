// import { useEffect, useState } from "react"

// function ActiveQueue() {
//   const [queue, setQueue] = useState([])

//   useEffect(() => {
//     fetch("http://localhost:8000/queue")
//       .then(res => res.json())
//       .then(data => setQueue(data))
//   }, [])

//   const sendToDoctor = (id) => {
//     fetch(`http://localhost:8000/send_to_doctor/${id}`, {
//       method: "PUT"
//     })
//       .then(res => res.json())
//       .then(() => {
//         alert("Sent to doctor")
//       })
//   }

//   return (
//     <div>
//       {queue.map((patient) => (
//         <div key={patient.id} className="p-4 border mb-2 rounded">
//           <p><strong>Name:</strong> {patient.first_name}</p>
//           <p><strong>Priority:</strong> {patient.priority_level}</p>

//           <button
//             onClick={() => sendToDoctor(patient.id)}
//             className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
//           >
//             Send to Doctor
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default ActiveQueue


import { useEffect, useState } from "react";

function ActiveQueue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Mock data instead of fetch
    setQueue([
      { id: 1, first_name: "Patient A", priority_level: "High" },
      { id: 2, first_name: "Patient B", priority_level: "Medium" },
      { id: 3, first_name: "Patient C", priority_level: "Low" },
    ]);
  }, []);

  const sendToDoctor = (id) => {
    alert(`Sent patient ${id} to doctor`);
  };

  return (
    <div>
      {queue.map((patient) => (
        <div key={patient.id} className="p-4 border mb-2 rounded">
          <p><strong>Name:</strong> {patient.first_name}</p>
          <p><strong>Priority:</strong> {patient.priority_level}</p>

          <button
            onClick={() => sendToDoctor(patient.id)}
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
          >
            Send to Doctor
          </button>
        </div>
      ))}
    </div>
  );
}

export default ActiveQueue;
