// 
// src/components/PatientContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const PatientContext = createContext();

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients();
      setPatients(data);
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