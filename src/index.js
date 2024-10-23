import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que App.jsx existe y está en la misma carpeta
import './index.css'; // Este archivo puede no ser necesario, pero si existe, asegúrate de que está bien

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
