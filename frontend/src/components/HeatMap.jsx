import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import axios from "axios";

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heat = L.heatLayer(points, {
      radius: 5,
      blur: 10,
      maxZoom: 17,
      gradient: {
        0.2: 'lime',
        0.4: 'yellow',
        0.6: 'orange',
        0.8: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

const CrimeHeatMap = ({ filters }) => {
  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
    );
    const queryParams = new URLSearchParams(cleanFilters);
    const url = `http://localhost:8080/api/crimes/filtered-crimes/heatmap?${queryParams.toString()}`;

    axios.get(url)
      .then((res) => {
        const formatted = res.data
          .filter(d => d.latitude && d.longitude)
          .map(d => [d.latitude, d.longitude, 0.8]);
        setHeatPoints(formatted);
      })
      .catch(err => console.error("Heatmap data error:", err));
  }, [filters]);

  return (
    <MapContainer
      center={[47.6062, -122.3321]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={heatPoints} />
    </MapContainer>
  );
};

export default CrimeHeatMap;
