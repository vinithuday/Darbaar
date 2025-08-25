console.log("✅ order.routes.js loaded");

const router = require("express").Router();
const Order = require("../models/Order");
const mongoose = require("mongoose");

function makeShortId() {
  return (
    Math.random().toString(36).slice(2, 5) +
    Math.random().toString(36).slice(2, 5)
  ).toUpperCase();
}

router.post("/", async (req, res) => 
  {
     console.log("👉 New order request body:", req.body); 
  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];

    const payment = body.payment || "cash";
    const pickupTime = body.pickupTime || null;
    const notes = body.notes || "";

    const customer =
      body.customer && typeof body.customer === "object"
        ? { name: body.customer.name, phone: body.customer.phone || "" }
        : { name: body.customerName, phone: body.customerPhone || "" };

   if (!items.length) {
  return res.status(400).json({ message: "No items in order" });
}
if (!customer?.name || !customer?.phone) {
  return res.status(400).json({ message: "Customer name and phone are required" });
}


    const shortId = makeShortId();

    const order = new Order({
      shortId,
      items,
      customer,
      notes,
      pickupTime,
      payment,
      status: "pending",
      total:
        body.total ||
        items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0),
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(" order create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("👉 Fetching orders from DB:", mongoose.connection.name);
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log("👉 Orders found:", orders.length);
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/debug/raw", async (req, res) => {
  try {
    const rawOrders = await mongoose.connection.db.collection("orders").find().toArray();
    res.json({
      count: rawOrders.length,
      sample: rawOrders[0] || null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:shortId", async (req, res) => {
  try {
    const order = await Order.findOne({ shortId: req.params.shortId });
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:shortId", async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
