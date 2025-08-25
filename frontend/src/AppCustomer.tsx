import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { fetchMenu } from "./services/api";

// customer pages
import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Reserve from "./pages/Reserve";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";

import type { MenuItem, OrderResponse } from "./types";

function AppInner() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [category, setCategory] = useState("All");
  const [order, setOrder] = useState<{ shortId: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMenu();
        setMenu(data);
      } catch (e) {
        console.error("Failed to fetch menu:", e);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const m of menu) {
      const c = (m.category || "").trim();
      if (c) set.add(c);
    }
    set.add("Softdrinks");
    set.add("Alkohol");
    return Array.from(set).sort();
  }, [menu]);

  const navigate = useNavigate();
  const onOrderPlaced = (res: OrderResponse) => {
    setOrder({ shortId: res.shortId });
    navigate("/track");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav />
      <main style={{ flex: 1, paddingTop: 72 }}>
        <Routes>
          <Route path="/" element={<Home go={() => {}} />} />
          <Route
            path="/menu"
            element={
              <MenuPage
                menu={menu}
                categories={categories}
                search={search}
                setSearch={setSearch}
                vegOnly={vegOnly}
                setVegOnly={setVegOnly}
                category={category}
                setCategory={setCategory}
              />
            }
          />
          <Route path="/checkout" element={<Checkout onOrderPlaced={onOrderPlaced} />} />
          <Route path="/track" element={<TrackOrder shortId={order?.shortId ?? null} />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function AppCustomer() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
