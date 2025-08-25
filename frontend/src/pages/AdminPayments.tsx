import { useEffect, useState } from "react";

const API =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (process.env as any).REACT_APP_API_BASE_URL ||
  "http://localhost:5001/api";

type OrderItem = {
  name: string;
  qty: number;
  price?: number;
};

type Customer = {
  name: string;
  phone: string;
};

type Order = {
  _id: string;
  shortId: string;
  items: OrderItem[];
  total: number;
  payment: string;
  status: string;
  customer: Customer;
  createdAt: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("Unexpected response:", data);
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading orders...</p>;

  if (orders.length === 0) {
    return <p style={{ padding: "1rem" }}>No orders found.</p>;
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>📦 Order History</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thStyle}>Short ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Payment</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td style={tdStyle}>{o.shortId}</td>
              <td style={tdStyle}>
                {o.customer?.name} ({o.customer?.phone})
              </td>
              <td style={tdStyle}>{o.payment}</td>
              <td style={tdStyle}>
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    {i.qty} × {i.name} ({i.price}€)
                  </div>
                ))}
              </td>
              <td style={tdStyle}>{o.total.toFixed(2)} €</td>
              <td style={tdStyle}>
                {new Date(o.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
};
