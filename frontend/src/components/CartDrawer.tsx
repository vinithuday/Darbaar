
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, remove, setQty, total } = useCart();

  return (
    <aside className="bg-white border rounded-2xl p-4">
      <h3 className="font-bold text-lg mb-3">Your Cart</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600">Cart is empty.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const keyId = String((item as any)._id ?? item.id ?? item.name);

            return (
              <li key={keyId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : null}
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      €{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => setQty(keyId, Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button
                    className="ml-2 text-sm text-red-600"
                    onClick={() => remove(keyId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 border-t pt-3 flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-bold">€{total.toFixed(2)}</span>
      </div>
    </aside>
  );
}
