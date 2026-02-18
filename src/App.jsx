import NurseDashboard from "./pages/NurseDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<NurseDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}