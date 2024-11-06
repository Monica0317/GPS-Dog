import React from "react";
import "../styles/HistorialRecorridos.css"; // Asegúrate de crear este archivo CSS

const HistorialRecorridos = () => {
  const historialData = [
    {
      id: 1,
      fecha: "2024-11-01",
      recorrido: [
        { lat: 19.4326, lon: -99.1332, hora: "08:00", duracion: "5 min" },
        { lat: 19.4331, lon: -99.1345, hora: "08:15", duracion: "10 min" },
      ],
      notas: "Paseo matutino",
      alertas: ["Llegada a la zona de parque"],
    },
    {
      id: 2,
      fecha: "2024-11-02",
      recorrido: [
        { lat: 19.4285, lon: -99.1310, hora: "14:00", duracion: "15 min" },
        { lat: 19.4290, lon: -99.1325, hora: "14:20", duracion: "10 min" },
      ],
      notas: "Paseo vespertino",
      alertas: ["Salida del parque"],
    },
  ];

  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de Recorridos</h2>
      {historialData.map((item) => (
        <div key={item.id} className="recorrido-card">
          <div className="recorrido-header">
            <h3 className="recorrido-fecha">📅 {item.fecha}</h3>
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
        </div>
      ))}
    </div>
  );
};

export default HistorialRecorridos;
