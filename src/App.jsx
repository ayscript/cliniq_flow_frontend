import NurseDashboard from "./pages/NurseDashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RecordOfficerDasboard from "./pages/RecordOfficerDasboard";
import DoctorsDashboard from "./pages/DoctorsDashboard";
import { Users } from "./pages/Admin/Users";

// Role-based redirect mapping
const getRoleBasedRoute = (role) => {
  const roleRoutes = {
    admin: "/dashboard",
    nurse: "/nurse-dashboard",
    record_officer: "/record-officer",
    doctor: "/doctor-dashboard",
  };
  return roleRoutes[role] || "/";
};

function App() {
  const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    console.log(user)

    if (loading)
      return (
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      );

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
  };

  const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading)
      return (
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      );

    const userRole = user?.user_metadata?.role;
    
    if (!allowedRoles.includes(userRole)) {
      const redirectUrl = getRoleBasedRoute(userRole);
      return <Navigate to={redirectUrl} replace />;
    }

    return children;
  };

  const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    
    if (user) {
      const userRole = user?.user_metadata?.role;
      const redirectUrl = getRoleBasedRoute(userRole);
      return <Navigate to={redirectUrl} replace />;
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
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <Layout />
                </RoleProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route
              path="/nurse-dashboard"
              element={
                <RoleProtectedRoute allowedRoles={["nurse"]}>
                  <NurseDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/record-officer"
              element={
                <RoleProtectedRoute allowedRoles={["record_officer"]}>
                  <RecordOfficerDasboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <RoleProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorsDashboard />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
