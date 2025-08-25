
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const API =
//   (import.meta as any).env?.VITE_API_BASE_URL ||
//   (process.env as any).REACT_APP_API_BASE_URL ||
//   "http://localhost:5000/api";

// type PayMethod = "cash" | "paypal" | "card";
// type Status = "pending" | "accepted" | "ready" | "collected" | "cancelled";

// type OrderItem = { name: string; qty: number; price?: number };
// type Customer = { name?: string; phone?: string };

// export type AdminOrder = {
//   _id: string;
//   shortId?: string;
//   items: OrderItem[];
//   total: number;
//   status: Status;
//   payment: PayMethod;
//   pickupTime?: string | null;
//   createdAt?: string;
//   updatedAt?: string;
//   customer?: Customer;
// };

// const euro = (n: number) =>
//   new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
//     Number(n) || 0
//   );

// const niceId = (o: AdminOrder) =>
//   (o.shortId && o.shortId.toUpperCase()) ||
//   (o._id && o._id.length >= 6 ? o._id.slice(-6).toUpperCase() : o._id);

// const dot = <span style={{ margin: "0 6px" }}>•</span>;

// export default function Admin() {
//   const [orders, setOrders] = useState<AdminOrder[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [busy, setBusy] = useState<Record<string, string>>({});
//   const [startIn, setStartIn] = useState<Record<string, number>>({});
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const navigate = useNavigate();


  

// useEffect(() => {
//   const token = localStorage.getItem("adminToken");
//   if (!token) {
//     navigate("/admin/login", { replace: true });
//   }
// }, [navigate]);


//   const pending = useMemo(() => orders.filter((o) => o.status === "pending"), [orders]);
//   const accepted = useMemo(() => orders.filter((o) => o.status === "accepted"), [orders]);
//   const ready = useMemo(() => orders.filter((o) => o.status === "ready"), [orders]);
//   const collected = useMemo(() => orders.filter((o) => o.status === "collected"), [orders]);
//   const cancelled = useMemo(() => orders.filter((o) => o.status === "cancelled"), [orders]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API}/orders`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (e: any) {
//       alert(e?.message || "Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/admin/login");
//   };

//   useEffect(() => {
//     audioRef.current = new Audio("/notification/NotificationSound.mp3");

//     const unlock = () => {
//       audioRef.current
//         ?.play()
//         .then(() => {
//           audioRef.current?.pause();
//           if (audioRef.current) audioRef.current.currentTime = 0;
//         })
//         .catch(() => {});
//       window.removeEventListener("click", unlock);
//     };
//     window.addEventListener("click", unlock);

//     fetchOrders();
//     const t = setInterval(fetchOrders, 20000);
//     return () => clearInterval(t);
//   }, []);

//   const patch = async (url: string, body?: any) => {
//     const res = await fetch(url, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: body ? JSON.stringify(body) : undefined,
//     });
//     if (!res.ok) {
//       let msg = `HTTP ${res.status}`;
//       try {
//         msg = (await res.json())?.message || msg;
//       } catch {}
//       throw new Error(msg);
//     }
//     return res.json();
//   };

//   const withBusy =
//     (id: string, label: string, fn: () => Promise<any>) => async () => {
//       try {
//         setBusy((b) => ({ ...b, [id]: label }));
//         await fn();
//         await fetchOrders();
//       } catch (e: any) {
//         alert(e?.message || "Action failed");
//       } finally {
//         setBusy((b) => {
//           const { [id]: _ignore, ...rest } = b;
//           return rest;
//         });
//       }
//     };

//   const accept = (o: AdminOrder) =>
//     withBusy(o._id, "accepting", async () => {
//       await patch(`${API}/orders/${o.shortId}`, { status: "accepted" });
//     });

//   const markReady = (o: AdminOrder) =>
//     withBusy(o._id, "readying", async () => {
//       await patch(`${API}/orders/${o.shortId}`, { status: "ready" });
//     });

//   const collect = (o: AdminOrder) =>
//     withBusy(o._id, "collecting", async () => {
//       await patch(`${API}/orders/${o.shortId}`, { status: "collected" });
//     });

//   const cancel = (o: AdminOrder) =>
//     withBusy(o._id, "cancelling", async () => {
//       await patch(`${API}/orders/${o.shortId}`, { status: "cancelled" });
//     });
    

//   return (
//     <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
//       <header
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 16,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
//           <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin — Orders</h1>
//           <button
//             onClick={fetchOrders}
//             disabled={loading}
//             style={{
//               padding: "6px 10px",
//               borderRadius: 10,
//               border: "1px solid #e5e7eb",
//               background: loading ? "#f9fafb" : "white",
//               cursor: loading ? "default" : "pointer",
//             }}
//             title="Refresh"
//           >
//             {loading ? "Refreshing…" : "Up to date"}
//           </button>
//         </div>

