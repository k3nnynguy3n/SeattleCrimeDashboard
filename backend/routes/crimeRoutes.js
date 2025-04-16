// backend/routes/crimeRoutes.js
const express = require("express");
const router = express.Router();
const Crime = require("../models/crime");

// GET /api/crimes/filtered-crimes
router.get("/filtered-crimes", async (req, res) => {
  try {
    const { year, nibrsGroup, nibrsOffenseCode, address } = req.query;
    const filter = {};

    // Filter by Year (offense_start)
    if (year) {
      const start = new Date(`${year}-01-01T00:00:00Z`);
      const end = new Date(`${year}-12-31T23:59:59Z`);
      filter.offense_start = { $gte: start, $lte: end };
    }

    // Filter by NIBRS Group (group_a_b)
    if (nibrsGroup) {
      filter.group_a_b = nibrsGroup;
    }

    // Filter by NIBRS Offense Code (offense_code)
    if (nibrsOffenseCode) {
      filter.offense_code = { $regex: new RegExp(nibrsOffenseCode, "i") };
    }

    // Filter by Address / Neighborhood (address)
    if (address) {
      filter.address = { $regex: new RegExp(address, "i") };
    }

    const totalCrimes = await Crime.countDocuments(filter);

    res.json({ totalCrimes });
  } catch (error) {
    console.error("❌ Error fetching filtered crime data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/crimes/heatmap
router.get("/heatmap", async (req, res) => {
  try {
    const crimes = await Crime.find({}, "latitude longitude");
    res.json(crimes);
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    res.status(500).json({ error: "Heatmap fetch failed" });
  }
});

// GET /api/crimes/test
router.get("/test", (req, res) => {
  console.log("/test route");
  res.json({ message: "Router works!" });
});

module.exports = router;