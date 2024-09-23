import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminLogin } from "./pages/Auth/AdminLogin";
import { ClientLogin } from "./pages/Auth/ClientLogin";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { ClientDashboard } from "./pages/Client/ClientDashboard";
import { PrivateRoute } from "./components/common/PrivateRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import Unauthorized from "./pages/Auth/Unauthorized";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "client") {
      navigate("/client");
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["client"]} />}>
        <Route path="/client" element={<ClientDashboard />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
