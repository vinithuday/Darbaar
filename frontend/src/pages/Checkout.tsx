import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckOutForm from "../components/StripeCheckOutForm";
import type { OrderResponse } from "../types";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  onOrderPlaced?: (o: OrderResponse) => void;
};

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

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

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
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

export default function Checkout({ onOrderPlaced }: Props) {
  const { items, total, clear, remove } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "paypal" | null
  >(null);

  const handleCashOrder = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Name and phone are required for Cash orders!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          payment: "cash",
          customer: { name: form.name, phone: form.phone },
          notes: form.notes,
          total,
        }),
      });
      if (!res.ok) throw new Error("Cash order failed");
      const order = await res.json();
      onOrderPlaced?.(order as OrderResponse);
      clear();
      alert(`✅ Cash order placed! Your ID is ${order.shortId}`);
    } catch (err) {
      console.error(err);
      alert(" Failed to save cash order");
    }
    setLoading(false);
  };

  const handleStripeInit = async () => {
    if (total <= 0) return;
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Name and phone are required before paying!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Failed to create PaymentIntent");
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error(" Payment init error:", err);
      alert("Failed to start payment. Please try again.");
    }
    setLoading(false);
  };

  const handlePaypal = () => alert("💳 PayPal integration coming soon!");

  if (clientSecret && paymentMethod === "card") {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeCheckOutForm onOrderPlaced={onOrderPlaced} customer={form} />
      </Elements>
    );
  }

  return (
    <Shell>
      <Card>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
          🛒 Checkout
        </h2>
        {items.length === 0 ? (
          <p style={{ color: COLORS.muted }}>No items in cart.</p>
        ) : (
          <ul style={{ padding: 0, margin: "0 0 1rem", listStyle: "none" }}>
            {items.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: `1px solid ${COLORS.gray200}`,
                }}
              >
                <div>
                  {item.name} × {item.qty}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>€{(item.price * item.qty).toFixed(2)}</span>
                  <button
                    onClick={() => item.id && remove(String(item.id))}
                    style={{
                      marginLeft: 8,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.red500}`,
                      background: COLORS.red50,
                      color: COLORS.red500,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h3 style={{ textAlign: "right", fontWeight: 700 }}>
          Total: €{total.toFixed(2)}
        </h3>
        {items.length > 0 && (
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <button
              onClick={clear}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${COLORS.red500}`,
                background: COLORS.red50,
                color: COLORS.red500,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Name *
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}
              required
            />
          </label>
          <label>
            Phone *
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}
              required
            />
          </label>
          <label>
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}
            />
          </label>
        </div>
      </Card>

      {/* Payment Options */}
      <Card>
        <h4 style={{ marginBottom: 12, fontWeight: 700 }}>
          Choose Payment Method
        </h4>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            <input
              type="radio"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            💵 Cash
          </label>
          <label>
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            💳 Card
          </label>
          <label>
            <input
              type="radio"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            🅿️ PayPal
          </label>
        </div>
      </Card>

      {/* Action */}
      <Card style={{ textAlign: "center" }}>
        {paymentMethod === "cash" && (
          <button
            onClick={handleCashOrder}
            disabled={loading || total === 0}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6F6248",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Placing…" : "Place Cash Order"}
          </button>
        )}
        {paymentMethod === "card" && (
          <button
            onClick={handleStripeInit}
            disabled={loading || total === 0}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6F6248",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Loading Stripe…" : "Pay with Card"}
          </button>
        )}
        {paymentMethod === "paypal" && (
          <button
            onClick={handlePaypal}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6F6248",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Pay with PayPal
          </button>
        )}
      </Card>
    </Shell>
  );
}
