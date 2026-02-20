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
import DoctorsDashboard from "./pages/DoctorsDashboard";

function App() {
  const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading)
      return (
        <div className="h-screen w-full flex items-center justify-center">
          Loading...
        </div>
      );

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
  };

  const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;

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

          <Route path="/nurseDashboard" element={<NurseDashboard />} />
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>

            <Route path="/doctor" element={<Layout />}>
              <Route index element={<DoctorsDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
