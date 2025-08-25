import { Outlet } from "react-router-dom";
import AdminNav from "./components/AdminNav";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AdminNav />
      <main style={{ flex: 1, paddingTop: 72 }}>
        <Outlet /> 
      </main>
    </div>
  );
}
