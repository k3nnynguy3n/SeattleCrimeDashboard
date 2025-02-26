const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 
require('dotenv').config(); 

const app = express(); 

// Connect to MongoDB Atlas
connectDB(); 

// Middleware
app.use(cors());            // Allow frontend to access backend API
app.use(express.json());    // Allow JSON requests

// Route for health check
app.get('/', (req, res) => {
    res.send("MongoDB Atlas is connected!");
});

// API Test Route
app.get('/test', async (req, res) => {
    res.send("This is a test!")
});

// Import crime model
const crime = require('./models/crime');

// API route to retrieve all crime data
app.get('/crime-data', async (req, res) => {
    
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));