//         <button
//           onClick={handleLogout}
//           style={{
//             padding: "8px 12px",
//             borderRadius: 8,
//             background: "#ef4444",
//             color: "white",
//             fontWeight: 600,
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Logout
//         </button>
//       </header>

//       <OrderSection title="Pending" count={pending.length}>
//         {pending.map((o) => (
//           <OrderCard key={o._id} order={o} right={euro(o.total)}>
//             <OrderMeta o={o} />
//             <Stepper status={o.status} />
//             <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
//               <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#374151" }}>
//                 Start in
//                 <input
//                   type="number"
//                   min={0}
//                   value={startIn[o._id] ?? 3}
//                   onChange={(e) =>
//                     setStartIn((m) => ({ ...m, [o._id]: Number(e.target.value) }))
//                   }
//                   style={{
//                     width: 64,
//                     padding: "6px 8px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                   }}
//                 />
//                 min
//               </label>

//               <button onClick={accept(o)} disabled={!!busy[o._id]} style={btnPrimary}>
//                 {busy[o._id] === "accepting" ? "Accepting…" : "Accept order"}
//               </button>

//               <button onClick={cancel(o)} disabled={!!busy[o._id]} style={btnGhost}>
//                 {busy[o._id] === "cancelling" ? "Cancelling…" : "Cancel"}
//               </button>
//             </div>
//           </OrderCard>
//         ))}
//         {pending.length === 0 && <EmptyRow text="No pending orders." />}
//       </OrderSection>

//       <OrderSection title="Accepted / Preparing" count={accepted.length}>
//         {accepted.map((o) => (
//           <OrderCard key={o._id} order={o} right={euro(o.total)}>
//             <OrderMeta o={o} />
//             <Stepper status={o.status} />
//             <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
//               <button onClick={markReady(o)} disabled={!!busy[o._id]} style={btnPrimary}>
//                 {busy[o._id] === "readying" ? "Updating…" : "Mark ready for collection"}
//               </button>

//               <button onClick={cancel(o)} disabled={!!busy[o._id]} style={btnGhost}>
//                 {busy[o._id] === "cancelling" ? "Cancelling…" : "Cancel"}
//               </button>
//             </div>
//           </OrderCard>
//         ))}
//         {accepted.length === 0 && <EmptyRow text="No accepted orders." />}
//       </OrderSection>

//       <OrderSection title="Ready for pickup" count={ready.length}>
//         {ready.map((o) => (
//           <OrderCard key={o._id} order={o} right={euro(o.total)}>
//             <OrderMeta o={o} />
//             <Stepper status={o.status} />
//             <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
//               <button onClick={collect(o)} disabled={!!busy[o._id]} style={btnPrimary}>
//                 {busy[o._id] === "collecting" ? "Updating…" : "Mark collected"}
//               </button>
//             </div>
//           </OrderCard>
//         ))}
//         {ready.length === 0 && <EmptyRow text="No ready orders." />}
//       </OrderSection>

//       {collected.length > 0 && (
//         <OrderSection title="Collected" count={collected.length}>
//           {collected.map((o) => (
//             <OrderCard key={o._id} order={o} right={euro(o.total)}>
//               <OrderMeta o={o} />
//               <Stepper status={o.status} />
//             </OrderCard>
//           ))}
//         </OrderSection>
//       )}

//       {cancelled.length > 0 && (
//         <OrderSection title="Cancelled" count={cancelled.length}>
//           {cancelled.map((o) => (
//             <OrderCard key={o._id} order={o} right={euro(o.total)}>
//               <OrderMeta o={o} />
//               <Stepper status={o.status} />
//             </OrderCard>
//           ))}
//         </OrderSection>
//       )}
//     </div>
//   );
// }

// /* ---------- Subcomponents ---------- */

// function OrderSection({
//   title,
//   count,
//   children,
// }: {
//   title: string;
//   count: number;
//   children: React.ReactNode;
// }) {
//   return (
//     <section
//       style={{
//         border: "1px solid #e5e7eb",
//         borderRadius: 14,
//         padding: 16,
//         marginBottom: 20,
//         background: "#fff",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
//         <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
//         <span style={{ color: "#6b7280", fontSize: 14 }}>{count} orders</span>
//       </div>
//       {children}
//     </section>
//   );
// }

