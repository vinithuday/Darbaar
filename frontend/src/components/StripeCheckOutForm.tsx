import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { useCart } from "../context/CartContext";
import type { OrderResponse } from "../types";

type Props = {
  onOrderPlaced?: (res: OrderResponse) => void;
  customer: { name: string; phone: string; notes?: string };
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
      maxWidth: 600,
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

// ----- Component -----
export default function StripeCheckOutForm({ onOrderPlaced, customer }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
      return;
    }

    const pi = result.paymentIntent;

    if (pi?.status === "succeeded") {
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
            payment: "card",
            total: Math.round(total * 100) / 100,
            customer: {
              name: customer.name,
              phone: customer.phone,
            },
            notes: customer.notes || "",
          }),
        });

        if (!res.ok) throw new Error("Order save failed");
        const order = await res.json();

        onOrderPlaced?.(order as OrderResponse);
        clear();
        alert(` Order placed! Your order ID is ${order.shortId}`);
      } catch (err) {
        console.error(err);
        alert("Order was paid but not saved in DB!");
      }
    } else if (pi?.status === "processing") {
      alert(" Payment is processing, refresh later.");
    } else if (pi?.status === "requires_payment_method") {
      alert(" Payment failed. Try another card.");
    } else {
      alert(" Unexpected payment status: " + pi?.status);
    }

    setLoading(false);
  };

  return (
    <Shell>
      <Card>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16 }}>
          💳 Pay with Card
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <PaymentElement />
          <button
            disabled={!stripe || loading}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#6f6248",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Processing…" : "Confirm & Pay"}
          </button>
        </form>
      </Card>
    </Shell>
  );
}
