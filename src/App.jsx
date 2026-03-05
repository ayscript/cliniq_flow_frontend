import NurseDashboard from "./pages/NurseDashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RecordOfficerDasboard from "./pages/RecordOfficerDasboard";
import DoctorsDashboard from "./pages/DoctorsDashboard";
import { Users } from "./pages/Admin/Users";

function App() {
  const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading)
      return (
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      );

    if (!user) return <Navigate to="/login" replace />;

    // if the authenticated user does not have the admin role, redirect
    const role = user.user_metadata?.role || user.role;
    if (role && role !== "admin") {
      let dest = "/dashboard"; // fallback
      if (role === "nurse") dest = "/nurse-dashboard";
      else if (role === "doctor") dest = "/doctor-dashboard";
      else if (role === "record_officer" || role === "record officer")
        dest = "/record-officer";
      if (location.pathname !== dest) {
        return <Navigate to={dest} replace />;
      }
    }

    return <Outlet />;
  };

  const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) {
      // redirect users based on role so authenticated users don't land on login page
      const role = user.user_metadata?.role || user.role;
      let dest = "/dashboard"; // default admin
      if (role === "nurse") dest = "/nurse-dashboard";
      else if (role === "doctor") dest = "/doctor-dashboard";
      else if (role === "record_officer" || role === "record officer")
        dest = "/record-officer";
      return <Navigate to={dest} replace />;
    }

    return children;
  };

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
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
            <Route path="/record-officer" element={<RecordOfficerDasboard />} />
            <Route path="/doctor-dashboard" element={<DoctorsDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
