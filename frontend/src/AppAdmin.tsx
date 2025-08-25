import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminReservations from "./pages/AdminReservations";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppAdmin() {
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, paddingTop: 72 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          <Route
            path="/admin/login"
            element={
              isAdminLoggedIn ? <Navigate to="/admin" replace /> : <AdminLogin />
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute>
                <AdminReservations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
