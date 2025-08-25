
type Props = {
  onOrderNow: () => void;
  onReserve: () => void;
  onViewMenu?: () => void;
};

export default function Hero({ onOrderNow, onReserve, onViewMenu }: Props) {
  return (
    <section style={{ background: "#f9f6ef", borderBottom: "1px solid #eee" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 16px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 900, margin: 0 }}>
            Made With Love. <span style={{ fontWeight: 800 }}>Simply Delicious</span>
          </h1>
          <p style={{ marginTop: 12, maxWidth: 520, color: "#374151" }}>
            Indian favourites made fresh daily. Pickup available.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
           <button
  onClick={onViewMenu} 
  style={{
    border: 0,
    background: "#6f6248",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  Order Online
</button>

            <button
              onClick={onReserve}
              style={{
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                padding: "10px 18px",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Reservation
            </button>
          </div>
        </div>

         <div style={{ textAlign: "center" }}>
            <img
              src="/images/chicken65.webp"
              alt="Delicious Indian Food"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />
          </div>
      </div>
    </section>
  );
}
