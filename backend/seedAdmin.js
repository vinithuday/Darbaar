const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

async function createAdmin() {
  try {
await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    const admin = new Admin({
      email: "vinithrajbmu@gmail.com",
      password: hashedPassword
    });

    await admin.save();
    console.log("Admin created successfully:", admin.email);
    mongoose.disconnect();
  } catch (err) {
    console.error(" Error creating admin:", err);
  }
}

createAdmin();
