
const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const OrderItemSchema = new mongoose.Schema(
  {
    name: String,
    qty: Number,
    price: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    shortId: { type: String, index: true, unique: true },
    items: [OrderItemSchema],
    total: { type: Number, default: 0 },

    payment: { type: String, enum: ["cash", "paypal", "card"], default: "cash" },

    status: {
      type: String,
      enum: ["pending", "accepted", "ready", "collected", "cancelled"],
      default: "pending",
    },

    acceptedAt: Date,
    pickupTime: String,
    customer: { type: CustomerSchema, required: true },
    notes: String,
  },
  { timestamps: true }
);

function calcTotal(items = []) {
  const cents = items.reduce((sum, it) => {
    const qty = Number(it?.qty ?? 1);
    const price = Number(it?.price ?? 0);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) return sum;
    return sum + Math.round(price * 100) * qty;
  }, 0);
  return cents / 100;
}

OrderSchema.pre("save", function (next) {
  this.total = calcTotal(this.items || []);
  next();
});

module.exports = mongoose.model("Order", OrderSchema, "orders");
