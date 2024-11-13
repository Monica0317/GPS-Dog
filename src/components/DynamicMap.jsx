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
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { appFirebase } from "../credenciales";

const db = getDatabase(appFirebase);

const getLocationHistory = async (userId, selectedDate) => {
  try {
    if (!userId || !selectedDate) {
      console.warn("ID de usuario o fecha no proporcionados.");
      return [];
    }

    const db = getDatabase(appFirebase);
    const userLocationRef = ref(
      db,
      `users/${userId}/locations/${selectedDate}`
    );
    const snapshot = await get(userLocationRef);

    if (snapshot.exists()) {
      const locations = Object.values(snapshot.val());
      return locations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      }));
    } else {
      console.warn("No se encontraron datos para la fecha seleccionada.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener el historial de ubicaciones:", error);
    return [];
  }
};

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

const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position]);
  return null;
};

const DynamicMap = ({ userId }) => {
  const [position, setPosition] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [stats, setStats] = useState({
    distance: 0,
    duration: 0,
    averageSpeed: 0,
  });

  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3;
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
    const userRef = ref(db, `users/${userId}/locations`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const locationData = snapshot.val();

      console.log("Estructura completa del nodo `locations`:", locationData);

      if (locationData) {
        const locationArray = Object.keys(locationData).flatMap((dateKey) => {
          const dateGroup = locationData[dateKey];
          return Object.keys(dateGroup)
            .map((entryKey) => {
              const entry = dateGroup[entryKey];
              if (
                entry &&
                typeof entry.latitude === "number" &&
                typeof entry.longitude === "number" &&
                entry.timestamp
              ) {
                return {
                  latitude: entry.latitude,
                  longitude: entry.longitude,
                  timestamp: entry.timestamp,
                };
              }
              return null;
            })
            .filter(Boolean);
        });

        console.log("Array de ubicaciones procesadas:", locationArray);

        if (locationArray.length === 0) {
          console.warn(
            "No se encontraron ubicaciones válidas en el nodo `locations`."
          );
          setError("No se encontraron ubicaciones válidas.");
          return;
        }

        // Ordenar por timestamp y tomar la última ubicación
        locationArray.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const lastLocation = locationArray[locationArray.length - 1];

        if (lastLocation) {
          setPosition([lastLocation.latitude, lastLocation.longitude]);
          setPathHistory(locationArray);
        } else {
          console.error("Última ubicación inválida:", lastLocation);
          setError("Última ubicación inválida.");
        }
      } else {
        console.error("No se encontraron datos en el nodo `locations`.");
        setError("No se encontraron datos en el nodo `locations`.");
      }
    });

    return () => unsubscribe();
  }, [userId]);

  if (!position || position.length !== 2 || position.includes(null)) {
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

          <Marker position={position} icon={currentIcon}>
            <Popup>
              Ubicación actual
              <br />
              Lat: {position && position[0] ? position[0].toFixed(6) : "N/A"}
              <br />
              Lon: {position && position[1] ? position[1].toFixed(6) : "N/A"}
            </Popup>
          </Marker>

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
export { getLocationHistory };
