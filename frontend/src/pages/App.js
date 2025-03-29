import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/app.css";

const App = () => {
  const [totalCrimes, setTotalCrimes] = useState(0);
  const [filters, setFilters] = useState({
    year: null,
    nibrsGroup: null,
    nibrsOffenseCode: "",
    address: "",
  });

  const fetchCrimeCount = () => {
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

  useEffect(() => {
    fetchCrimeCount();
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
      <div className="filter-panel">
        <h2>Filters</h2>

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

        <div className="search-container">
          <h3>NIBRS Offense Code</h3>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. 120"
            value={filters.nibrsOffenseCode}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, nibrsOffenseCode: e.target.value }))
            }
          />
        </div>

        <div className="search-container">
          <h3>Address / Neighborhood</h3>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. ROOSEVELT"
            value={filters.address}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <div className="content-area">
        <h1>Seattle Crime Dashboard</h1>
        <p>Total Crimes Found: {totalCrimes.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default App;
