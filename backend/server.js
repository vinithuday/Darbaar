require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",               
  "http://localhost:3001",                
  "https://darbaar-lyart.vercel.app",   
  "https://darbar.com",                  
  "https://admin.darbar.com"             
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/admin");
const paymentsRoutes = require("./routes/payments");

app.use("/images", express.static(path.resolve(__dirname, "public", "images")));

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to Darbar"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });



  app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("🚀 Darbaar Backend is Running on Render!");
});

app.use("/api/payments", paymentsRoutes);
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/menu", require("./routes/menu.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/stripe", require("./routes/stripe"));
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});
