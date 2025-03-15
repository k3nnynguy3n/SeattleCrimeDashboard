import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/app.css";

const App = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [filters, setFilters] = useState({
    year: null,
    time: null,
    nibrsGroup: null,
    nibrsOffenseCode: "",
    address: ""
  });

  // Available filter options
  const years = Array.from({ length: 2020 - 2008 + 1 }, (_, i) => (2008 + i).toString());
  const timeOptions = ["Morning (5 AM - 11:59 AM)", "Afternoon (12 PM - 4:59 PM)", "Evening (5 PM - 8:59 PM)", "Night (9 PM - 4:59 AM)"];
  const nibrsGroups = ["A", "B"];

  const fetchCrimeData = () => {
    const queryParams = new URLSearchParams(filters);
    const apiUrl = `http://localhost:5000/api/crime-data?${queryParams.toString()}`;

    axios
      .get(apiUrl)
      .then((response) => setCrimeData(response.data))
      .catch((error) => console.error("Error fetching crime data:", error));
  };

  useEffect(() => {
    fetchCrimeData();
  }, [filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      year: null,
      time: null,
      nibrsGroup: null,
      nibrsOffenseCode: "",
      address: ""
    });
  };

  return (
    <div className="container">
      {/* Left Side Filter Panel */}
      <div className="filter-panel">
        <h2>Filters</h2>

        {/* Year Filter */}
        <div className="filter-group">
          <h3>Year</h3>
          <div className="button-group">
            {years.map((year) => (
              <button 
                key={year} 
                className={`filter-button ${filters.year === year ? "active" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, year: year === prev.year ? null : year }))}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day Filter */}
        <div className="filter-group">
          <h3>Time of Day</h3>
          <div className="button-group">
            {timeOptions.map((time) => (
              <button 
                key={time} 
                className={`filter-button ${filters.time === time ? "active" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, time: time === prev.time ? null : time }))}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* NIBRS Group Filter */}
        <div className="filter-group">
          <h3>NIBRS Group</h3>
          <div className="button-group">
            {nibrsGroups.map((group) => (
              <button 
                key={group} 
                className={`filter-button ${filters.nibrsGroup === group ? "active" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, nibrsGroup: group === prev.nibrsGroup ? null : group }))}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* NIBRS Offense Code Search */}
        <div className="search-container">
          <h3>NIBRS Offense Code</h3>
          <input
            type="text"
            placeholder="Enter Offense Code"
            className="search-input"
            value={filters.nibrsOffenseCode}
            onChange={(e) => setFilters((prev) => ({ ...prev, nibrsOffenseCode: e.target.value }))}
          />
        </div>

        {/* Address/Neighborhood Search */}
        <div className="search-container">
          <h3>Address/Neighborhood</h3>
          <input
            type="text"
            placeholder="Enter Address/Neighborhood"
            className="search-input"
            value={filters.address}
            onChange={(e) => setFilters((prev) => ({ ...prev, address: e.target.value }))}
          />
        </div>

        {/* Reset Filters Button - Added at the Bottom */}
        <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Right Side Content (Future Map) */}
      <div className="content-area">
        <h1>Seattle Crime Dashboard</h1>
        <p>Total Crimes: {crimeData.length}</p>
        {/* Future Graph or Heatmap goes here */}
      </div>
    </div>
  );
};

export default App;
