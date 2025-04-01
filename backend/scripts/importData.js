require('dotenv').config();
const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const Crime = require('../models/crime');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully...");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

// Clear the existing collection
const clearCollection = async () => {
    try {
        await Crime.deleteMany({});
        console.log("🧹 Existing crime collection cleared");
    } catch (err) {
        console.error("❌ Error clearing collection:", err.message);
        process.exit(1);
    }
};

// Parses a string into a valid Date or returns null
const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

// Inserts documents in batches of 10,000
const insertInBatches = async (data, batchSize = 10000) => {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        try {
            await Crime.insertMany(batch, { ordered: false });
            console.log(`📦 ${i + batch.length} inserted`);
        } catch (err) {
            console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, err.message);
        }
    }
};

// Import CSV and format records
const importCSV = async () => {
    try {
        console.log("📂 Loading CSV file...");
        const crimes = await csvtojson().fromFile('../data/SPD_Crime_Data_2008-Present_20250115.csv');
        console.log(`📊 Found ${crimes.length} records in CSV file.`);

        const formattedCrimes = crimes.map(crime => {
            const offenseStart = parseDate(crime['Offense Start DateTime']) ||
                                 parseDate(crime['Offense End DateTime']) ||
                                 parseDate(crime['Report DateTime']);

            return {
                report_number: crime['Report Number']?.trim(),
                offense_start: offenseStart,
                group_a_b: crime['Group A B']?.trim() || null,
                offense_code: crime['Offense Code']?.trim() || null,
                address: crime['100 Block Address']?.trim() || null
            };
        }).filter(c => c.report_number && c.offense_start);

        if (formattedCrimes.length === 0) {
            console.log("⚠️ No valid records to import.");
            mongoose.connection.close();
            return;
        }

        await clearCollection(); // Clear old data before inserting new

        await insertInBatches(formattedCrimes);

        console.log(`✅ Successfully imported ${formattedCrimes.length} records into MongoDB!`);
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error importing data:", err);
        mongoose.connection.close();
    }
};

(async () => {
    await connectDB();
    await importCSV();
})();