// function OrderCard({
//   order,
//   right,
//   children,
// }: {
//   order: AdminOrder;
//   right?: React.ReactNode;
//   children?: React.ReactNode;
// }) {
//   return (
//     <div
//       style={{
//         border: "1px solid #e5e7eb",
//         borderRadius: 14,
//         padding: 14,
//         marginBottom: 12,
//         background: "#fafafa",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           gap: 16,
//           alignItems: "center",
//           marginBottom: 8,
//         }}
//       >
//         <div style={{ fontWeight: 700 }}>
//           #{niceId(order)} {dot}
//           <span style={{ color: "#6b7280", fontWeight: 400 }}>
//             {statusBadge(order.status)}
//           </span>
//         </div>
//         <div style={{ fontWeight: 700 }}>{right}</div>
//       </div>
//       {children}
//     </div>
//   );
// }

// function statusBadge(s: Status) {
//   const color: Record<Status, string> = {
//     pending: "#6b7280",
//     accepted: "#3b82f6",
//     ready: "#0ea5e9",
//     collected: "#10b981",
//     cancelled: "#ef4444",
//   };
//   return (
//     <span
//       style={{
//         color: color[s],
//         border: `1px solid ${color[s]}33`,
//         background: `${color[s]}11`,
//         padding: "2px 8px",
//         borderRadius: 999,
//         fontSize: 12,
//       }}
//     >
//       {s}
//     </span>
//   );
// }

// function OrderMeta({ o }: { o: AdminOrder }) {
//   const customerName = o?.customer?.name || "—";
//   const customerPhone = o?.customer?.phone || "—";
//   const pickup = o?.pickupTime || "—";
//   return (
//     <>
//       <div style={{ color: "#374151", fontSize: 14, marginBottom: 8 }}>
//         {dot}
//         <span title="Payment">{o.payment}</span>
//         {dot}
//         <span title="Pickup">Pickup: {pickup}</span>
//         {dot}
//         <span title="Customer">
//           {customerName} {customerPhone !== "—" ? `(${customerPhone})` : ""}
//         </span>
//       </div>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//         {o.items.map((it, i) => (
//           <span
//             key={i}
//             style={{
//               fontSize: 13,
//               background: "#ffffff",
//               border: "1px solid #e5e7eb",
//               borderRadius: 999,
//               padding: "4px 10px",
//             }}
//           >
//             {it.name} × {it.qty}
//           </span>
//         ))}
//       </div>
//     </>
//   );
// }

// function Stepper({ status }: { status: Status }) {
//   const steps = ["pending", "accepted", "ready", "collected"] as const;
//   const idx = Math.max(0, steps.indexOf(status as any));
//   const pct = (idx / (steps.length - 1)) * 100;

//   return (
//     <div style={{ marginTop: 12 }}>
//       <div
//         style={{
//           position: "relative",
//           height: 8,
//           background: "#e5e7eb",
//           borderRadius: 999,
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             left: 0,
//             top: 0,
//             bottom: 0,
//             width: `${pct}%`,
//             background: "#f59e0b",
//             borderRadius: 999,
//             transition: "width .25s ease",
//           }}
//         />
//       </div>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4,1fr)",
//           gap: 8,
//           marginTop: 8,
//           fontSize: 12,
//           color: "#374151",
//         }}
//       >
//         <div style={{ textAlign: "center", fontWeight: idx >= 0 ? 700 : 400 }}>
//           Order accepted
//         </div>
//         <div style={{ textAlign: "center", fontWeight: idx >= 1 ? 700 : 400 }}>
//           Being prepared
//         </div>
//         <div style={{ textAlign: "center", fontWeight: idx >= 2 ? 700 : 400 }}>
//           Ready to collect
//         </div>
//         <div style={{ textAlign: "center", fontWeight: idx >= 3 ? 700 : 400 }}>
//           Collected
//         </div>
//       </div>
//     </div>
//   );
// }

// function EmptyRow({ text }: { text: string }) {
//   return (
//     <div style={{ color: "#6b7280", fontSize: 14, padding: "10px 4px" }}>
//       {text}
//     </div>
//   );
// }

// /* ---------- Button Styles ---------- */
// const btnBase: React.CSSProperties = {
//   padding: "8px 12px",
//   borderRadius: 10,
//   fontWeight: 600,
//   cursor: "pointer",
//   border: "1px solid transparent",
// };
// const btnPrimary: React.CSSProperties = {
//   ...btnBase,
//   background: "#111827",
//   color: "white",
// };
// const btnGhost: React.CSSProperties = {
//   ...btnBase,
//   background: "white",
//   color: "#111827",
//   border: "1px solid #e5e7eb",
// };








import { Navigate } from "react-router-dom";

export default function Admin() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Navigate to="/admin/orders" replace />;
}
