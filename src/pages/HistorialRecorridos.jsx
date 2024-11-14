import React, { useState, useEffect } from "react";
import "../styles/HistorialRecorridos.css";
import { getLocationHistory } from "../components/DynamicMap";
import { format } from "date-fns";
import { getDatabase, ref, get } from "firebase/database";
import { appFirebase } from "../credenciales";
import { getAuth } from "firebase/auth";
import Layout from "../components/Layout";

const HistorialRecorridos = () => {
  const [historialData, setHistorialData] = useState([]);
  const [selectedRecorrido, setSelectedRecorrido] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(appFirebase);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUsuario({
          displayName: user.displayName || "Usuario",
          email: user.email,
          uid: user.uid,
        });
      } else {
        console.error("No hay un usuario autenticado.");
        setUserId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatToColombianTime = (timestamp) => {
    if (!timestamp) return "";

    // Convertir el timestamp a Date
    const date = new Date(timestamp);

    // Ajustar a hora colombiana (UTC-5)
    date.setHours(date.getHours());

    // Obtener horas y minutos
    let hours = date.getHours();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convertir a formato 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // la hora '0' debe ser '12'

    // Formatear la hora como "hh:mm AM/PM"
    const formattedTime =
      String(hours).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0") +
      " " +
      ampm;

    return formattedTime;
  };

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        if (userId) {
          const db = getDatabase(appFirebase);
          const userLocationRef = ref(db, `users/${userId}/locations`);
          const snapshot = await get(userLocationRef);

          if (snapshot.exists()) {
            const locations = snapshot.val();
            const formattedData = Object.entries(locations).map(
              ([date, dateLocations]) => {
                // Convertir el objeto de ubicaciones a un array con la hora formateada
                const recorrido = Object.entries(dateLocations).map(
                  ([key, loc]) => ({
                    ...loc,
                    hora: formatToColombianTime(loc.timestamp),
                    duracion: "0",
                    lugar: "",
                  })
                );

                return {
                  id: date,
                  fecha: date,
                  recorrido: recorrido,
                  notas: "",
                  alertas: [],
                };
              }
            );
            setHistorialData(formattedData);
          } else {
            console.log("No se encontró historial de recorridos.");
          }
        }
      } catch (error) {
        console.error("Error al cargar el historial de recorridos:", error);
      }
    };

    fetchHistorialData();
  }, [userId]);

  const statsData = historialData.map((item) => ({
    fecha: item.fecha,
    tiempo: item.recorrido.reduce(
      (acc, loc) => acc + parseInt(loc.duracion || 0),
      0
    ),
  }));

  const filteredData = historialData.filter((item) => {
    const matchesDate = filterDate ? item.fecha.includes(filterDate) : true;
    const matchesLocation = filterLocation
      ? item.recorrido.some((loc) =>
          loc.lugar?.toLowerCase().includes(filterLocation.toLowerCase())
        )
      : true;
    return matchesDate && matchesLocation;
  });

  const handleDelete = (id) => {
    setHistorialData(historialData.filter((item) => item.id !== id));
    setSelectedRecorrido(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditData({ ...item });
  };

  const handleSaveEdit = () => {
    setHistorialData(
      historialData.map((item) => (item.id === editData.id ? editData : item))
    );
    setIsEditing(false);
    setEditData(null);
    setSelectedRecorrido(null);
  };

  const handleChangeEdit = (field, value, index = null) => {
    if (index !== null) {
      const updatedRecorrido = editData.recorrido.map((loc, i) =>
        i === index ? { ...loc, [field]: value } : loc
      );
      setEditData({ ...editData, recorrido: updatedRecorrido });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleDateChange = async (date) => {
    setFilterDate(date);
    if (userId) {
      const locationHistory = await getLocationHistory(userId, date);
      setSelectedRecorrido(locationHistory);
    }
  };

  return (
    <Layout usuario={usuario}>
      <div className="historial-container">
        <h2 className="historial-title">Historial de Recorridos</h2>

        <div className="filter-container">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => handleDateChange(e.target.value)}
            placeholder="Filtrar por fecha"
          />
          <input
            type="text"
            placeholder="Filtrar por lugar"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>

        {filteredData.map((item) => (
          <div key={item.id} className="recorrido-card">
            <div
              className="recorrido-header"
              onClick={() => setSelectedRecorrido(item.recorrido)}
            >
              <h3 className="recorrido-fecha">
                📅 {format(new Date(item.fecha), "dd/MM/yyyy")}
              </h3>
              <p className="recorrido-notas">📝 {item.notas}</p>
              {item.alertas && (
                <p className="recorrido-alertas">
                  🔔 {item.alertas.join(", ")}
                </p>
              )}
            </div>

            {isEditing && editData && editData.id === item.id ? (
              <div className="edit-form">
                {/* ... (código del formulario de edición se mantiene igual) ... */}
              </div>
            ) : (
              <div>
                <ul className="recorrido-list">
                  {item.recorrido.map((loc, index) => (
                    <li key={index} className="recorrido-item">
                      <p>
                        <strong>📍 Ubicación:</strong> (
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)})
                      </p>
                      <p>
                        <strong>⏰ Hora:</strong> {loc.hora || "No disponible"}
                      </p>
                      <p>
                        <strong>🕒 Duración de estancia:</strong>{" "}
                        {loc.duracion || "0"} min
                      </p>
                      <p>
                        <strong>📌 Lugar:</strong>{" "}
                        {loc.lugar || "Sin especificar"}
                      </p>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default HistorialRecorridos;
