require('dotenv').config();
const mongoose = require('mongoose');

// Async function to connect to MongoDB
// Uses connection string from .env file 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully...");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
