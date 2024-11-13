import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./credenciales";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Map from "./pages/Map";
import Tips from "./pages/Tips";
import HistorialRecorridos from "./pages/HistorialRecorridos";

import "./App.css";


function NavBar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/recursos">Consejos y Recursos</Link>
      <Link to="/historial">Historial de Recorridos</Link>
    </nav>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Manejo de autenticación y estado del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        sessionStorage.setItem("isAuthenticated", "true");
        setUsuario(usuarioFirebase);
      } else {
        sessionStorage.removeItem("isAuthenticated");
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas principales */}
          <Route
            path="/"
            element={
              usuario ? (
                <>
                  <NavBar />
                  <Home usuario={usuario} />
                </>
              ) : (
                <Index />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route
            path="/perfil-mascota"
            element={
              <>
                <NavBar />
                <Perfil usuario={usuario} />
              </>
            }
          />
          <Route
            path="/mapa"
            element={
              <>
                <NavBar />
                <Map usuario={usuario} />
              </>
            }
          />
          <Route
            path="/recursos"
            element={
              <>
                <NavBar />
                <Tips />
              </>
            }
          />
          <Route
            path="/historial"
            element={
              <>
                <NavBar />
                <HistorialRecorridos />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
