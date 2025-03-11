import React, { useState, useEffect } from "react";
import axios from "axios";
import DropdownButton from "../components/dropdownButton";
import "../styles/app.css";

const App = () => {
  const [crimeData, setCrimeData] = useState(0);
  const [filters, setFilters] = useState({
    victimAge: null, victimSex: null,
    suspectAge: null, suspectSex: null,
    time: null, category: null,
    charge: null, crimeCommitted: null
  });

  const fetchCrimeCount = () => {
    let query = "";
    Object.keys(filters).forEach((key) => {
      if (filters[key]) query += `&${key}=${filters[key]}`;
    });

    axios
      .get(`http://localhost:5000/api/crime-data/filtered-total?${query}`)
      .then((response) => setCrimeData(response.data.totalCrimes))
      .catch((error) => console.error("Error fetching crime count:", error));
  };

  useEffect(() => {
    fetchCrimeCount();
  }, [filters]);

  return (
    <div className="container">
      {/* Left Side Filter Panel */}
      <div className="filter-panel">
        <h2>Filters</h2>

        <DropdownButton label="Victim" options={{
          Age: [18, 25, 35, 50, 65],
          Sex: ["Male", "Female"]
        }} setFilters={setFilters} keys={["victimAge", "victimSex"]} />

        <DropdownButton label="Suspect" options={{
          Age: [18, 25, 35, 50, 65],
          Sex: ["Male", "Female"]
        }} setFilters={setFilters} keys={["suspectAge", "suspectSex"]} />

        <DropdownButton label="Crime Filters" options={{
          Time: ["Morning", "Afternoon", "Evening", "Night"],
          Category: ["PROPERTY", "SOCIETY", "LARCENY-THEFT", "ROBBERY"],
          Charge: ["Assault", "Burglary", "Fraud", "Vandalism"],
          CrimeCommitted: ["Shoplifting", "Drug Possession", "DUI", "Homicide"]
        }} setFilters={setFilters} keys={["time", "category", "charge", "crimeCommitted"]} />
      </div>

      {/* Right Side Content */}
      <div className="content-area">
        <h1>Seattle Crime Dashboard</h1>
        <p>Total Crimes: {crimeData}</p>
        {/* Future Graph or Heatmap will be placed here */}
      </div>
    </div>
  );
};

export default App;
