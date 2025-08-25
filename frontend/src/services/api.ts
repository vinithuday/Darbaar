


import type {
  MenuItem,
  OrderPayload,
  OrderResponse,
} from "../types";

const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const json = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
};

const norm = (s: any) => String(s ?? "").trim();
const lower = (s: any) => norm(s).toLowerCase();

const mapCategory = (name: string, category: string) => {
  const n = lower(name);
  const c = lower(category);

  if (c === "beverages") {
    if (
      n.includes("mango lassi") ||
      n.includes("coca cola") ||
      n.includes("sprite") ||
      n.includes("fanta") ||
      n.includes("red bull") ||
      n.includes("durstlöscher") ||
      n.includes("durstloscher")
    )
      return "Softdrinks";
    if (n.includes("pilsener") || n.includes("hefeweizen")) return "Alkohol";
    if (n.includes("whisky") || n.includes("whiskey")) return "Alkohol";
  }
  return norm(category) || "Other";
};

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const data = await fetch(`${BASE}/menu`).then(json<any[]>);
  return data.map((it) => ({
    id: Number(it.id ?? it._id),
    name: it.name,
    price: Number(it.price ?? 0),
    veg: Boolean(it.veg),
    category: mapCategory(it.name, it.category),
    description: it.description ?? it.desc ?? "",
    imageUrl: it.imageUrl ?? it.img ?? null,
    available: it.available ?? true,
  })) as MenuItem[];
};

export const postOrder = (payload: OrderPayload) =>
  fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(json<OrderResponse>);



  

export const postReservation = (payload: any) =>
  fetch(`${BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(json<any>);

export type AdminOrder = {
  _id: string;
  items: { name: string; qty: number; price: number }[];
  customer: { name: string; phone: string };
  paymentMethod: "cash" | "paypal";
  pickupTime: string;
  total: number;
  status:
    | "pending"
    | "awaiting_paypal"
    | "confirmed"
    | "preparing"
    | "ready"
    | "collected"
    | "cancelled"
    | "unknown";
  prepDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const listOrders = async (): Promise<AdminOrder[]> =>
  fetch(`${BASE}/orders`).then(json<AdminOrder[]>);

export const getOrderById = async (id: string): Promise<AdminOrder> =>
  fetch(`${BASE}/orders/${id}`).then(json<AdminOrder>);

export const acceptOrder = async (id: string): Promise<AdminOrder> =>
  fetch(`${BASE}/orders/${id}/accept`, { method: "PATCH" }).then(
    json<AdminOrder>
  );

export const setOrderStatus = async (
  id: string,
  status: "ready" | "collected" | "cancelled"
): Promise<AdminOrder> =>
  fetch(`${BASE}/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json<AdminOrder>);


