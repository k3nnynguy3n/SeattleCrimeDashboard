require('dotenv').config();
const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const Crime = require('../models/crime');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected..."))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Function to import CSV into MongoDB
const importCSV = async () => {
    try {
        const crimes = await csvtojson().fromFile('./data/SPD_Crime_Data_2008-Present_20250115.csv');

        // Format the data (ensure it matches the schema)
        const formattedCrimes = crimes.map(crime => ({
            report_number: crime['Report Number'],
            offense_id: crime['Offense ID'],
            offense_start: new Date(crime['Offense Start DateTime']),
            offense_end: new Date(crime['Offense End DateTime']),
            report_date: new Date(crime['Report DateTime']),
            group_a_b: crime['Group A B'],
            crime_category: crime['Crime Against Category'],
            offense_parent_group: crime['Offense Parent Group'],
            offense: crime['Offense'],
            offense_code: crime['Offense Code'],
            precinct: crime['Precinct'],
            sector: crime['Sector'],
            beat: crime['Beat'],
            mcpp: crime['MCPP'],
            address: crime['100 Block Address'],
            longitude: parseFloat(crime['Longitude']),
            latitude: parseFloat(crime['Latitude'])
        }));

        // Insert data into MongoDB
        await Crime.insertMany(formattedCrimes);
        console.log(`✅ Successfully imported ${formattedCrimes.length} records into MongoDB!`);

        // Close the connection
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error importing data:", err);
    }
};

// Run the import function
importCSV();
