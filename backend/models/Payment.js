const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  shortId: { type: String, required: true },   
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerName: { type: String, required: true },
paymentType: { type: String, enum: ["stripe", "paypal", "cash", "card", "Card"], required: true },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["success", "failed", "pending"], default: "success" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
