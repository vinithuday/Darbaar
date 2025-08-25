import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItemStyle = (path: string) => ({
    padding: "10px 16px",
    fontWeight: location.pathname.startsWith(path) ? 700 : 500,
    color: location.pathname.startsWith(path) ? "#6f6248" : "#374151",
    textDecoration: "none",
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        background: "#f9f6ef",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <nav style={{ display: "flex", gap: 20 }}>
        <Link to="/admin/orders" style={navItemStyle("/admin/orders")}>
          Orders
        </Link>
        <Link to="/admin/reservations" style={navItemStyle("/admin/reservations")}>
          Reservations
        </Link>
        <Link to="/admin/payments" style={navItemStyle("/admin/payments")}>
          Payments
        </Link>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
