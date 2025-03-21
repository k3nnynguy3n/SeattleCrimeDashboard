// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const crimeRoutes = require("./routes/crimeRoutes");
app.use("/api/crimes", crimeRoutes);

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));