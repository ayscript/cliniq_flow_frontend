// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PatientProvider } from "./components/PatientContext";
import NurseDashboard  from "./pages/NurseDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PatientProvider>
      <NurseDashboard />
    </PatientProvider>
  </React.StrictMode>
);