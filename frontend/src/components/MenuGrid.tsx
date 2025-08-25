import { useMemo } from "react";
import CategoryTabs from "./CategoryTabs";
import MenuCard from "./MenuCard"; 
import type { MenuItem } from "../types";
import "../styles/menu.css";

const norm = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

type Props = {
  items: MenuItem[];
  categories: string[];
  onAdd: (m: MenuItem) => void;
  search: string; setSearch: (v: string) => void;
  vegOnly: boolean; setVegOnly: (v: boolean) => void;
  category: string; setCategory: (v: string) => void;
};

export default function MenuGrid({
  items, categories, onAdd, search, setSearch, vegOnly, setVegOnly, category, setCategory,
}: Props) {
  const uniqueCats = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of categories) {
      const key = norm(raw);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push((raw || "").trim());
    }
    return out;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = norm(search);
    const selected = norm(category);
    return items.filter((i) => {
      const catOk = category === "All" || norm(i.category) === selected;
      const vegOk = !vegOnly || i.veg === true;
      const desc = i.description || "";
      const textOk = norm(i.name).includes(q) || norm(desc).includes(q);

      if (vegOnly && ["softdrinks", "alkohol"].includes(norm(i.category))) {
        return false;
      }

      return catOk && vegOk && textOk;
    });
  }, [items, vegOnly, category, search]);

  const allCats = ["All", ...uniqueCats];

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 16px" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Menu</h2>
      </div>

      <CategoryTabs categories={allCats} current={category} onChange={setCategory} />

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
        justifyContent: "space-between", marginTop: 12, marginBottom: 12,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid #e5e7eb", borderRadius: 12, padding: "8px 12px", width: 256,
        }}>
          <input
            style={{ width: "100%", outline: "none", border: 0, background: "transparent" }}
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1px solid #e5e7eb", borderRadius: 12, padding: "8px 12px",
        }}>
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          <span>Veg only</span>
        </label>
      </div>

      <div className="menu-grid" style={{ marginTop: 24 }}>
        {filtered.map((it) => (
          <MenuCard key={String(it._id ?? it.id ?? it.name)} item={it} />
        ))}
      </div>
    </section>
  );
}
