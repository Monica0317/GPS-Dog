import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

// Configuración de íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const API_URL = "http://192.168.1.3:3001";

const DynamicMap = () => {
  const [position, setPosition] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Obtener posición inicial
    const getInitialPosition = async () => {
      try {
        const response = await fetch(`${API_URL}/get-location`);
        if (!response.ok)
          throw new Error("Error al obtener la ubicación inicial");

        const locationData = await response.json();
        if (locationData && locationData.latitude && locationData.longitude) {
          setPosition([locationData.latitude, locationData.longitude]);
        } else {
          // Posición por defecto si no hay datos
          setPosition([4.60971, -74.08175]); // Bogotá como ejemplo
        }
      } catch (err) {
        console.error(err);
        // Posición por defecto en caso de error
        setPosition([4.60971, -74.08175]);
      }
    };

    getInitialPosition();
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`${API_URL}/get-location`);
        if (!response.ok) throw new Error("Error al obtener la ubicación");

        const locationData = await response.json();
        if (locationData && locationData.latitude && locationData.longitude) {
          const newPosition = [locationData.latitude, locationData.longitude];
          setPosition(newPosition);
          setPathHistory((prev) => {
            if (
              prev.length > 0 &&
              prev[prev.length - 1][0] === newPosition[0] &&
              prev[prev.length - 1][1] === newPosition[1]
            ) {
              return prev;
            }
            return [...prev, newPosition];
          });
          if (map) map.setView(newPosition);
        }
      } catch (err) {
        setError("Error al obtener la ubicación del servidor: " + err.message);
      }
    };

    const interval = setInterval(fetchLocation, 5000);
    fetchLocation();

    return () => clearInterval(interval);
  }, [isTracking, map]);

  if (!position) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "600px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <button
          onClick={() => {
            setIsTracking(!isTracking);
            if (!isTracking) setPathHistory([]);
          }}
          className={`btn ${isTracking ? "btn-danger" : "btn-success"}`}
        >
          {isTracking ? "Detener Seguimiento" : "Iniciar Seguimiento"}
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div
        style={{ height: "700px", width: "100%" }}
        className="border rounded"
      >
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={position}>
            <Popup>
              Ubicación actual
              <br />
              Lat: {position[0].toFixed(6)}
              <br />
              Lon: {position[1].toFixed(6)}
            </Popup>
          </Marker>

          {pathHistory.length > 1 && (
            <Polyline
              positions={pathHistory}
              color="#0d6efd"
              weight={3}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DynamicMap;
