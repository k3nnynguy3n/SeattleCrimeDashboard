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

// Convert strings to valid Date objects
const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

// Insert data into MongoDB in batches, previously node.js ran out of memory when inserting records all at once 
const insertInBatches = async (data, batchSize = 10000) => {
    console.log(`📝 Inserting ${data.length} records in batches of ${batchSize}...`);
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${i / batchSize + 1} (${batch.length} records)...`);
        await Crime.insertMany(batch).catch(err => {
            console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, err);
        });
    }
};

// Import CSV into MongoDB
const importCSV = async () => {
    try {
        // Convert csv file into json
        console.log("📂 Loading CSV file...");
        const crimes = await csvtojson().fromFile('./data/SPD_Crime_Data_2008-Present_20250115.csv');

        console.log(`📊 Found ${crimes.length} records in CSV file.`);

        // Map each row in the csv to the json object matching the mongdoDB schema
        const formattedCrimes = crimes
            .map(crime => ({
                report_number: crime['Report Number']?.trim(),
                offense_id: crime['Offense ID']?.trim(),
                offense_start: parseDate(crime['Offense Start DateTime']),
                offense_end: parseDate(crime['Offense End DateTime']),
                report_date: parseDate(crime['Report DateTime']),
                group_a_b: crime['Group A B']?.trim() || null,
                crime_category: crime['Crime Against Category']?.trim() || null,
                offense_parent_group: crime['Offense Parent Group']?.trim() || null,
                offense: crime['Offense']?.trim() || null,
                offense_code: crime['Offense Code']?.trim() || null,
                precinct: crime['Precinct']?.trim() || null,
                sector: crime['Sector']?.trim() || null,
                beat: crime['Beat']?.trim() || null,
                mcpp: crime['MCPP']?.trim() || null,
                address: crime['100 Block Address']?.trim() || null,
                longitude: crime['Longitude'] ? parseFloat(crime['Longitude']) : null,
                latitude: crime['Latitude'] ? parseFloat(crime['Latitude']) : null
            }))
            .filter(crime => crime.report_number && crime.offense); // Ensure required fields exist

        // Empty data
        if (formattedCrimes.length === 0) {
            console.log("⚠️ No valid records to import.");
            mongoose.connection.close();
            return;
        }

        // Insert records in smaller batches
        await insertInBatches(formattedCrimes);

        console.log(`✅ Successfully imported ${formattedCrimes.length} records into MongoDB!`);

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error importing data:", err);
        mongoose.connection.close();
    }
};

// Run the process
(async () => {
    await connectDB();
    await importCSV();
})();
