import MenuGrid from "../components/MenuGrid";
import { useCart } from "../context/CartContext";
import type { MenuItem } from "../types";

type Props = {
  menu: MenuItem[];
  categories: string[];
  search: string; setSearch: (v: string) => void;
  vegOnly: boolean; setVegOnly: (v: boolean) => void;
  category: string; setCategory: (v: string) => void;
};

export default function MenuPage({
  menu, categories, search, setSearch, vegOnly, setVegOnly, category, setCategory,
}: Props) {
  const { add } = useCart();

  return (
    <MenuGrid
      items={menu}
      categories={categories}
      onAdd={(m) => add(m)}
      search={search}
      setSearch={setSearch}
      vegOnly={vegOnly}
      setVegOnly={setVegOnly}
      category={category}
      setCategory={setCategory}
    />
  );
}
