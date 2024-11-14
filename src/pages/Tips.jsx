import React from "react";
import "../styles/Tips.css";

function Tips() {
  return (
    <div className="tips-container">
      <h1 className="tips-title">Consejos y Recursos</h1>
      <ul className="tips-list">
        <li className="tips-item">
          Asegúrate de que tu perro siempre lleve una placa de identificación
          con su nombre y tu número de contacto.
        </li>
        <li className="tips-item">
          Evita paseos en horas de calor intenso durante el verano; camina en
          áreas sombreadas para evitar quemaduras en sus patas.
        </li>
        <li className="tips-item">
          Lleva a tu perro al veterinario al menos una vez al año para
          revisiones de salud y vacunas.
        </li>
        <li className="tips-item">
          Enseña a tu perro comandos básicos como "sentado", "quieto" y "ven"
          para su seguridad y comunicación.
        </li>
        <li className="tips-item">
          Al pasear en la naturaleza, mantén a tu perro alejado de plantas
          venenosas y cuerpos de agua profundos.
        </li>
        <li className="tips-item">
          Utiliza productos antiparasitarios para protegerlo de pulgas y
          garrapatas, especialmente en zonas verdes.
        </li>
        <li className="tips-item">
          Proporciónale el ejercicio adecuado según su raza y nivel de energía
          para evitar problemas de comportamiento.
        </li>
        <li className="tips-item">
          Socializa a tu perro para que sea amigable con otros perros y
          personas, facilitando paseos y encuentros en público.
        </li>
        <li className="tips-item">
          Proporciónale un lugar cómodo y seguro para descansar después de
          paseos largos o actividades intensas.
        </li>
        <li className="tips-item">
          Aprende a identificar signos de fatiga, como jadeo excesivo o letargo,
          y dale agua y descanso si es necesario.
        </li>
      </ul>
    </div>
  );
}

export default Tips;
