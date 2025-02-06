const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
    reportNumber: String,
    offenseId: String, 
    offenseStart: Date,
    offenseEnd: Date, 
    reportTime: Date, 
    groupAB: String, 
    crimeCategory: String, 
    offenseParentGroup: String, 
    offense: String,
    Precint: String, 
    Sector: String,
    beat: String,
    mcpp: String, 
    address: String,
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model("Crime", crimeSchema); 