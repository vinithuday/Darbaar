import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import MenuPage from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Reserve from "./pages/Reserve";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { fetchMenu } from "./services/api";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import TrackOrder from "./pages/TrackOrder";
import type { MenuItem, OrderResponse } from "./types";
import AdminReservations from "./pages/AdminReservations";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPayments from "./pages/AdminPayments";


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
        const normalized: MenuItem[] = data.map((item: MenuItem) => {
          const cat = (item.category || "").toLowerCase();
          if (cat === "drink") {
            const name = (item.name || "").toLowerCase();
            const isSoft =
              name.includes("mango lassi") ||
              name.includes("coca cola") ||
              name.includes("coca-cola") ||
              name.includes("coke") ||
              name.includes("sprite") ||
              name.includes("fanta") ||
              name.includes("red bull") ||
              name.includes("durstlöscher") ||
              name.includes("durstloscher");
            const isAlkohol =
              name.includes("whisky") ||
              name.includes("whiskey") ||
              name.includes("pilsener") ||
              name.includes("pilsner") ||
              name.includes("hefeweizen");
            if (isSoft) return { ...item, category: "Softdrinks" };
            if (isAlkohol) return { ...item, category: "Alkohol" };
          }
          return item;
        });
        setMenu(normalized);
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

  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#111827",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Noto Sans"',
      }}
    >
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
  <Route
    path="/checkout"
    element={<Checkout onOrderPlaced={onOrderPlaced} />}
  />
  <Route
    path="/track"
    element={<TrackOrder shortId={order?.shortId ?? null} />}
  />
  <Route path="/reserve" element={<Reserve />} />
  <Route path="/contact" element={<Contact />} />

  <Route
    path="/admin/login"
    element={
      isAdminLoggedIn ? <Navigate to="/admin" replace /> : <AdminLogin />
    }
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/reservations"
    element={
      <ProtectedRoute>
        <AdminReservations />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/payments"
    element={
      <ProtectedRoute>
        <AdminPayments />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/orders"
    element={
      <ProtectedRoute>
        <AdminOrders />
      </ProtectedRoute>
    }
  />
</Routes>

      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}




