import React, { useState } from "react";
import "../styles/HistorialRecorridos.css";
import DynamicMap from "../components/DynamicMap";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { format } from 'date-fns';

const HistorialRecorridos = () => {
  const [historialData, setHistorialData] = useState([
    {
      id: 1,
      fecha: "2024-11-01",
      recorrido: [
        { lat: 19.4326, lon: -99.1332, hora: "08:00", duracion: "5 min", lugar: "Parque" },
        { lat: 19.4331, lon: -99.1345, hora: "08:15", duracion: "10 min", lugar: "Calle Principal" },
      ],
      notas: "Paseo matutino",
      alertas: ["Llegada a la zona de parque"],
    },
    {
      id: 2,
      fecha: "2024-11-02",
      recorrido: [
        { lat: 19.4285, lon: -99.1310, hora: "14:00", duracion: "15 min", lugar: "Parque" },
        { lat: 19.4290, lon: -99.1325, hora: "14:20", duracion: "10 min", lugar: "Avenida" },
      ],
      notas: "Paseo vespertino",
      alertas: ["Salida del parque"],
    },
  ]);

  const [selectedRecorrido, setSelectedRecorrido] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const filteredData = historialData.filter((item) => {
    const matchesDate = filterDate ? item.fecha.includes(filterDate) : true;
    const matchesLocation = filterLocation
      ? item.recorrido.some((loc) => loc.lugar?.toLowerCase().includes(filterLocation.toLowerCase()))
      : true;
    return matchesDate && matchesLocation;
  });

  const handleDelete = (id) => {
    setHistorialData(historialData.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditData(item);
  };

  const handleSaveEdit = () => {
    setHistorialData(historialData.map((item) =>
      item.id === editData.id ? editData : item
    ));
    setIsEditing(false);
    setEditData(null);
  };

  const handleRecorridoClick = (recorrido) => {
    setSelectedRecorrido(recorrido);
  };

  const statsData = historialData.map((item) => ({
    fecha: item.fecha,
    tiempo: item.recorrido.reduce((acc, loc) => acc + parseInt(loc.duracion), 0), // suma las duraciones
  }));

  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de Recorridos</h2>
      
      {/* Filtros */}
      <div className="filter-container">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filtrar por fecha"
        />
        <input
          type="text"
          placeholder="Filtrar por lugar"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        />
      </div>

      {}
      {filteredData.map((item) => (
        <div key={item.id} className="recorrido-card">
          <div className="recorrido-header" onClick={() => handleRecorridoClick(item.recorrido)}>
            <h3 className="recorrido-fecha">📅 {format(new Date(item.fecha), 'dd/MM/yyyy')}</h3>
            <p className="recorrido-notas">📝 {item.notas}</p>
            {item.alertas && (
              <p className="recorrido-alertas">🔔 {item.alertas.join(", ")}</p>
            )}
          </div>
          <ul className="recorrido-list">
            {item.recorrido.map((loc, index) => (
              <li key={index} className="recorrido-item">
                <p><strong>📍 Ubicación:</strong> ({loc.lat.toFixed(4)}, {loc.lon.toFixed(4)})</p>
                <p><strong>⏰ Hora:</strong> {loc.hora}</p>
                <p><strong>🕒 Duración de estancia:</strong> {loc.duracion}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => handleDelete(item.id)}>Eliminar</button>
          <button onClick={() => handleEdit(item)}>Editar</button>
        </div>
      ))}

      {}
      {isEditing && editData && (
        <div className="edit-form">
          <h3>Editando Recorrido del {format(new Date(editData.fecha), 'dd/MM/yyyy')}</h3>
          <label>
            Notas:
            <input
              type="text"
              value={editData.notas}
              onChange={(e) => setEditData({ ...editData, notas: e.target.value })}
            />
          </label>
          <button onClick={handleSaveEdit}>Guardar Cambios</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}

      {}
      {selectedRecorrido && (
        <DynamicMap recorrido={selectedRecorrido} />
      )}

      {}
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
