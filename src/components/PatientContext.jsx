import { createContext, useContext, useEffect, useState } from "react";

const PatientContext = createContext();

const BASE_URL = "http://127.0.0.1:8000";

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/record-officer/patients`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
      setError("Could not load patients. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount, then every 30 seconds to stay in sync with colleague
  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PatientContext.Provider value={{ patients, setPatients, loading, error, refetch: fetchPatients }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  return useContext(PatientContext);
}
