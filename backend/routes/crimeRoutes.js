const express = require("express");
const router = express.Router();
const Crime = require("../models/crime"); // Ensure your model is correctly referenced

// API route to fetch filtered crime data
router.get("/filtered-crimes", async (req, res) => {
  try {
    const { year, time, nibrsGroup, nibrsOffenseCode, address } = req.query;

    let filter = {};

    if (year) {
      filter["Report DateTime"] = { $regex: new RegExp(`^${year}`) }; // Match reports from that year
    }
    if (nibrsGroup) {
      filter["Group A B"] = nibrsGroup; // A or B classification
    }
    if (nibrsOffenseCode) {
      filter["Offense Code"] = { $regex: new RegExp(nibrsOffenseCode, "i") }; // Partial match
    }
    if (address) {
      filter["100 Block Address"] = { $regex: new RegExp(address, "i") }; // Partial match for addresses
    }

    const filteredCrimes = await Crime.find(filter).limit(100); // Limit to avoid performance issues
    res.json({ totalCrimes: filteredCrimes.length, data: filteredCrimes });
  } catch (error) {
    console.error("❌ Error fetching filtered crime data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;