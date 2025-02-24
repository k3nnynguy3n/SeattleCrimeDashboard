const mongoose = require('mongoose');

const CrimeSchema = new mongoose.Schema({
    report_number: String,
    offense_id: String,
    offense_start: Date,
    offense_end: Date,
    report_date: Date,
    group_a_b: String,
    crime_category: String,
    offense_parent_group: String,
    offense: String,
    offense_code: String,
    precinct: String,
    sector: String,
    beat: String,
    mcpp: String,
    address: String,
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model('Crime', CrimeSchema);
