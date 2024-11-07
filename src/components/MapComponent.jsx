import React from "react";
import "leaflet/dist/leaflet.css";
import DynamicMap from "./DynamicMap";
import { useAuth } from "../context/AuthContext";

const MapComponent = () => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <DynamicMap userId={currentUser.uid} />
  ) : (
    <p>Cargando...</p>
  );
};

export default MapComponent;
