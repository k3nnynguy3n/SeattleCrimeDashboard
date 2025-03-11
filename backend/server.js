require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 

const app = express(); 

// Connect to MongoDB Atlas
connectDB(); 

// Middleware
app.use(cors());            // Allow frontend to access backend API
app.use(express.json());    // Allow JSON requests

// Routes 
app.use('/', require('./routes/crimeRoutes'));
app.use('/totalCrime', require('./routes/crimeRoutes'));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));