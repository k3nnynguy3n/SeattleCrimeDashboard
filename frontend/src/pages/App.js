import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/app.css";

const App = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [filters, setFilters] = useState({
    year: null,
    nibrsGroup: null,
    nibrsOffenseCode: "",
    address: "",
  });

  const fetchCrimeData = () => {
    const queryParams = new URLSearchParams(filters);
    const apiUrl = `http://localhost:8080/api/crimes/filtered-crimes?${queryParams.toString()}`;
    console.log("Fetching from:", apiUrl);

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);
        setCrimeData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching crime data:", error);
        setCrimeData([]); // fallback to empty list
      });
  };

  useEffect(() => {
    fetchCrimeData();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      year: null,
      nibrsGroup: null,
      nibrsOffenseCode: "",
      address: "",
    });
  };

  return (
    <div className="container">
      {/* Filters Panel */}
      <div className="filter-panel">
        <h2>Filters</h2>

        {/* Year Filter */}
        <div className="filter-group">
          <h3>Year</h3>
          <div className="button-group">
            {Array.from({ length: 2020 - 2008 + 1 }, (_, i) => (2008 + i).toString()).map((year) => (
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

        {/* NIBRS Group Filter */}
        <div className="filter-group">
          <h3>NIBRS Group</h3>
          <div className="button-group">
            {["A", "B"].map((group) => (
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

        {/* NIBRS Offense Code */}
        <div className="search-container">
          <h3>NIBRS Offense Code</h3>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. 120"
            value={filters.nibrsOffenseCode}
            onChange={(e) => setFilters((prev) => ({ ...prev, nibrsOffenseCode: e.target.value }))}
          />
        </div>

        {/* Address */}
        <div className="search-container">
          <h3>Address / Neighborhood</h3>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. ROOSEVELT"
            value={filters.address}
            onChange={(e) => setFilters((prev) => ({ ...prev, address: e.target.value }))}
          />
        </div>

        <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Display Area */}
      <div className="content-area">
        <h1>Seattle Crime Dashboard</h1>
        <p>Total Crimes Found: {crimeData.length}</p>

        {crimeData.length === 0 ? (
          <p>No data found. Adjust filters or try a different year.</p>
        ) : (
          <ul>
            {crimeData.slice(0, 10).map((crime, index) => (
              <li key={index}>
                <strong>{crime.offense}</strong> — {crime.address}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
