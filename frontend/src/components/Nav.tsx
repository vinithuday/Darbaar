
import { Link, useLocation } from "react-router-dom";

type Props = {
  cartCount?: number;
};

export default function Nav({ cartCount = 0 }: Props) {
  const location = useLocation();
  const port = window.location.port;

  const isAdmin = port === "3001";

  const items = isAdmin
    ? [
      { label: "Orders", path: "/admin/orders" },
        { label: "Reservations", path: "/admin/reservations" },
         { label: "Payments", path: "/admin/payments" }, 
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Menu", path: "/menu" },
        { label: "Checkout", path: "/checkout" },
        { label: "Track", path: "/track" },
        { label: "Reserve", path: "/reserve" },
        { label: "Contact", path: "/contact" },
      ];

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
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: "100%",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to={isAdmin ? "/admin" : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="/images/DarbaarLogo.png"
            alt="Darbaar Restaurant Logo"
            style={{ height: 40, width: "auto", display: "block" }}
          />
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowX: "auto",
            flexGrow: 1,
            gap: 40,
          }}
        >
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                fontWeight: 600,
                padding: "8px 12px",
                color:
                  location.pathname === item.path ? "#111827" : "#374151",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!isAdmin && (
          <Link
            to="/checkout"
            style={{
              background: "#6f6248",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 6,
              fontWeight: 700,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        )}
      </div>
    </header>
  );
}
