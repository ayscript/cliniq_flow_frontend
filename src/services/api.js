// src/services/api.js  ← single place for all API calls
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const api = {
  getPatients:       ()           => fetch(`${BASE_URL}/patients`,          { headers: authHeaders() }).then(r => r.json()),
  getPatient:        (id)         => fetch(`${BASE_URL}/patients/${id}`,     { headers: authHeaders() }).then(r => r.json()),
  createPatient:     (data)       => fetch(`${BASE_URL}/patients`,           { method: "POST",  headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  updatePatient:     (id, data)   => fetch(`${BASE_URL}/patients/${id}`,     { method: "PATCH", headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  saveVitals:        (id, vitals) => fetch(`${BASE_URL}/patients/${id}/vitals`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(vitals) }).then(r => r.json()),
  addNote:           (id, note)   => fetch(`${BASE_URL}/patients/${id}/notes`,  { method: "POST",  headers: authHeaders(), body: JSON.stringify(note)  }).then(r => r.json()),
  addRx:             (id, rx)     => fetch(`${BASE_URL}/patients/${id}/rx`,     { method: "POST",  headers: authHeaders(), body: JSON.stringify(rx)    }).then(r => r.json()),
  getDoctors:        ()           => fetch(`${BASE_URL}/doctors`,            { headers: authHeaders() }).then(r => r.json()),
  toggleDoctorAvail: (id, avail)  => fetch(`${BASE_URL}/doctors/${id}`,      { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ available: avail }) }).then(r => r.json()),
};

export default api;