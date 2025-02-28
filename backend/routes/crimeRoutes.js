const express = require('express');
const crime = require('../models/crime');
const router = express.Router(); 

// Gets the total number of crimes
router.get('/crimeTotalCount', async (req, res) => {
    try {
        const totalCrimeCount = await crime.countDocuments(); 
        res.json({ totalCrimeCount });
    } catch (error) {
        console.error(" Error fetching total crime count", error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
}); 

router.get('/', (req, res) => {
    res.status(200).json({ message: "MongoDB Atlas is connected!" });
});

module.exports = router;