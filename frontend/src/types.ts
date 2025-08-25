
export type PageName = "Home" | "Menu" | "Checkout" | "Track" | "Reserve" | "Contact" | "Admin";


type AnyId = string | number;

export interface MenuItem {
  _id?: string;
  id?: AnyId;
  name: string;
  category: string;
  price: number;
  veg: boolean;
  description?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  img?: string | null;
  available?: boolean;
}

export interface CartItem {
  id: AnyId;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
}

export type OrderItem = { name: string; qty: number; price: number };

export type OrderPayload = {
  items: OrderItem[];
  customer: { name: string; phone: string; notes?: string };
  paymentMethod: "cash" | "paypal";
  pickupTime: string; // ISO
};
// types.ts
export type OrderResponse = {
  shortId: string;           
  code?: string;             
  items?: { id: string; name: string; qty: number }[];
};
