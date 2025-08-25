import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (process.env as any).REACT_APP_API_BASE_URL ||
  "http://localhost:5000/api";

type Status = "pending" | "confirmed" | "cancelled";
export type AdminReservation = {
  _id: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: Status;
  createdAt?: string;
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<Record<string, string>>({});
  const navigate = useNavigate();

const fetchReservations = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${API}/reservations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // backend returns { reservations: [...] }
    setReservations(data.reservations || []);
  } catch (e: any) {
    alert(e?.message || "Failed to load reservations");
    setReservations([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchReservations();
    const t = setInterval(fetchReservations, 20000);
    return () => clearInterval(t);
  }, []);

  const patch = async (id: string, status: Status) => {
  const res = await fetch(`${API}/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      msg = (await res.json())?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};
  const withBusy =
    (id: string, label: string, fn: () => Promise<any>) => async () => {
      try {
        setBusy((b) => ({ ...b, [id]: label }));
        await fn();
        await fetchReservations();
      } catch (e: any) {
        alert(e?.message || "Action failed");
      } finally {
        setBusy((b) => {
          const { [id]: _ignore, ...rest } = b;
          return rest;
        });
      }
    };

const accept = (r: AdminReservation) =>
  withBusy(r._id, "accepting", () => patch(r._id, "confirmed"));

const reject = (r: AdminReservation) =>
  withBusy(r._id, "rejecting", () => patch(r._id, "cancelled"));


  const pending = reservations.filter((r) => r.status === "pending");
  const accepted = reservations.filter((r) => r.status === "confirmed");
  const rejected = reservations.filter((r) => r.status === "cancelled");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin — Reservations</h1>
          <button
            onClick={fetchReservations}
            disabled={loading}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: loading ? "#f9fafb" : "white",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Refreshing…" : "Up to date"}
          </button>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#ef4444",
            color: "white",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <Section title="Pending Reservations" count={pending.length}>
        {pending.map((r) => (
          <Card key={r._id} r={r}>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button onClick={accept(r)} disabled={!!busy[r._id]} style={btnPrimary}>
                {busy[r._id] === "accepting" ? "Accepting…" : "Accept"}
              </button>
              <button onClick={reject(r)} disabled={!!busy[r._id]} style={btnGhost}>
                {busy[r._id] === "rejecting" ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </Card>
        ))}
        {pending.length === 0 && <Empty text="No pending reservations." />}
      </Section>

      <Section title="Accepted Reservations" count={accepted.length}>
        {accepted.map((r) => (
          <Card key={r._id} r={r} />
        ))}
        {accepted.length === 0 && <Empty text="No accepted reservations." />}
      </Section>

      <Section title="Rejected Reservations" count={rejected.length}>
        {rejected.map((r) => (
          <Card key={r._id} r={r} />
        ))}
        {rejected.length === 0 && <Empty text="No rejected reservations." />}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
        <span style={{ color: "#6b7280", fontSize: 14 }}>{count} reservations</span>
      </div>
      {children}
    </section>
  );
}

function Card({ r, children }: { r: AdminReservation; children?: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        background: "#fafafa",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {r.name} ({r.phone})
      </div>
      <div style={{ color: "#374151", fontSize: 14 }}>
        Guests: {r.guests} {dot}
        Date: {r.date} {dot}
        Time: {r.time}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ color: "#6b7280", fontSize: 14, padding: "10px 4px" }}>{text}</div>;
}

const dot = <span style={{ margin: "0 6px" }}>•</span>;

const btnBase: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
  border: "1px solid transparent",
};
const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#111827",
  color: "white",
};
const btnGhost: React.CSSProperties = {
  ...btnBase,
  background: "white",
  color: "#111827",
  border: "1px solid #e5e7eb",
};
