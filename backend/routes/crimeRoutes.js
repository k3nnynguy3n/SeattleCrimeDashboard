const express = require("express");
const router = express.Router();
const Crime = require("../models/crime");

// GET /api/crimes/filtered-crimes
router.get("/filtered-crimes", async (req, res) => {
  try {
    const { year, nibrsGroup, nibrsOffenseCode, address } = req.query;

    let filter = {};

    // 1) Filter by year → match the start of `offense_start` (e.g., "2020")
    if (year) {
      // Convert the year (e.g. "2020") into a start/end date
    const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59Z`);

    // Filter for offense_start between those dates
    filter["offense_start"] = { $gte: startOfYear, $lte: endOfYear };
    }

    // 2) Filter by Group A/B
    if (nibrsGroup) {
      filter["group_a_b"] = nibrsGroup;
    }

    // 3) Filter by NIBRS Offense Code → matches `code`
    if (nibrsOffenseCode) {
      filter["code"] = { $regex: new RegExp(nibrsOffenseCode, "i") };
    }

    // 4) Filter by Address → partial match in `address` field
    if (address) {
      filter["address"] = { $regex: new RegExp(address, "i") };
    }

    // Fetch up to 100 results
    const filteredCrimes = await Crime.find(filter).limit(100);

    // Return JSON with total count and data
    res.json({
      totalCrimes: filteredCrimes.length,
      data: filteredCrimes
    });
  } catch (error) {
    console.error("❌ Error fetching filtered crime data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
