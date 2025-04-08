import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import axios from "axios";

const CrimeHeatMap = () => {
  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/crimes/heatmap") 
      .then((res) => {
        const formatted = res.data
          .filter(d => d.latitude && d.longitude)
          .map(d => [d.latitude, d.longitude, 0.8]); 
        setHeatPoints(formatted);
      })
      .catch(err => console.error("Heatmap data error:", err));
  }, []);

  return (
    <MapContainer
      center={[47.6062, -122.3321]} // Seattle
      zoom={12}
      style={{ height: "700px", width: "100%", borderRadius: "10px", marginTop: "20px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );

};

export default CrimeHeatMap;
