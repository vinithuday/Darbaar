

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");

router.post("/confirm", async (req, res) => {
  try {
    const { orderId, shortId, paymentType } = req.body;

    let order = null;
    if (orderId) {
      try {
        order = await Order.findById(orderId);
      } catch (e) {
        console.warn("Invalid ObjectId:", orderId);
      }
    }
    if (!order && shortId) {
      order = await Order.findOne({ shortId });
    }
    if (!order) return res.status(404).json({ message: "Order not found" });

    const normalizedPayment =
      (paymentType || order.payment || "cash").toLowerCase();

    const payment = await Payment.create({
      shortId: shortId || order.shortId,
      orderId: order._id,
      customerName: order.customer?.name || "Unknown",
      paymentType: normalizedPayment,
      items: order.items.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
      totalAmount: order.total,
      status: "success",
    });

    res.json(payment);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment saving failed", error: err.message });
  }
});

module.exports = router;
