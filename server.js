const express = require('express');
const connectDB = require('./code/db');

const app = express(); 

// Connect to MongoDB Atlas
connectDB(); 

app.get('/', (req, res) => {
    res.send("MongoDB Atlas is connected!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log`🚀 Server running on port ${PORT}`);