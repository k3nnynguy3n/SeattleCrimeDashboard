import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DropdownButton from "../components/dropdownButton";
import "../styles/app.css"; 

const App = () => {
  const [crimeData, setCrimeData] = useState(0);
  const [filters, setFilters] = useState({
    victimAge: null, victimSex: null,
    suspectAge: null, suspectSex: null,
    time: null, category: null
  });

  const fetchCrimeCount = () => {
    let query = "";
    Object.keys(filters).forEach((key) => {
      if (filters[key]) query += `&${key}=${filters[key]}`;
    });

    axios
      .get(`http://localhost:3000/api/crime-data/filtered-total?${query}`)
      .then((response) => setCrimeData(response.data.totalCrimes))
      .catch((error) => console.error("Error fetching crime count:", error));
  };

  useEffect(() => {
    fetchCrimeCount();
  }, [filters]);

  return (
    <div className="container">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Seattle Crime Dashboard
      </motion.h1>

      <div className="filter-section">
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
          Category: ["PROPERTY", "SOCIETY", "LARCENY-THEFT", "ROBBERY"]
        }} setFilters={setFilters} keys={["time", "category"]} />
      </div>

      <p>Total Crimes: {crimeData}</p>
    </div>
  );
};

export default App;
