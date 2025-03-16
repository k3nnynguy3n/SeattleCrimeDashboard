const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend access
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import and use routes
app.use("/api/crimes", require("./routes/crimeRoutes"));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));