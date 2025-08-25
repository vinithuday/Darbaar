import { useEffect, useMemo, useState } from "react";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (process.env as any).REACT_APP_API_BASE_URL ||
  "http://localhost:5000/api";

const POLL_MS = 4000 as const;

type Status = "pending" | "accepted" | "ready" | "collected" | "cancelled";

type OrderDoc = {
  _id: string;
  shortId: string;
  status: Status;
  total?: number;
  pickupTime?: string;
  customer?: { name?: string; phone?: string };
  items?: { name: string; qty: number; price?: number }[];
};

type Props = {
  shortId?: string | null;
};

const euro = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
    .format(Number(n) || 0);

export default function TrackOrder({ shortId: propSid }: Props) {
  const [input, setInput] = useState<string>("");
  const [sid, setSid] = useState<string>("");

  const [doc, setDoc] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (propSid && propSid !== sid) {
      setInput(propSid);
      setSid(propSid);
    }
  }, [propSid]);

  useEffect(() => {
    if (!sid) {
      setDoc(null);
      setLoading(false);
      setError("");
      return;
    }
    let stop = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(sid)}`, {
          credentials: "include",
        });
        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            msg = (await res.json())?.message || msg;
          } catch {}
          throw new Error(msg);
        }
        const data = (await res.json()) as OrderDoc;
        if (!stop) {
          setDoc(data);
          setError("");
        }
      } catch (e: any) {
        if (!stop) {
          setDoc(null);
          setError(e?.message || "Could not load your order.");
        }
      } finally {
        if (!stop) setLoading(false);
      }
    }

    setLoading(true);
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [sid]);

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = (input || "").trim().toUpperCase();
    if (!clean) return;
    setSid(clean); 
  };

  const step = useMemo(() => {
    switch (doc?.status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "ready":
        return 2;
      case "collected":
        return 3;
      default:
        return 0;
    }
  }, [doc?.status]);

  const pickupText = useMemo(() => {
    const v = doc?.pickupTime;
    if (!v) return "";
    return isNaN(Date.parse(v))
      ? v
      : new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [doc?.pickupTime]);

  const COLORS = {
    border: "#e5e7eb",
    bg: "#fff",
    text: "#111827",
    muted: "#6b7280",
    amber50: "#fff7ed",
    amber200: "#fde68a",
    amber400: "#f59e0b",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray400: "#9ca3af",
    gray700: "#374151",
    red50: "#fef2f2",
    red500: "#ef4444",
  };

  const Shell: React.FC<{ children: any }> = ({ children }) => (
    <div
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "32px 16px",
        color: COLORS.text,
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ display: "grid", gap: 16 }}>{children}</div>
    </div>
  );

  const Card: React.FC<{ children: any; style?: React.CSSProperties }> = ({
    children,
    style,
  }) => (
    <div
      style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 2px rgba(16,24,40,.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Info = ({ label, value }: { label: string; value: string }) => (
    <div
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 12,
        background: COLORS.gray50,
      }}
    >
      <div style={{ color: COLORS.muted, fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );

  const StepBox = ({
    active,
    title,
    subtitle,
    icon,
  }: {
    active: boolean;
    title: string;
    subtitle: string;
    icon: string;
  }) => (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          margin: "0 auto 8px",
          height: 56,
          width: 56,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          background: active ? COLORS.amber50 : COLORS.gray100,
          color: active ? COLORS.text : COLORS.gray400,
        }}
      >
        {icon}
      </div>
      <div style={{ fontWeight: 600, color: active ? COLORS.text : COLORS.gray400 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: active ? COLORS.gray700 : COLORS.gray400 }}>
        {subtitle}
      </div>
    </div>
  );

  const statusLabel =
    doc?.status === "pending"
      ? "Awaiting acceptance"
      : doc?.status === "accepted"
      ? "Preparing"
      : doc?.status === "ready"
      ? "Ready for pickup"
      : doc?.status === "collected"
      ? "Picked up"
      : doc?.status === "cancelled"
      ? "Cancelled"
      : "Order";

  return (
    <Shell>
      <Card>
        <form onSubmit={onSearch} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label htmlFor="sid" style={{ fontWeight: 800, fontSize: 20, marginRight: 8 }}>
            Track your order
          </label>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto", width: "min(460px, 100%)" }}>
            <input
              id="sid"
              placeholder="Enter your short ID (e.g. AFTWJ6)"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                fontSize: 14,
                letterSpacing: 1,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid transparent",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </form>
        {!sid && (
          <div style={{ color: COLORS.muted, marginTop: 8 }}>
            Enter your short ID to see live status.
          </div>
        )}
      </Card>

      {sid && loading && (
        <Card>
          <div
            style={{
              height: 20,
              width: 160,
              background: COLORS.gray100,
              borderRadius: 8,
              marginBottom: 12,
            }}
          />
          <div style={{ height: 80, background: COLORS.gray50, borderRadius: 12 }} />
        </Card>
      )}

      {sid && error && !loading && (
        <Card>
          <div
            style={{
              border: `1px solid ${COLORS.red500}33`,
              background: COLORS.red50,
              color: COLORS.red500,
              padding: 12,
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        </Card>
      )}

      {sid && !loading && !error && doc && (
        <>
          <Card style={{ background: COLORS.amber50, borderColor: COLORS.amber200 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 22,
                    background: "#fff",
                    boxShadow: `0 0 0 8px ${COLORS.amber200}33`,
                  }}
                >
                  ⏱️
                </div>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 13 }}>Status</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{statusLabel}</div>
                  <div style={{ color: COLORS.gray700, marginTop: 4 }}>
                    {doc.status === "pending" && "The restaurant will accept your order shortly."}
                    {doc.status === "accepted" && "Your food is being prepared."}
                    {doc.status === "ready" && "Come to the counter to pick it up."}
                    {doc.status === "collected" && "Enjoy!"}
                    {doc.status === "cancelled" && "This order has been cancelled."}
                  </div>
                </div>
              </div>
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: 12,
                  padding: "6px 10px",
                  borderRadius: 12,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.gray50,
                }}
              >
                #{doc.shortId}
              </span>
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>Order progress</div>
              <div style={{ color: COLORS.muted, fontSize: 13 }}>Updates every ~4s</div>
            </div>
            <div
              style={{
                position: "relative",
                height: 8,
                background: COLORS.gray200,
                borderRadius: 999,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(step / 3) * 100}%`,
                  background: COLORS.amber400,
                  borderRadius: 999,
                  transition: "width .3s ease",
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, textAlign: "center" }}>
              <StepBox
                active={step >= 0}
                title="Order Received"
                subtitle={doc.status === "pending" ? "Awaiting acceptance." : "Received."}
                icon="🔔"
              />
              <StepBox active={step >= 1} title="Preparing" subtitle="Chef is on it." icon="🍳" />
              <StepBox active={step >= 2} title="Ready for Pickup" subtitle="Come to the counter." icon="📦" />
              <StepBox active={step >= 3} title="Picked Up" subtitle="Enjoy!" icon="🧾" />
            </div>
          </Card>

          {/* Info */}
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
              <Info label="Order ID" value={`#${doc.shortId}`} />
              <Info label="Pickup" value={pickupText || "—"} />
              <Info label="Name" value={doc.customer?.name || "—"} />
              <Info label="Total" value={doc.total != null ? euro(doc.total) : euro(0)} />
            </div>
          </Card>

          {Array.isArray(doc.items) && doc.items.length > 0 && (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Items</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {doc.items.map((it, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 14,
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 999,
                      padding: "6px 10px",
                    }}
                  >
                    {it.name} × {it.qty}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </Shell>
  );
}
