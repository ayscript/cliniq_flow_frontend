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
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import NurseDashBoard from "./pages/NurseDashBoard";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DoctorsDashboard from "./pages/DoctorsDashboard";

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // Renders the child route (Layout)
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard/login" element={<LoginPage />} />
            </Route>
            <Route path="/doctor" element={<Layout />}>
              <Route index element={<DoctorsDashboard />} />
            </Route>
          <Route element={<ProtectedRoute />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
