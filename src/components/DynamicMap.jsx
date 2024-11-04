import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Configuración de íconos personalizados
const createCustomIcon = (iconUrl, iconSize = [25, 41]) => {
  return L.icon({
    iconUrl,
    iconSize: iconSize,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

const startIcon = createCustomIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
);
const endIcon = createCustomIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
);
const currentIcon = createCustomIcon(
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
);

// Componente para centrar automáticamente el mapa
const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position]);
  return null;
};

const DynamicMap = () => {
  const [position, setPosition] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [stats, setStats] = useState({
    distance: 0,
    duration: 0,
    averageSpeed: 0,
  });

  const API_URL = "https://api-paw-tracker.onrender.com";

  // Función para calcular la distancia entre dos puntos en metros
  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = (coord1[0] * Math.PI) / 180;
    const φ2 = (coord2[0] * Math.PI) / 180;
    const Δφ = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const Δλ = ((coord2[1] - coord1[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    const getInitialPosition = async () => {
      try {
        console.log("Intentando obtener posición inicial desde:", API_URL);

        const response = await fetch(API_URL);
        console.log("Respuesta recibida:", response);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const locationData = await response.json();
        console.log("Datos de ubicación recibidos:", locationData);

        // Verificación detallada de los datos
        if (!locationData) {
          console.error("No se recibieron datos de ubicación");
          throw new Error("No se recibieron datos de ubicación");
        }

        console.log("Latitude:", locationData.latitude);
        console.log("Longitude:", locationData.longitude);

        if (
          locationData.latitude === undefined ||
          locationData.longitude === undefined
        ) {
          console.error("Datos de ubicación incompletos:", locationData);
          throw new Error("Datos de ubicación incompletos");
        }

        setPosition([locationData.latitude, locationData.longitude]);
        console.log("Posición establecida:", [
          locationData.latitude,
          locationData.longitude,
        ]);
      } catch (err) {
        console.error("Error completo:", err);
        // Establecer posición por defecto en caso de error
        const defaultPosition = [4.60971, -74.08175];
        console.log("Estableciendo posición por defecto:", defaultPosition);
        setPosition(defaultPosition);
        setError("Error al obtener la ubicación inicial: " + err.message);
      }
    };
    getInitialPosition();
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    const fetchLocation = async () => {
      try {
        console.log("Obteniendo nueva ubicación...");

        const response = await fetch(API_URL);
        console.log("Respuesta de actualización:", response);

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const locationData = await response.json();
        console.log("Nuevos datos de ubicación:", locationData);

        if (
          !locationData ||
          locationData.latitude === undefined ||
          locationData.longitude === undefined
        ) {
          throw new Error("Datos de ubicación inválidos");
        }

        const newPosition = [locationData.latitude, locationData.longitude];
        console.log("Nueva posición:", newPosition);

        setPosition(newPosition);

        setPathHistory((prev) => {
          if (prev.length > 0) {
            const lastPoint = prev[prev.length - 1];
            // Comparación directa de coordenadas
            if (
              lastPoint.latitude === newPosition.latitude &&
              lastPoint.longitude === newPosition.longitude
            ) {
              console.log("Punto duplicado, ignorando...");
              return prev;
            }

            const distance = calculateDistance(
              [lastPoint.latitude, lastPoint.longitude],
              [newPosition.latitude, newPosition.longitude]
            );

            // Actualización de las estadísticas
            const timestamp = new Date(locationData.timestamp || Date.now());
            const startTime =
              prev.length === 1 ? timestamp : new Date(prev[0].timestamp);
            const duration = (timestamp - startTime) / 1000;

            setStats((prevStats) => {
              return {
                distance: prevStats.distance + distance,
                duration,
                averageSpeed:
                  duration > 0
                    ? ((prevStats.distance + distance) / duration) * 3.6
                    : 0,
              };
            });
          }

          return [
            ...prev,
            {
              latitude: newPosition[0],
              longitude: newPosition[1],
              timestamp: locationData.timestamp || new Date().toISOString(),
            },
          ];
        });
      } catch (err) {
        console.error("Error al actualizar ubicación:", err);
        setError("Error al obtener la ubicación: " + err.message);
      }
    };

    console.log("Iniciando seguimiento...");
    const interval = setInterval(fetchLocation, 5000);
    fetchLocation(); // Primera llamada inmediata

    return () => {
      console.log("Deteniendo seguimiento...");
      clearInterval(interval);
    };
  }, [isTracking]);

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
    <div className="tracking-container">
      <div className="controls-container" style={{ marginBottom: "15px" }}>
        <button
          onClick={() => {
            setIsTracking(!isTracking);
            if (!isTracking) {
              setPathHistory([]);
              setStats({ distance: 0, duration: 0, averageSpeed: 0 });
            }
          }}
          className={`btn ${isTracking ? "btn-danger" : "btn-success"}`}
        >
          {isTracking ? "Detener Seguimiento" : "Iniciar Seguimiento"}
        </button>

        {isTracking && (
          <div
            className="stats-row"
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="stat-item"
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              🏃 Distancia: {(stats.distance / 1000).toFixed(2)} km
            </div>
            <div
              className="stat-item"
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "#17a2b8",
                color: "white",
              }}
            >
              ⏱️ Tiempo: {Math.floor(stats.duration / 60)}m{" "}
              {Math.floor(stats.duration % 60)}s
            </div>
            <div
              className="stat-item"
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "#28a745",
                color: "white",
              }}
            >
              ⚡ Velocidad: {stats.averageSpeed.toFixed(1)} km/h
            </div>
          </div>
        )}
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
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Marcador de posición actual */}
          <Marker position={position} icon={currentIcon}>
            <Popup>
              Ubicación actual
              <br />
              Lat: {position[0].toFixed(6)}
              <br />
              Lon: {position[1].toFixed(6)}
            </Popup>
          </Marker>

          {/* Marcadores de inicio y fin del recorrido */}
          {pathHistory.length > 0 && (
            <>
              <Marker
                position={[pathHistory[0].latitude, pathHistory[0].longitude]}
                icon={startIcon}
              >
                <Popup>Punto de inicio</Popup>
              </Marker>
              {pathHistory.length > 1 && (
                <Marker
                  position={[
                    pathHistory[pathHistory.length - 1].latitude,
                    pathHistory[pathHistory.length - 1].longitude,
                  ]}
                  icon={endIcon}
                >
                  <Popup>Último punto</Popup>
                </Marker>
              )}
            </>
          )}

          {/* Línea del recorrido */}
          {pathHistory.length > 1 && (
            <Polyline
              positions={pathHistory.map((point) => [
                point.latitude,
                point.longitude,
              ])}
              color="#0d6efd"
              weight={3}
              opacity={0.7}
            />
          )}

          <AutoCenter position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DynamicMap;
