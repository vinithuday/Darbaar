import React from "react";
import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";

type Props = {
  item: MenuItem;
};

const currency = (n: number) => `€${Number(n).toFixed(2)}`;

export default function MenuCard({ item }: Props) {
  const { _id, id, name, price, veg, category, description, image, imageUrl, img } = item as any;

  const keyId = String(_id ?? id ?? name);
  const imgSrc = imageUrl || image || img || "/images/placeholder.png";

  const { items, add, setQty } = useCart();
  const inCart = items.find((i) => String(i.id) === keyId);
  const qty = inCart?.qty ?? 0;

  return (
    <article className="card">
      <div className="card-top">
        {typeof veg === "boolean" && !["SoftDrinks", "Alkohol"].includes(category) && (
          <span className={`pill ${veg ? "veg" : "nonveg"}`}>
            {veg ? "VEG" : "NON-VEG"}
          </span>
        )}
        {category && <span className="pill pale">{category}</span>}
      </div>

      <h3 className="title">{name}</h3>
      <p className="muted">{currency(price)}</p>

      <div className="thumb-wrap">
        <img className="thumb big" src={imgSrc} alt={name} loading="lazy" />
      </div>

      {description && <p className="desc">{description}</p>}

      <div className="row between mt-3">
        {qty === 0 ? (
          <button
            className="w-full text-lg font-bold"
            style={{
              backgroundColor: "#6f6248",
              border: "none",
              color: "white",
              padding: "9px 10px",
              borderRadius: "10px", 
            }}
            type="button"
            onClick={() => add(item)}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-center gap-6 w-full">
            <button
              style={{
                backgroundColor: "#6f6248",
                border: "none",
                color: "white",
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              type="button"
              onClick={() => setQty(keyId, Math.max(0, qty - 1))}
            >
              –
            </button>

            <span className="text-xl font-extrabold text-black min-w-[24px] text-center">
              
              {qty}
            </span>

            <button
              style={{
                backgroundColor: "#6f6248",
                border: "none",
                color: "white",
                padding: "5px 10px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              type="button"
              onClick={() => setQty(keyId, qty + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
