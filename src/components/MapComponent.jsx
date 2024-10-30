import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Hack para arreglar los íconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Obtener la posición inicial
    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada en este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setPosition(newPosition);
        if (map) map.setView(newPosition);
      },
      (error) => {
        setError("Error al obtener la ubicación: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, [map]);

  useEffect(() => {
    if (!isTracking) return;

    const trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setPosition(newPosition);
          setPathHistory((prev) => [...prev, newPosition]);
          if (map) map.setView(newPosition);
          setError(null);
        },
        (error) => {
          setError("Error al obtener la ubicación: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }, 5000);

    return () => clearInterval(trackingInterval);
  }, [isTracking, map]);

  if (!position && !error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "600px" }}>
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
          onClick={() => setIsTracking(!isTracking)}
          className={`btn ${isTracking ? "btn-danger" : "btn-success"}`}
        >
          {isTracking ? "Detener Seguimiento" : "Iniciar Seguimiento"}
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {position && (
        <div style={{ height: "700px", width: "100%" }} className="border rounded">
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
                Ubicación actual<br />
                Lat: {position[0].toFixed(6)}<br />
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
      )}
    </div>
  );
};

export default MapComponent;