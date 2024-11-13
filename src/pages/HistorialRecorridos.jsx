import React, { useState, useEffect } from "react";
import "../styles/HistorialRecorridos.css";
import DynamicMap, { getLocationHistory } from "../components/DynamicMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";
import { getDatabase, ref, child, get } from "firebase/database";
import { appFirebase } from "../credenciales";
import { getAuth } from "firebase/auth";

const HistorialRecorridos = () => {
  const [historialData, setHistorialData] = useState([]);
  const [selectedRecorrido, setSelectedRecorrido] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth(appFirebase);
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      console.error("No hay un usuario autenticado.");
    }
  }, []);

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
              ([date, dateLocations]) => ({
                id: date,
                fecha: date,
                recorrido: Object.values(dateLocations),
                notas: "",
                alertas: [],
              })
            );
            setHistorialData(formattedData);
          } else {
            console.log("No se encontró historial de recorridos.");
          }
        } else {
          console.log("No se ha inicializado el ID del usuario.");
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
              <p className="recorrido-alertas">🔔 {item.alertas.join(", ")}</p>
            )}
          </div>

          {isEditing && editData && editData.id === item.id ? (
            <div className="edit-form">
              <label>
                Fecha:
                <input
                  type="date"
                  value={editData.fecha}
                  onChange={(e) => handleChangeEdit("fecha", e.target.value)}
                />
              </label>
              <label>
                Notas:
                <input
                  type="text"
                  value={editData.notas}
                  onChange={(e) => handleChangeEdit("notas", e.target.value)}
                />
              </label>
              {editData.recorrido.map((loc, index) => (
                <div key={index} className="edit-recorrido-item">
                  <label>
                    Ubicación:
                    <input
                      type="text"
                      value={`(${loc.latitude.toFixed(
                        4
                      )}, ${loc.longitude.toFixed(4)})`}
                      disabled
                    />
                  </label>
                  <label>
                    Hora:
                    <input
                      type="time"
                      value={loc.hora}
                      onChange={(e) =>
                        handleChangeEdit("hora", e.target.value, index)
                      }
                    />
                  </label>
                  <label>
                    Duración de estancia:
                    <input
                      type="text"
                      value={loc.duracion}
                      onChange={(e) =>
                        handleChangeEdit("duracion", e.target.value, index)
                      }
                    />
                  </label>
                  <label>
                    Lugar:
                    <input
                      type="text"
                      value={loc.lugar}
                      onChange={(e) =>
                        handleChangeEdit("lugar", e.target.value, index)
                      }
                    />
                  </label>
                </div>
              ))}
              <button onClick={handleSaveEdit}>Guardar Cambios</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <div>
              <ul className="recorrido-list">
                {item.recorrido.map((loc, index) => (
                  <li key={index} className="recorrido-item">
                    <p>
                      <strong>📍 Ubicación:</strong> ({loc.latitude.toFixed(4)},{" "}
                      {loc.longitude.toFixed(4)})
                    </p>

                    <p>
                      <strong>⏰ Hora:</strong> {loc.hora}
                    </p>
                    <p>
                      <strong>🕒 Duración de estancia:</strong> {loc.duracion}{" "}
                      min
                    </p>
                    <p>
                      <strong>📌 Lugar:</strong> {loc.lugar}
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

      {selectedRecorrido && <DynamicMap recorrido={selectedRecorrido} />}

      <div className="stats-container">
        <h3>Estadísticas de Recorridos</h3>
        <BarChart width={500} height={300} data={statsData}>
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tiempo" fill="#0d6efd" />
        </BarChart>
      </div>
    </div>
  );
};

export default HistorialRecorridos;
