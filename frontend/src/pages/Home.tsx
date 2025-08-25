import Hero from "../components/Hero";

type Props = {
  go: (p: "Home" | "Menu" | "Checkout" | "Track" | "Reserve" | "Contact") => void;
};

export default function Home({ go }: Props) {
  return (
    <>
      <Hero
        onOrderNow={() => go("Menu")}
        onReserve={() => go("Reserve")}
        onViewMenu={() => go("Menu")}
      />

      <section style={{ background: "#fff" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "54px 16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr", 
            gap: 28,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src="/images/LammBiriyani.avif"
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

          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
              A Fresh and Seasonal Cuisine
            </h2>
            <p style={{ color: "#374151", marginTop: 12, lineHeight: 1.6 }}>
              At Darbar, we celebrate the vibrant flavours of India with fresh ingredients,
              classic recipes, and a warm welcome. Join us for comforting curries, tandoor
              specialties, and street-food favourites—made with love, every day.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
