import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/app.css";

const DropdownButton = ({ label, options, setFilters, keys }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <motion.button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label} ▼
      </motion.button>

      {open && (
        <motion.div className="dropdown-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {Object.entries(options).map(([key, values]) => (
            <div key={key}>
              <h4>{key}</h4>
              {values.map((value) => (
                <motion.button
                  key={value}
                  className="dropdown-option"
                  onClick={() => setFilters((prev) => ({ ...prev, [keys[Object.keys(options).indexOf(key)]]: value }))} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DropdownButton;
