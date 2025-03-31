import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/app.css";

const App = () => {
  // State to hold the total number of crimes
  const [totalCrimes, setTotalCrimes] = useState(0);
  // Filters for the webpage
  const [filters, setFilters] = useState({
    year: null,
    nibrsGroup: null,
    nibrsOffenseCode: "",
    address: "",
  });

  // Fetch crime data from MongoDB based on filters
  const fetchCrimeCount = () => {
    // Remove empty/null filters before building the query string 
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
    );
    const queryParams = new URLSearchParams(cleanFilters);
    const apiUrl = `http://localhost:8080/api/crimes/filtered-crimes?${queryParams.toString()}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API Response:", response.data);
        setTotalCrimes(response.data.totalCrimes);
      })
      .catch((error) => {
        console.error("Error fetching crime data:", error);
        setTotalCrimes(0);
      });
  };

  // Fetch updated crime count when filters change 
  useEffect(() => {
    fetchCrimeCount();
  }, [filters]);

  // Reset filters to default values
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
      {/* Filter Sidebar */}
      <div className="filter-panel">
        <h2>Filters</h2>

        {/* Years Buttons (2008 - 2020) */}
        <div className="filter-group">
          <h3>Year</h3>
          <div className="button-group">
            {Array.from({ length: 2020 - 2008 + 1 }, (_, i) => (2008 + i).toString()).map((year) => (
              <button
                key={year}
                className={`filter-button ${filters.year === year ? "active" : ""}`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, year: year === prev.year ? null : year }))
                }
              >
                {year}
              </button>
            ))}
          </div>
        </div>
          
        {/* NIBRS Group buttons (A or B) */}
        <div className="filter-group">
          <h3>NIBRS Group</h3>
          <div className="button-group">
            {["A", "B"].map((group) => (
              <button
                key={group}
                className={`filter-button ${filters.nibrsGroup === group ? "active" : ""}`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, nibrsGroup: group === prev.nibrsGroup ? null : group }))
                }
              >
                {group}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search Bar for Offense Code */}
        <div className="search-container">
          <h3>NIBRS Offense Code</h3>
          <input
            type="text"
            className="search-input"
            placeholder="ex. 120"
            value={filters.nibrsOffenseCode}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, nibrsOffenseCode: e.target.value }))
            }
          />
        </div>
        
        {/* Search Bar for Address/Neighborhood */}
        <div className="search-container">
          <h3>Address / Neighborhood</h3>
          <input
            type="text"
            className="search-input"
            placeholder="ex. Roosevelt"
            value={filters.address}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
        
        {/* Reset all filters back to default */}
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
        
        {/* External FBI resource for understanding offense codes */}
        <div className="NIBRS-info-link"> 
          <a
          href="https://ucr.fbi.gov/nibrs/2011/resources/nibrs-offense-codes"
          target="_blank"
          rel="noopener noreferrer"
          > 
          ℹ️ Guide to NIBRS Offense Codes & Groups 
          </a> 
        </div>

      </div>
      
       {/* Main dashboard output section */}
      <div className="content-area">
        <h1>Seattle Crime Dashboard</h1>
        <p>Total Crimes Found: {totalCrimes.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default App;
